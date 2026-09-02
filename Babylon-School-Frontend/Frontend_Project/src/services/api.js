const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";

export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const isFormData = options.body instanceof FormData;
  if (options.body && !isFormData && !headers["Content-Type"])
    headers["Content-Type"] = "application/json";
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers,
    body:
      options.body && !isFormData ? JSON.stringify(options.body) : options.body,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Something went wrong");
  return payload;
}

export const publicApi = {
  home: () => api("/home"),
  about: () => api("/about"),
  settings: () => api("/settings"),
  programs: () => api("/programs"),
  programOne: (id) => api(`/programs/${id}`),
  news: () => api("/news"),
  newsOne: (id) => api(`/news/${id}`),
  events: () => api("/events"),
  eventOne: (id) => api(`/events/${id}`),
  notices: () => api("/notices"),
  noticeOne: (id) => api(`/notices/${id}`),
  testimonials: () => api("/testimonials"),
  gallery: () => api("/gallery"),
  faculty: () => api("/faculty"),
  facultyOne: (id) => api(`/faculty/${id}`),
  facilities: () => api("/facility"),
  achievements: () => api("/achievements"),
  faqs: () => api("/faqs"),
  careers: () => api("/careers"),
  applyCareer: (body) =>
    api("/career-applications/apply", { method: "POST", body }),
  contact: (body) => api("/contacts", { method: "POST", body }),
  admission: (body) => api("/admissions", { method: "POST", body }),
  downloads: () => api("/downloads"),
  posters: () => api("/posters"),
  eca: (category) =>
    api(`/eca${category ? `?category=${encodeURIComponent(category)}` : ""}`),
  ecaOne: (id) => api(`/eca/${id}`),
};
