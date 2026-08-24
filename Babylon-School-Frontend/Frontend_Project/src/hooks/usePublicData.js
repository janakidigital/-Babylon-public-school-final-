import { useEffect, useState } from "react";

export default function usePublicData(load, fallback, deps = []) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    load()
      .then((response) => {
        if (!active) return;
        const next = response?.data;
        if (Array.isArray(fallback)) {
          setData(Array.isArray(next) ? next : []);
        } else {
          setData(next ?? fallback ?? null);
        }
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Failed to load");
        setData(Array.isArray(fallback) ? [] : fallback ?? null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
