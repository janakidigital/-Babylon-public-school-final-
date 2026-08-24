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

  return (
    <SiteContext.Provider value={{ settings, home, about, refresh, loading }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}
