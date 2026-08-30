import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { publicApi } from "../services/api";

export const fallbackSettings = {
  schoolName: "Babylon National School",
  email: "info@babylonschool.edu.np",
  phone: "+977-1-4108905, 4108973",
  address: "Shantinagar, Kathmandu, Nepal",
  shortDescription:
    "A co-ed English medium school from PG to secondary level. Education for the Quest.",
  socialLinks: { facebook: "", instagram: "", youtube: "", twitter: "", linkedin: "" },
  googleMapUrl: "",
  logo: "",
  favicon: "",
  stats: {
    studentsCount: "1000+",
    studentsLabel: "Students",
    teachersCount: "30+",
    teachersLabel: "Teachers",
    sinceValue: "1996 A.D.",
    sinceLabel: "Since",
  },
  studentLife: {
    eyebrow: "LIFE AT BABYLON",
    title: "Every day is an opportunity to shine.",
    description:
      "Beyond the classroom, students grow through sport, arts, scouting, music, dance and service — a home away from home in Shantinagar.",
    heading: "Growing with purpose and pride.",
    image: "",
  },
  pageBanners: {
    about: "",
    academics: "",
    admissions: "",
    studentLife: "",
    careers: "",
    news: "",
    events: "",
    notices: "",
    gallery: "",
    facilities: "",
    team: "",
    achievements: "",
    downloads: "",
    faq: "",
    contact: "",
    defaultBanner: "",
  },
};

const SiteContext = createContext({
  settings: fallbackSettings,
  home: null,
  about: null,
  refresh: () => {},
  loading: true,
});

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(fallbackSettings);
  const [home, setHome] = useState(null);
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsRes, homeRes, aboutRes] = await Promise.allSettled([
        publicApi.settings(),
        publicApi.home(),
        publicApi.about(),
      ]);

      if (settingsRes.status === "fulfilled" && settingsRes.value?.data) {
        const data = settingsRes.value.data;
        setSettings({
          ...fallbackSettings,
          ...data,
          socialLinks: {
            ...fallbackSettings.socialLinks,
            ...(data.socialLinks || {}),
          },
          stats: {
            ...fallbackSettings.stats,
            ...(data.stats || {}),
          },
          studentLife: {
            ...fallbackSettings.studentLife,
            ...(data.studentLife || {}),
          },
          pageBanners: {
            ...fallbackSettings.pageBanners,
            ...(data.pageBanners || {}),
          },
        });
      }

      if (homeRes.status === "fulfilled") {
        setHome(homeRes.value?.data || null);
      }

      if (aboutRes.status === "fulfilled") {
        setAbout(aboutRes.value?.data || null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onFocus = () => refresh();
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    const onSiteUpdate = () => refresh();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("site-data-updated", onSiteUpdate);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("site-data-updated", onSiteUpdate);
    };
  }, [refresh]);

  useEffect(() => {
    const faviconUrl = settings?.favicon || "/favicon.png";
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [settings?.favicon]);

  return (
    <SiteContext.Provider value={{ settings, home, about, refresh, loading }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}
