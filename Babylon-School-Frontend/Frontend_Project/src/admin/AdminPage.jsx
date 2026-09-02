import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  GraduationCap,
  Newspaper,
  Calendar,
  Bell,
  Image as ImageIcon,
  Users,
  Building2,
  Trophy,
  MessageSquareQuote,
  HelpCircle,
  Briefcase,
  Download,
  FileImage,
  ClipboardList,
  Mail,
  UserCheck,
  ShieldCheck,
  Menu,
  ExternalLink,
  LogOut,
  Layers,
  FileText,
  Clock,
  FolderKanban,
  ArrowLeft,
  Plus,
  Save,
  X,
} from "lucide-react";
import { api } from "../services/api";
import { slugify, mediaUrl } from "../lib/media";
import { assetPath } from "../data/content";
import { resources, singletons } from "./resourceConfig";
import "./Admin.css";

import LoadingScreen from "../components/common/LoadingScreen";
import "../components/common/LoadingScreen.css";
import SchoolLogo from "../components/common/SchoolLogo";

const blank = (config) =>
  Object.fromEntries(config.fields.map(([key]) => [key, ""]));

/* =========================================================
   LOGIN
========================================================= */

function Login({ onLogin }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);

    try {
      const response = await api("/users/login", {
        method: "POST",
        body: {
          email: form.get("email"),
          password: form.get("password"),
        },
      });

      if (!["admin", "superAdmin"].includes(response.data.user.role)) {
        throw new Error("This account does not have admin access");
      }

      onLogin(response.data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login">
      <form onSubmit={submit}>
        <div className="admin-login-logo">
          <SchoolLogo />
        </div>

        <h2 className="admin-login-title">Welcome to CMS</h2>
        <p className="admin-login-subtitle">Please sign-in to your account</p>

        <label>
          USERNAME OR EMAIL
          <input name="email" type="email" required placeholder="Username" />
        </label>

        <label>
          PASSWORD
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••••••"
          />
        </label>

        {error && <p className="admin-error">{error}</p>}

        <button className="button primary admin-login-btn" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <a href="/">Return to website</a>
      </form>
    </main>
  );
}

/* =========================================================
   RESOURCE EDITOR
========================================================= */

function ResourceEditor({ resourceKey, onBack }) {
  const config = resources[resourceKey];

  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");

  const formValues = useMemo(() => {
    if (!editing) return blank(config);

    const values = { ...blank(config), ...editing };

    // Pre-fill videoUrls textarea from saved videos array
    if (Array.isArray(editing.videos) && editing.videos.length > 0) {
      values.videoUrls = editing.videos
        .map((v) => v.url)
        .filter(Boolean)
        .join("\n");
    }

    return values;
  }, [editing, config]);

  const load = async () => {
    setLoading(true);

    try {
      const response = await api(config.endpoint);
      setItems(response.data || []);
    } catch (err) {
      setMessage(err.message);
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [resourceKey]);

  const openEditor = (item = {}) => {
    setEditing(item);
    setSelectedType(
      item.mediaType || item.type || item.category || (resourceKey === "gallery" ? "Photos" : "")
    );
  };

  async function save(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    /*
     * Determine selected gallery type.
     * Supports either "type" or "category".
     */
    const selectedTypeValue =
      form.get("type") ||
      form.get("category") ||
      selectedType ||
      "";

    const isVideo = String(selectedTypeValue).toLowerCase() === "videos";

    if (resourceKey === "gallery") {
      form.set("type", isVideo ? "Videos" : "Photos");
      form.set("mediaType", isVideo ? "Videos" : "Photos");
    }

    const image = form.get("image");

    // Only delete image if there's no file selected
    if (!image?.name) {
      form.delete("image");
    }

    const fileField = config.fileField || "attachment";
    const file = form.get(fileField);

    if (!file?.name) {
      form.delete(fileField);
    }

    if (form.has("slug") && !String(form.get("slug") || "").trim()) {
      form.set(
        "slug",
        slugify(
          form.get("title") ||
            form.get("name") ||
            `item-${Date.now()}`,
        ),
      );
    }

    config.fields.forEach(([key, , type]) => {
      if (type === "checkbox") {
        form.set(key, form.has(key) ? "true" : "false");
      }
    });

    /*
     * For video items:
     * - Only delete description (images/videos are still needed)
     * - DO NOT delete the "image" field - it contains uploaded video files!
     */
    if (isVideo) {
      form.delete("description");
      // IMPORTANT: Do NOT delete "image" - it contains video files!
    }

    // Keep existing images after user removes some
    if (config.multiple && editing?.images) {
      form.set(
        "existingImages",
        JSON.stringify(editing.images),
      );
    }

    // FIXED: Keep existing videos after user removes some
    if (config.multiple && editing?.videos) {
      form.set(
        "existingVideos",
        JSON.stringify(editing.videos),
      );
    }

    const body =
      config.image || config.file
        ? form
        : Object.fromEntries(form.entries());

    try {
      await api(
        `${config.endpoint}${editing?._id ? `/${editing._id}` : ""}`,
        {
          method: editing?._id ? "PUT" : "POST",
          body,
        },
      );

      setEditing(null);
      setSelectedType("");
      setMessage(`${config.label} saved successfully.`);

      toast.success(`${config.label} saved successfully.`);

      window.dispatchEvent(
        new CustomEvent("site-data-updated"),
      );

      load();
    } catch (err) {
      setMessage(err.message);
      toast.error(err.message || "An error occurred");
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this item?")) return;

    try {
      await api(`${config.endpoint}/${id}`, {
        method: "DELETE",
      });

      setMessage("Item deleted.");
      toast.success("Item deleted.");

      window.dispatchEvent(
        new CustomEvent("site-data-updated"),
      );

      load();
    } catch (err) {
      setMessage(err.message);
      toast.error(err.message || "An error occurred");
    }
  }

  function removeImage(index) {
    if (!editing?.images) return;

    const updatedImages = editing.images.filter(
      (_, i) => i !== index,
    );

    setEditing({
      ...editing,
      images: updatedImages,
      coverImage:
        editing.coverImage === editing.images[index]?.url
          ? updatedImages[0]?.url || ""
          : editing.coverImage,
    });
  }

  function removeVideo(index) {
    if (!editing?.videos) return;

    const updatedVideos = editing.videos.filter(
      (_, i) => i !== index,
    );

    setEditing({
      ...editing,
      videos: updatedVideos,
      coverImage:
        updatedVideos.length > 0
          ? updatedVideos[0].url
          : editing.coverImage || "",
    });
  }

  /*
   * Check whether the current editing item is a video.
   */
  const editingIsVideo =
    String(selectedType).toLowerCase() === "videos";

  return (
    <section className="admin-resource">
      <div className="admin-resource-head">
        <div>
          <button
            type="button"
            className="admin-back"
            onClick={onBack}
          >
            <ArrowLeft size={16} /> Dashboard
          </button>
          <p className="eyebrow">CONTENT EDITOR</p>
          <h2>{config.label}</h2>
        </div>

        <button
          type="button"
          className="button primary"
          onClick={() => openEditor({})}
        >
          <Plus size={16} /> Add {config.label.slice(0, -1)}
        </button>
      </div>

      {message && (
        <p className="admin-message">{message}</p>
      )}

      {editing !== null && (
        <form
          className="admin-form"
          onSubmit={save}
        >
          {config.fields.map(
            ([key, label, type = "text", options]) => {
              if (type === "select") {
                return (
                  <label key={key}>
                    {label}

                    <select
                      name={key}
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      required
                    >
                      <option value="">
                        — Select category —
                      </option>

                      {(options || []).map((opt) => (
                        <option
                          key={opt}
                          value={opt}
                        >
                          {opt}
                        </option>
                      ))}
                    </select>
                  </label>
                );
              }

              if (type === "checkbox") {
                return (
                  <label
                    key={key}
                    className="admin-checkbox"
                  >
                    <input
                      name={key}
                      type="checkbox"
                      defaultChecked={
                        formValues[key] === true ||
                        formValues[key] === "true" ||
                        formValues[key] === "on"
                      }
                    />

                    <span>{label}</span>
                  </label>
                );
              }

              if (
                key === "description" &&
                editingIsVideo
              ) {
                return null;
              }

              if (key === "videoUrls") {
                if (!editingIsVideo) {
                  return null;
                }

                return (
                  <label
                    key={key}
                    style={{
                      gridColumn: "1 / -1",
                    }}
                  >
                    {label || "YouTube Video URLs"}

                    <textarea
                      name={key}
                      defaultValue={
                        formValues[key] || ""
                      }
                      rows={6}
                      placeholder={`Enter one YouTube URL per line\nhttps://www.youtube.com/watch?v=...\nhttps://www.youtube.com/watch?v=...`}
                    />

                    <small
                      style={{
                        display: "block",
                        marginTop: 6,
                        color: "#666",
                      }}
                    >
                      Enter one YouTube video URL per line. You can also upload video files below.
                    </small>
                  </label>
                );
              }

              return (
                <label key={key}>
                  {label}

                  {type === "textarea" ? (
                    <textarea
                      name={key}
                      defaultValue={
                        formValues[key] || ""
                      }
                      required={[
                        "title",
                        "name",
                        "question",
                        "description",
                        "content",
                      ].includes(key)}
                    />
                  ) : (
                    <input
                      name={key}
                      type={type}
                      defaultValue={
                        type === "date" &&
                        formValues[key]
                          ? String(
                              formValues[key],
                            ).slice(0, 10)
                          : formValues[key] || ""
                      }
                      required={[
                        "title",
                        "name",
                        "question",
                        "description",
                        "content",
                      ].includes(key)}
                    />
                  )}
                </label>
              );
            },
          )}

          {/* IMAGE / VIDEO UPLOAD */}
          {config.image && (
            <label
              style={{
                gridColumn: "1 / -1",
              }}
            >
              {editingIsVideo
                ? "Upload Video Files (select many)"
                : config.multiple
                ? "Upload Images (select many)"
                : "Image upload"}

              <input
                name="image"
                type="file"
                accept={
                  editingIsVideo
                    ? "video/*,.mp4,.mov,.webm,.mkv,.avi,.m4v"
                    : "image/*,.jpg,.jpeg,.png,.webp,.avif"
                }
                multiple={!!config.multiple}
              />

              {editing?.image &&
                !config.multiple &&
                !editingIsVideo && (
                  <small
                    style={{
                      display: "block",
                      marginTop: 6,
                      color: "#666",
                    }}
                  >
                    Current: {editing.image}
                  </small>
                )}

              {editingIsVideo && (
                <small
                  style={{
                    display: "block",
                    marginTop: 6,
                    color: "#666",
                  }}
                >
                  You can upload MP4, WebM, or other video formats
                </small>
              )}

              {!editingIsVideo && config.multiple && (
                <small
                  style={{
                    display: "block",
                    marginTop: 6,
                    color: "#666",
                  }}
                >
                  You can select 15+ images at once
                </small>
              )}

              {/* Existing images for Photo albums */}
              {!editingIsVideo &&
                config.multiple &&
                editing?.images?.length > 0 && (
                  <div style={{ marginTop: "16px" }}>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        marginBottom: "10px",
                        color: "#1a365d",
                      }}
                    >
                      Current Images ({editing.images.length}) — click × to remove
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(100px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      {editing.images.map((img, index) => (
                        <div
                          key={index}
                          style={{
                            position: "relative",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={img.url}
                            alt={img.caption || `Image ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "90px",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />

                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            style={{
                              position: "absolute",
                              top: "4px",
                              right: "4px",
                              background: "#c53030",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              width: "22px",
                              height: "22px",
                              fontSize: "14px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              lineHeight: 1,
                            }}
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Existing videos for Video albums */}
              {editingIsVideo &&
                editing?.videos?.length > 0 && (
                  <div style={{ marginTop: "16px" }}>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        marginBottom: "10px",
                        color: "#1a365d",
                      }}
                    >
                      Current Videos ({editing.videos.length})
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(180px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      {editing.videos.map((video, index) => (
                        <div
                          key={index}
                          style={{
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            padding: "8px",
                            background: "#f7fafc",
                          }}
                        >
                          {video.type === "youtube" ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <span>🎬</span>
                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: "12px",
                                  wordBreak: "break-all",
                                  color: "#063b78",
                                }}
                              >
                                YouTube Video
                              </a>
                            </div>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <span>🎥</span>
                              <video
                                src={mediaUrl(video.url) || video.url}
                                controls
                                style={{
                                  width: "100%",
                                  maxHeight: "100px",
                                  borderRadius: "4px",
                                }}
                              />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeVideo(index)}
                            style={{
                              marginTop: "6px",
                              background: "#c53030",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              padding: "4px 8px",
                              fontSize: "12px",
                              cursor: "pointer",
                              width: "100%",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </label>
          )}

          {/* PDF / ATTACHMENT */}
          {config.file && (
            <label>
              {config.fileLabel || "Attachment (PDF)"}{" "}
              <span
                style={{
                  fontWeight: 400,
                  color: "#666",
                  fontSize: "13px",
                }}
              >
                (optional)
              </span>

              <input
                name={config.fileField || "attachment"}
                type="file"
                accept={
                  config.fileAccept || ".pdf,application/pdf"
                }
              />

              {editing?.[config.fileField || "attachment"] && (
                <small
                  style={{
                    display: "block",
                    marginTop: 6,
                    color: "#666",
                  }}
                >
                  Current file:{" "}
                  {editing[config.fileField || "attachment"]}
                </small>
              )}

              <small
                style={{
                  display: "block",
                  marginTop: 4,
                  color: "#888",
                }}
              >
                Leave empty if you only want to add a title,
                category, or link in the description.
              </small>
            </label>
          )}

          <div>
            <button className="button primary" type="submit">
              Save changes <span>&rarr;</span>
            </button>

            <button
              className="admin-cancel"
              type="button"
              onClick={() => {
                setEditing(null);
                setSelectedType("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading {config.label.toLowerCase()}...</p>
      ) : (
        <div className="admin-table">
          {items.length === 0 ? (
            <p>No {config.label.toLowerCase()} yet.</p>
          ) : (
            items.map((item) => (
              <article key={item._id}>
                <div>
                  {(item.coverImage || item.image) && (
                    <img
                      src={item.coverImage || item.image}
                      alt=""
                      style={{
                        width: 70,
                        height: 58,
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <div>
                    <h3>
                      {item.title || item.name || item.question}
                    </h3>

                    <p>
                      {item.shortDescription ||
                        item.description ||
                        item.designation ||
                        item.category ||
                        item.answer ||
                        (item.videos
                          ? `${item.videos.length} videos`
                          : item.images
                            ? `${item.images.length} photos`
                            : "No description")}
                    </p>

                    {item.attachment && (
                      <p style={{ marginTop: 6 }}>
                        <a
                          href={item.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📄 View Attachment
                        </a>
                      </p>
                    )}

                    {item.videos?.length > 0 && (
                      <p style={{ marginTop: 6 }}>
                        🎥 {item.videos.length} video
                        {item.videos.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>

                <div className="admin-row-actions">
                  <button
                    type="button"
                    onClick={() => openEditor(item)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete"
                    onClick={() => remove(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}

/* =========================================================
   SITE SETTINGS & PAGE COVERS EDITOR
========================================================= */

const PAGE_BANNER_DEFINITIONS = [
  {
    key: "careers",
    title: "Careers / Vacancies",
    eyebrow: "CAREERS",
    defaultImg: "banner/instructor.jpg",
    heading: "Teach, inspire and grow with us.",
    description:
      "Header background banner for Careers and Job application page",
  },
  {
    key: "studentLife",
    title: "Student Life",
    eyebrow: "STUDENT LIFE",
    defaultImg: "banner/inner_banner_4.jpg",
    heading: "A vibrant life beyond class.",
    description: "Header background banner for Student Life overview page",
  },
  {
    key: "about",
    title: "About Us",
    eyebrow: "ABOUT BABYLON",
    defaultImg: "banner/inner_banner_2.jpg",
    heading: "A co-ed English medium school since 1996.",
    description: "Header background banner for About Babylon page",
  },
  {
    key: "academics",
    title: "Academics & Courses",
    eyebrow: "OUR ACADEMICS",
    defaultImg: "banner/inner_banner_3.jpg",
    heading: "Learning with purpose.",
    description:
      "Header background banner for Academic Programmes & Courses pages",
  },
  {
    key: "admissions",
    title: "Admissions",
    eyebrow: "ADMISSIONS",
    defaultImg: "banner/inner_banner_1.jpg",
    heading: "Begin your Babylon journey.",
    description:
      "Header background banner for Admissions & Application form page",
  },
  {
    key: "news",
    title: "News & Stories",
    eyebrow: "SCHOOL STORIES",
    defaultImg: "banner/inner_banner_1.jpg",
    heading: "News & Blog from the Babylon community.",
    description: "Header background banner for News, Articles, and Blog pages",
  },
  {
    key: "events",
    title: "School Events",
    eyebrow: "SCHOOL EVENTS",
    defaultImg: "banner/inner_banner_4.jpg",
    heading: "Moments that bring us together.",
    description: "Header background banner for School Events & Calendar",
  },
  {
    key: "notices",
    title: "Notice Board",
    eyebrow: "SCHOOL UPDATES",
    defaultImg: "banner/inner_banner_5.jpg",
    heading: "Notices and announcements.",
    description: "Header background banner for Notices & Circulars page",
  },
  {
    key: "gallery",
    title: "Photo Gallery",
    eyebrow: "GALLERY",
    defaultImg: "banner/inner_banner_4.jpg",
    heading: "Moments from Babylon.",
    description: "Header background banner for Photo Gallery albums",
  },
  {
    key: "team",
    title: "Our Team",
    eyebrow: "OUR TEAM",
    defaultImg: "banner/inner_banner_2.jpg",
    heading: "Meet the people behind Babylon.",
    description: "Header background banner for Our Team page",
  },
  {
    key: "facilities",
    title: "Campus Facilities",
    eyebrow: "OUR FACILITIES",
    defaultImg: "banner/inner_banner_5.jpg",
    heading: "Spaces designed for discovery.",
    description:
      "Header background banner for Facilities & Infrastructure page",
  },
  {
    key: "achievements",
    title: "Achievements",
    eyebrow: "ACHIEVEMENTS",
    defaultImg: "banner/counter_bg.jpg",
    heading: "Celebrating every success.",
    description: "Header background banner for Achievements & Honors page",
  },
  {
    key: "downloads",
    title: "Downloads & Forms",
    eyebrow: "RESOURCES",
    defaultImg: "banner/inner_banner_5.jpg",
    heading: "Downloads & Documents",
    description: "Header background banner for PDF forms & downloads page",
  },
  {
    key: "faq",
    title: "FAQ & Help",
    eyebrow: "FAQ",
    defaultImg: "banner/inner_banner_5.jpg",
    heading: "How can we help?",
    description: "Header background banner for Frequently Asked Questions page",
  },
  {
    key: "contact",
    title: "Contact Us",
    eyebrow: "GET IN TOUCH",
    defaultImg: "banner/inner_banner_1.jpg",
    heading: "We would love to hear from you.",
    description: "Header background banner for Contact page",
  },
  {
    key: "defaultBanner",
    title: "Default Fallback Banner",
    eyebrow: "BABYLON NATIONAL",
    defaultImg: "banner/inner_banner_1.jpg",
    heading: "Education for the Quest",
    description:
      "General fallback background for detail pages without a specific cover",
  },
];

function SiteSettingsEditor({ onBack }) {
  const [activeTab, setActiveTab] = useState("general");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [selectedFiles, setSelectedFiles] = useState({});
  const [previewUrls, setPreviewUrls] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await api("/settings");
      setData(res.data || {});
    } catch (err) {
      toast.error(err.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleFileChange = (fieldKey, file) => {
    if (!file) return;
    setSelectedFiles((prev) => ({ ...prev, [fieldKey]: file }));
    const url = URL.createObjectURL(file);
    setPreviewUrls((prev) => ({ ...prev, [fieldKey]: url }));
  };

  const handleClearFile = (fieldKey) => {
    setSelectedFiles((prev) => {
      const copy = { ...prev };
      delete copy[fieldKey];
      return copy;
    });
    setPreviewUrls((prev) => {
      const copy = { ...prev };
      delete copy[fieldKey];
      return copy;
    });
  };

  const handleResetBanner = (bannerKey) => {
    handleClearFile(`banner_${bannerKey}`);
    setData((prev) => ({
      ...prev,
      pageBanners: {
        ...(prev.pageBanners || {}),
        [bannerKey]: "",
      },
    }));
  };

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    Object.entries(selectedFiles).forEach(([fieldKey, file]) => {
      formData.set(fieldKey, file);
    });

    try {
      await api("/settings", {
        method: "PUT",
        body: formData,
      });

      toast.success("Site settings saved successfully!");
      setMessage("Site settings saved successfully.");
      window.dispatchEvent(new CustomEvent("site-data-updated"));
      setSelectedFiles({});
      setPreviewUrls({});
      load();
    } catch (err) {
      toast.error(err.message || "Failed to save settings");
      setMessage(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="admin-resource">
        <p>Loading site settings...</p>
      </section>
    );
  }

  const stats = data?.stats || {};
  const studentLife = data?.studentLife || {};
  const pageBanners = data?.pageBanners || {};

  return (
    <section className="admin-resource">
      <div className="admin-resource-head">
        <div>
          <button type="button" className="admin-back" onClick={onBack}>
            <ArrowLeft size={16} /> Dashboard
          </button>
          <p className="eyebrow">SITE CONFIGURATION</p>
          <h2>Site Settings</h2>
        </div>
      </div>

      {message && <p className="admin-message">{message}</p>}

      <div className="admin-tabs-nav">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "general" ? "active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          <span>⚙️</span> General & Contact
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          <span>📊</span> Statistics & Student Life
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "banners" ? "active" : ""}`}
          onClick={() => setActiveTab("banners")}
        >
          <span>🖼️</span> Page Cover Images (Banners)
        </button>
      </div>

      <form className="admin-form singleton-form" onSubmit={save}>
        {activeTab === "general" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>🏫 School & Contact Information</h3>
            </div>
            <div className="admin-card-body">
              <label className="admin-field">
                <span className="admin-field-label">School Name</span>
                <input
                  name="schoolName"
                  type="text"
                  defaultValue={data?.schoolName || "Babylon National School"}
                  required
                />
              </label>

              <label className="admin-field">
                <span className="admin-field-label">Email Address</span>
                <input
                  name="email"
                  type="email"
                  defaultValue={data?.email || "info@babylonschool.edu.np"}
                />
              </label>

              <label className="admin-field">
                <span className="admin-field-label">Phone Number</span>
                <input
                  name="phone"
                  type="text"
                  defaultValue={data?.phone || "+977-1-4108905, 4108973"}
                />
              </label>

              <label className="admin-field">
                <span className="admin-field-label">Address</span>
                <textarea
                  name="address"
                  rows={3}
                  defaultValue={
                    data?.address || "Shantinagar, Kathmandu, Nepal"
                  }
                />
              </label>

              <label className="admin-field">
                <span className="admin-field-label">
                  Short Description (Footer / Meta)
                </span>
                <textarea
                  name="shortDescription"
                  rows={3}
                  defaultValue={
                    data?.shortDescription ||
                    "A co-ed English medium school from PG to secondary level. Education for the Quest."
                  }
                />
              </label>

              <label className="admin-field">
                <span className="admin-field-label">Google Map Embed URL</span>
                <input
                  name="googleMapUrl"
                  type="text"
                  defaultValue={data?.googleMapUrl || ""}
                  placeholder="https://www.google.com/maps/embed?..."
                />
              </label>
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>🔢 Site Statistics (Shown in Student Life & Home)</h3>
              </div>
              <div className="admin-card-body">
                <p
                  style={{
                    color: "var(--admin-muted)",
                    fontSize: "14px",
                    margin: "0 0 16px",
                  }}
                >
                  Customize the 3 main statistics counters and labels displayed
                  on the website.
                </p>

                <div className="admin-stats-inputs-grid">
                  <div className="admin-stat-box">
                    <div className="admin-stat-box-title">
                      <span>👨‍🎓</span> Statistic 1 (Students)
                    </div>
                    <label className="admin-field">
                      <span className="admin-field-label">Count / Value</span>
                      <input
                        name="stats[studentsCount]"
                        type="text"
                        defaultValue={stats.studentsCount ?? "1000+"}
                        placeholder="e.g. 1000+"
                      />
                    </label>
                    <label className="admin-field" style={{ marginTop: 10 }}>
                      <span className="admin-field-label">Label Text</span>
                      <input
                        name="stats[studentsLabel]"
                        type="text"
                        defaultValue={stats.studentsLabel ?? "Students"}
                        placeholder="e.g. Students"
                      />
                    </label>
                  </div>

                  <div className="admin-stat-box">
                    <div className="admin-stat-box-title">
                      <span>👩‍🏫</span> Statistic 2 (Teachers)
                    </div>
                    <label className="admin-field">
                      <span className="admin-field-label">Count / Value</span>
                      <input
                        name="stats[teachersCount]"
                        type="text"
                        defaultValue={stats.teachersCount ?? "30+"}
                        placeholder="e.g. 30+"
                      />
                    </label>
                    <label className="admin-field" style={{ marginTop: 10 }}>
                      <span className="admin-field-label">Label Text</span>
                      <input
                        name="stats[teachersLabel]"
                        type="text"
                        defaultValue={stats.teachersLabel ?? "Teachers"}
                        placeholder="e.g. Teachers"
                      />
                    </label>
                  </div>

                  <div className="admin-stat-box">
                    <div className="admin-stat-box-title">
                      <span>🏛️</span> Statistic 3 (Since / Established)
                    </div>
                    <label className="admin-field">
                      <span className="admin-field-label">Year / Value</span>
                      <input
                        name="stats[sinceValue]"
                        type="text"
                        defaultValue={stats.sinceValue ?? "1996 A.D."}
                        placeholder="e.g. 1996 A.D."
                      />
                    </label>
                    <label className="admin-field" style={{ marginTop: 10 }}>
                      <span className="admin-field-label">Label Text</span>
                      <input
                        name="stats[sinceLabel]"
                        type="text"
                        defaultValue={stats.sinceLabel ?? "Since"}
                        placeholder="e.g. Since"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h3>🎒 Student Life Section Content & Photo</h3>
              </div>
              <div className="admin-card-body">
                <label className="admin-field">
                  <span className="admin-field-label">Section Eyebrow</span>
                  <input
                    name="studentLife[eyebrow]"
                    type="text"
                    defaultValue={studentLife.eyebrow ?? "LIFE AT BABYLON"}
                  />
                </label>

                <label className="admin-field">
                  <span className="admin-field-label">Section Title</span>
                  <input
                    name="studentLife[title]"
                    type="text"
                    defaultValue={
                      studentLife.title ??
                      "Every day is an opportunity to shine."
                    }
                  />
                </label>

                <label className="admin-field">
                  <span className="admin-field-label">Section Description</span>
                  <textarea
                    name="studentLife[description]"
                    rows={3}
                    defaultValue={
                      studentLife.description ??
                      "Beyond the classroom, students grow through sport, arts, scouting, music, dance and service — a home away from home in Shantinagar."
                    }
                  />
                </label>

                <label className="admin-field">
                  <span className="admin-field-label">
                    Bottom Heading (Above Stats)
                  </span>
                  <input
                    name="studentLife[heading]"
                    type="text"
                    defaultValue={
                      studentLife.heading ?? "Growing with purpose and pride."
                    }
                  />
                </label>

                <div className="admin-field" style={{ marginTop: 14 }}>
                  <span className="admin-field-label">
                    Student Life Section Photo
                  </span>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--admin-muted)",
                      margin: "0 0 8px",
                    }}
                  >
                    Upload a high-quality photo to display in the Student Life
                    section.
                  </p>

                  <div className="admin-photo-preview-box">
                    <img
                      src={
                        previewUrls.studentLifePhoto ||
                        (studentLife.image
                          ? mediaUrl(studentLife.image)
                          : `${assetPath}banner/banner_2.jpg`)
                      }
                      alt="Student Life Preview"
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "10px",
                      alignItems: "center",
                    }}
                  >
                    <label className="admin-file-upload-label">
                      <span>📁</span> Choose New Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="admin-file-upload-input"
                        onChange={(e) =>
                          handleFileChange(
                            "studentLifePhoto",
                            e.target.files?.[0],
                          )
                        }
                      />
                    </label>

                    {(previewUrls.studentLifePhoto || studentLife.image) && (
                      <button
                        type="button"
                        className="admin-banner-reset-btn"
                        onClick={() => {
                          handleClearFile("studentLifePhoto");
                          setData((prev) => ({
                            ...prev,
                            studentLife: {
                              ...(prev.studentLife || {}),
                              image: "",
                            },
                          }));
                        }}
                      >
                        Revert to default photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "banners" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>🖼️ Page Header Cover Images (Banners)</h3>
            </div>
            <div className="admin-card-body">
              <p
                style={{
                  color: "var(--admin-muted)",
                  fontSize: "14px",
                  margin: "0 0 20px",
                }}
              >
                Upload custom cover images for each page banner across the
                website. The dark blue gradient overlay will be automatically
                applied just like on the live site.
              </p>

              <div className="admin-banner-grid">
                {PAGE_BANNER_DEFINITIONS.map((banner) => {
                  const customImg = pageBanners[banner.key];
                  const previewImg =
                    previewUrls[`banner_${banner.key}`] ||
                    (customImg
                      ? mediaUrl(customImg)
                      : `${assetPath}${banner.defaultImg}`);

                  return (
                    <div key={banner.key} className="admin-banner-card">
                      <div
                        className="admin-banner-preview"
                        style={{
                          backgroundImage: `url(${previewImg})`,
                        }}
                      >
                        <div className="admin-banner-preview-content">
                          <p className="eyebrow">{banner.eyebrow}</p>
                          <h4>{banner.heading}</h4>
                        </div>
                      </div>

                      <div className="admin-banner-card-body">
                        <h4 className="admin-banner-card-title">
                          {banner.title}
                        </h4>
                        <p className="admin-banner-card-desc">
                          {banner.description}
                        </p>

                        <div className="admin-banner-card-actions">
                          <label className="admin-file-upload-label">
                            <span>📷</span> Change Image
                            <input
                              type="file"
                              accept="image/*"
                              className="admin-file-upload-input"
                              onChange={(e) =>
                                handleFileChange(
                                  `banner_${banner.key}`,
                                  e.target.files?.[0],
                                )
                              }
                            />
                          </label>

                          {(previewUrls[`banner_${banner.key}`] ||
                            customImg) && (
                            <button
                              type="button"
                              className="admin-banner-reset-btn"
                              onClick={() => handleResetBanner(banner.key)}
                              title="Revert to default"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="admin-form-actions" style={{ marginTop: 20 }}>
          <button
            className="button primary"
            disabled={saving}
            style={{ padding: "12px 28px", fontSize: "15px" }}
          >
            {saving ? "Saving changes..." : "Save All Changes"}{" "}
            <span>&rarr;</span>
          </button>
        </div>
      </form>
    </section>
  );
}

/* =========================================================
   SINGLETON EDITOR
========================================================= */

function SingletonEditor({ singletonKey, onBack }) {
  const config = singletons[singletonKey];
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const response = await api(config.endpoint);
      setData(response.data || {});
    } catch (err) {
      setMessage(err.message);
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [singletonKey]);

  async function save(event) {
    event.preventDefault();
    setMessage("");
    setSaving(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const formDataObj = Object.fromEntries(formData.entries());
    const body = {};

    Object.entries(config.schema).forEach(([section, fields]) => {
      if (section !== "root") body[section] = {};
      fields.forEach(([key]) => {
        if (section === "root") {
          body[key] = formDataObj[`${section}.${key}`];
        } else {
          body[section][key] = formDataObj[`${section}.${key}`];
        }
      });
    });

    try {
      await api(config.endpoint, { method: "PUT", body });
      setMessage(`${config.label} saved successfully.`);
      toast.success(`${config.label} saved successfully.`);
      window.dispatchEvent(new CustomEvent("site-data-updated"));
      load();
    } catch (err) {
      setMessage(err.message);
      toast.error(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-resource">
      <div className="admin-resource-head">
        <div>
          <button type="button" className="admin-back" onClick={onBack}>
            <ArrowLeft size={16} /> Dashboard
          </button>
          <p className="eyebrow">SITE SETTINGS</p>
          <h2>{config.label}</h2>
        </div>
      </div>

      {message && <p className="admin-message">{message}</p>}

      {loading ? (
        <p>Loading {config.label.toLowerCase()}...</p>
      ) : (
        <form className="admin-form singleton-form" onSubmit={save}>
          {Object.entries(config.schema).map(([section, fields]) => (
            <div key={section} className="admin-card">
              <div className="admin-card-header">
                <h3>{section === "root" ? "General Settings" : section}</h3>
              </div>

              <div className="admin-card-body">
                {fields.map(([key, label, type = "text"]) => {
                  if (type === "checkbox") {
                    return (
                      <label key={key} className="admin-checkbox">
                        <input
                          name={`${section}.${key}`}
                          type="checkbox"
                          defaultChecked={
                            section === "root"
                              ? data?.[key] === true || data?.[key] === "true"
                              : data?.[section]?.[key] === true ||
                                data?.[section]?.[key] === "true"
                          }
                        />
                        <span>{label}</span>
                      </label>
                    );
                  }

                  return (
                    <label key={key} className="admin-field">
                      <span className="admin-field-label">{label}</span>
                      {type === "textarea" ? (
                        <textarea
                          name={`${section}.${key}`}
                          rows={5}
                          defaultValue={
                            section === "root"
                              ? data?.[key] || ""
                              : data?.[section]?.[key] || ""
                          }
                        />
                      ) : (
                        <input
                          name={`${section}.${key}`}
                          type={type}
                          defaultValue={
                            section === "root"
                              ? data?.[key] || ""
                              : data?.[section]?.[key] || ""
                          }
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="admin-form-actions">
            <button className="button primary" disabled={saving}>
              {saving ? "Saving..." : "Save changes"} <span>&rarr;</span>
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

/* =========================================================
   GENERIC INBOX
========================================================= */

function Inbox({ endpoint, title, fields, onBack }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = () => {
    setLoading(true);
    api(endpoint)
      .then((response) => setItems(response.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [endpoint]);

  async function remove(id) {
    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }
    try {
      await api(`${endpoint}/${id}`, { method: "DELETE" });
      setMessage("Application deleted successfully.");
      toast.success("Application deleted successfully.");
      load();
    } catch (err) {
      setMessage(err.message || "Failed to delete application.");
      toast.error(
        err.message || "Failed to delete application." || "An error occurred",
      );
    }
  }

  return (
    <section className="admin-resource">
      <div className="admin-resource-head">
        <div>
          <button type="button" className="admin-back" onClick={onBack}>
            <ArrowLeft size={16} /> Dashboard
          </button>
          <p className="eyebrow">INBOX</p>
          <h2>{title}</h2>
        </div>
      </div>

      {message && <p className="admin-message">{message}</p>}

      <div className="admin-table">
        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          items.map((item) => (
            <article key={item._id}>
              <div>
                <h3>{item.name || item.fullName || item.email}</h3>
                {fields.map((field) => (
                  <p key={field}>
                    <b>{field}:</b> {item[field] || "—"}
                  </p>
                ))}
                {(item.resumeUrl || item.cv || item.resume) && (
                  <p style={{ marginTop: "10px" }}>
                    <a
                      href={item.resumeUrl || item.cv || item.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📄 Download / View CV
                    </a>
                  </p>
                )}
              </div>
              <div className="admin-row-actions">
                <span className="status-chip">{item.status || "New"}</span>
                <button
                  type="button"
                  className="delete"
                  onClick={() => remove(item._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

/* =========================================================
   CONTACTS INBOX
========================================================= */

function ContactsInbox({ onBack }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const response = await api("/contacts");
      setItems(response.data || []);
    } catch (err) {
      setMessage(err.message || "Failed to load contact messages.");
      toast.error(err.message || "Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }
    try {
      await api(`/contacts/${id}`, { method: "DELETE" });
      setMessage("Message deleted successfully.");
      toast.success("Message deleted successfully.");
      load();
    } catch (err) {
      setMessage(err.message || "Failed to delete message.");
      toast.error(err.message || "Failed to delete message.");
    }
  }

  function formatDate(date) {
    if (!date) return "—";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "—";
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <section className="admin-resource">
      <div className="admin-resource-head">
        <button type="button" className="admin-back" onClick={onBack}>
          ← Dashboard
        </button>
        <div>
          <p className="eyebrow">INBOX</p>
          <h2>Contact Messages</h2>
        </div>
      </div>

      {message && <p className="admin-message">{message}</p>}

      <div className="admin-table">
        {loading ? (
          <p>Loading contact messages...</p>
        ) : items.length === 0 ? (
          <p>No contact messages yet.</p>
        ) : (
          items.map((item) => (
            <article
              key={item._id}
              style={{ display: "block", padding: "24px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h3 style={{ marginBottom: "6px" }}>
                    {item.name || item.fullName || "Unknown"}
                  </h3>
                  <p style={{ margin: 0 }}>
                    Subject: <strong>{item.subject || "—"}</strong>
                  </p>
                </div>
                <span className="status-chip">{item.status || "New"}</span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <strong>Name</strong>
                  <p>{item.name || item.fullName || "—"}</p>
                </div>
                <div>
                  <strong>Email</strong>
                  <p>{item.email || "—"}</p>
                </div>
                <div>
                  <strong>Phone</strong>
                  <p>{item.phone || "—"}</p>
                </div>
                <div>
                  <strong>Subject</strong>
                  <p>{item.subject || "—"}</p>
                </div>
                <div>
                  <strong>Submitted</strong>
                  <p>{formatDate(item.createdAt)}</p>
                </div>
              </div>

              {item.message && (
                <div
                  style={{
                    padding: "15px",
                    background: "#f7fafc",
                    borderRadius: "8px",
                    marginBottom: "15px",
                  }}
                >
                  <strong>Message</strong>
                  <p style={{ marginBottom: 0, whiteSpace: "pre-wrap" }}>
                    {item.message}
                  </p>
                </div>
              )}

              <div className="admin-row-actions">
                <button
                  type="button"
                  className="delete"
                  onClick={() => remove(item._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

/* =========================================================
   CAREER APPLICATIONS INBOX
========================================================= */

function CareerAppsInbox({ onBack }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [expanded, setExpanded] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const response = await api("/career-applications");
      setItems(response.data || []);
    } catch (err) {
      setMessage(err.message || "Failed to load career applications.");
      toast.error(err.message || "Failed to load career applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }
    try {
      await api(`/career-applications/${id}`, { method: "DELETE" });
      setMessage("Application deleted successfully.");
      toast.success("Application deleted successfully.");
      load();
    } catch (err) {
      setMessage(err.message || "Failed to delete application.");
      toast.error(err.message || "Failed to delete application.");
    }
  }

  function formatDate(date) {
    if (!date) return "—";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "—";
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function toggleExpanded(id) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const resumeUrl = (item) =>
    item.resumeUrl || item.cv || item.resume || item.cvUrl || null;

  return (
    <section className="admin-resource">
      <div className="admin-resource-head">
        <button type="button" className="admin-back" onClick={onBack}>
          ← Dashboard
        </button>
        <div>
          <p className="eyebrow">INBOX</p>
          <h2>Career Applications</h2>
        </div>
      </div>

      {message && <p className="admin-message">{message}</p>}

      <div className="admin-table">
        {loading ? (
          <p>Loading career applications...</p>
        ) : items.length === 0 ? (
          <p>No career applications yet.</p>
        ) : (
          items.map((item) => {
            const isExpanded = expanded[item._id];
            const cvUrl = resumeUrl(item);

            return (
              <article
                key={item._id}
                style={{ display: "block", padding: "24px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "20px",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h3 style={{ marginBottom: "5px" }}>
                      {item.name || item.fullName || "Unknown Applicant"}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        color: "var(--admin-accent, #063b78)",
                      }}
                    >
                      🎯{" "}
                      {item.careerTitle ||
                        item.position ||
                        item.jobTitle ||
                        "General Application"}
                    </p>
                  </div>
                  <span className="status-chip">{item.status || "New"}</span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "14px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <strong>Name</strong>
                    <p>{item.name || item.fullName || "—"}</p>
                  </div>
                  <div>
                    <strong>Email</strong>
                    <p>
                      <a
                        href={`mailto:${item.email}`}
                        style={{ color: "var(--admin-accent, #063b78)" }}
                      >
                        {item.email || "—"}
                      </a>
                    </p>
                  </div>
                  <div>
                    <strong>Phone</strong>
                    <p>
                      {item.phone ? (
                        <a
                          href={`tel:${item.phone}`}
                          style={{ color: "var(--admin-accent, #063b78)" }}
                        >
                          {item.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </p>
                  </div>
                  <div>
                    <strong>Applied For</strong>
                    <p>
                      {item.careerTitle ||
                        item.position ||
                        item.jobTitle ||
                        "—"}
                    </p>
                  </div>
                  <div>
                    <strong>Applied On</strong>
                    <p>{formatDate(item.createdAt)}</p>
                  </div>
                </div>

                {item.coverLetter && (
                  <div
                    style={{
                      padding: "15px",
                      background: "#f7fafc",
                      borderRadius: "8px",
                      marginBottom: "15px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: isExpanded ? "10px" : 0,
                      }}
                    >
                      <strong>📝 Cover Letter</strong>
                      <button
                        type="button"
                        onClick={() => toggleExpanded(item._id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--admin-accent, #063b78)",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "13px",
                          padding: "2px 6px",
                        }}
                      >
                        {isExpanded ? "▲ Show less" : "▼ Read more"}
                      </button>
                    </div>
                    {isExpanded && (
                      <p
                        style={{
                          margin: 0,
                          whiteSpace: "pre-wrap",
                          color: "#4a5568",
                        }}
                      >
                        {item.coverLetter}
                      </p>
                    )}
                    {!isExpanded && (
                      <p
                        style={{
                          margin: 0,
                          color: "#718096",
                          fontStyle: "italic",
                          fontSize: "13px",
                        }}
                      >
                        {item.coverLetter.slice(0, 150)}
                        {item.coverLetter.length > 150 ? "..." : ""}
                      </p>
                    )}
                  </div>
                )}

                <div
                  className="admin-row-actions"
                  style={{
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    {cvUrl && (
                      <a
                        href={cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button primary"
                        style={{
                          fontSize: "13px",
                          padding: "8px 16px",
                          textDecoration: "none",
                        }}
                      >
                        📄 View / Download CV
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    className="delete"
                    onClick={() => remove(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

/* =========================================================
   ADMISSIONS
========================================================= */

function AdmissionsInbox({ onBack }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const response = await api("/admissions");
      setItems(response.data || []);
    } catch (err) {
      setMessage(err.message || "Failed to load admission applications.");
      toast.error(
        err.message ||
          "Failed to load admission applications." ||
          "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  async function updateAdmission(event) {
    event.preventDefault();
    if (!editing?._id) return;
    const form = new FormData(event.currentTarget);
    const body = {
      status: form.get("status"),
      adminNote: form.get("adminNote"),
    };
    try {
      await api(`/admissions/${editing._id}`, { method: "PUT", body });
      setMessage("Admission application updated successfully.");
      toast.success("Admission application updated successfully.");
      setEditing(null);
      load();
    } catch (err) {
      setMessage(err.message || "Failed to update admission application.");
      toast.error(
        err.message ||
          "Failed to update admission application." ||
          "An error occurred",
      );
    }
  }

  async function remove(id) {
    if (
      !window.confirm(
        "Are you sure you want to delete this admission application?",
      )
    ) {
      return;
    }
    try {
      await api(`/admissions/${id}`, { method: "DELETE" });
      setMessage("Admission application deleted successfully.");
      toast.success("Admission application deleted successfully.");
      load();
    } catch (err) {
      setMessage(err.message || "Failed to delete admission application.");
      toast.error(
        err.message ||
          "Failed to delete admission application." ||
          "An error occurred",
      );
    }
  }

  function formatDate(date) {
    if (!date) return "—";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "—";
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function openEditor(item) {
    setEditing(item);
  }

  return (
    <section className="admin-resource">
      <div className="admin-resource-head">
        <button type="button" className="admin-back" onClick={onBack}>
          ← Dashboard
        </button>
        <div>
          <p className="eyebrow">INBOX</p>
          <h2>Admission Applications</h2>
        </div>
      </div>

      {message && <p className="admin-message">{message}</p>}

      {editing && (
        <form
          className="admin-form"
          onSubmit={updateAdmission}
          style={{ maxWidth: 600, marginBottom: 30 }}
        >
          <h3 style={{ gridColumn: "1 / -1", margin: 0 }}>
            Update Admission Application
          </h3>
          <p style={{ gridColumn: "1 / -1", margin: 0 }}>
            <strong>Student:</strong> {editing.name || "—"}
          </p>
          <p style={{ gridColumn: "1 / -1", margin: 0 }}>
            <strong>Programme:</strong> {editing.program || "—"}
          </p>
          <label>
            Application Status
            <select name="status" defaultValue={editing.status || "pending"}>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <label>
            Admin Note
            <textarea
              name="adminNote"
              rows="5"
              defaultValue={editing.adminNote || ""}
              placeholder="Add an internal note..."
            />
          </label>
          <div>
            <button type="submit" className="button primary">
              Update Application <span>&rarr;</span>
            </button>
            <button
              type="button"
              className="admin-cancel"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="admin-table">
        {loading ? (
          <p>Loading admission applications...</p>
        ) : items.length === 0 ? (
          <p>No admission applications yet.</p>
        ) : (
          items.map((item) => (
            <article
              key={item._id}
              style={{ display: "block", padding: "24px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h3 style={{ marginBottom: "6px" }}>{item.name}</h3>
                  <p style={{ margin: 0 }}>
                    Applied for: <strong>{item.program || "—"}</strong>
                  </p>
                </div>
                <span className="status-chip">{item.status || "pending"}</span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <strong>Student Name</strong>
                  <p>{item.name || "—"}</p>
                </div>
                <div>
                  <strong>Email</strong>
                  <p>{item.email || "—"}</p>
                </div>
                <div>
                  <strong>Phone</strong>
                  <p>{item.phone || "—"}</p>
                </div>
                <div>
                  <strong>Date of Birth</strong>
                  <p>{formatDate(item.dateOfBirth)}</p>
                </div>
                <div>
                  <strong>Gender</strong>
                  <p>
                    {item.gender
                      ? item.gender.charAt(0).toUpperCase() +
                        item.gender.slice(1)
                      : "—"}
                  </p>
                </div>
                <div>
                  <strong>Programme</strong>
                  <p>{item.program || "—"}</p>
                </div>
                <div>
                  <strong>Previous School</strong>
                  <p>{item.previousSchool || "—"}</p>
                </div>
                <div>
                  <strong>Parent / Guardian</strong>
                  <p>{item.parentName || "—"}</p>
                </div>
                <div>
                  <strong>Parent Phone</strong>
                  <p>{item.parentPhone || "—"}</p>
                </div>
                <div>
                  <strong>Temporary Address</strong>
                  <p>{item.temporaryAddress || "—"}</p>
                </div>
                <div>
                  <strong>Permanent Address</strong>
                  <p>{item.permanentAddress || "—"}</p>
                </div>
                <div>
                  <strong>Submitted</strong>
                  <p>{formatDate(item.createdAt)}</p>
                </div>
              </div>

              {item.message && (
                <div
                  style={{
                    padding: "15px",
                    background: "#f7fafc",
                    borderRadius: "8px",
                    marginBottom: "15px",
                  }}
                >
                  <strong>Applicant Message</strong>
                  <p style={{ marginBottom: 0 }}>{item.message}</p>
                </div>
              )}

              {item.adminNote && (
                <div
                  style={{
                    padding: "15px",
                    background: "#fffaf0",
                    borderRadius: "8px",
                    marginBottom: "15px",
                  }}
                >
                  <strong>Admin Note</strong>
                  <p style={{ marginBottom: 0 }}>{item.adminNote}</p>
                </div>
              )}

              <div className="admin-row-actions">
                <button type="button" onClick={() => openEditor(item)}>
                  Update Status / Note
                </button>
                <button
                  type="button"
                  className="delete"
                  onClick={() => remove(item._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

/* =========================================================
   ADMIN USERS
========================================================= */

function AdminUsers({ onBack }) {
  const [admins, setAdmins] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const response = await api("/users/admins");
      setAdmins(response.data || []);
    } catch (err) {
      setMessage(err.message || "Failed to load admins");
      toast.error(
        err.message || "Failed to load admins" || "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  async function save(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const body = {
      name: form.get("name"),
      email: form.get("email"),
    };
    const password = form.get("password");
    if (password && password.trim()) body.password = password;

    try {
      if (editing?._id) {
        await api(`/users/${editing._id}`, { method: "PUT", body });
        setMessage("Admin updated successfully.");
        toast.success("Admin updated successfully.");
      } else {
        await api("/users/admin", {
          method: "POST",
          body: {
            name: form.get("name"),
            email: form.get("email"),
            password: form.get("password"),
          },
        });
        setMessage("Admin created successfully.");
        toast.success("Admin created successfully.");
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  async function remove(id) {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await api(`/users/${id}`, { method: "DELETE" });
      setMessage("Admin deleted successfully.");
      toast.success("Admin deleted successfully.");
      load();
    } catch (err) {
      setMessage(err.message || "Failed to delete admin");
      toast.error(
        err.message || "Failed to delete admin" || "An error occurred",
      );
    }
  }

  function openEditor(admin = {}) {
    setEditing(admin);
  }

  return (
    <section className="admin-resource">
      <div className="admin-resource-head">
        <div>
          <button type="button" className="admin-back" onClick={onBack}>
            <ArrowLeft size={16} /> Dashboard
          </button>
          <p className="eyebrow">SUPER ADMIN</p>
          <h2>Admin Users</h2>
        </div>
        <button
          type="button"
          className="button primary"
          onClick={() => openEditor({})}
        >
          <Plus size={16} /> Add New Admin
        </button>
      </div>

      {message && <p className="admin-message">{message}</p>}
      {error && <p className="admin-error">{error}</p>}

      {editing !== null && (
        <form className="admin-form" onSubmit={save} style={{ maxWidth: 420 }}>
          <label>
            Full Name
            <input
              name="name"
              type="text"
              required
              defaultValue={editing.name || ""}
            />
          </label>
          <label>
            Email Address
            <input
              name="email"
              type="email"
              required
              defaultValue={editing.email || ""}
            />
          </label>
          <label>
            Password{" "}
            {editing._id && (
              <small>(leave blank to keep current password)</small>
            )}
            <input
              name="password"
              type="password"
              minLength={editing._id ? 0 : 6}
              required={!editing._id}
              placeholder={editing._id ? "••••••••" : ""}
            />
          </label>
          <div>
            <button className="button primary">
              {editing._id ? "Update Admin" : "Create Admin"}{" "}
              <span>&rarr;</span>
            </button>
            <button
              className="admin-cancel"
              type="button"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading admins...</p>
      ) : (
        <div className="admin-table">
          {admins.length === 0 ? (
            <p>No admins found yet.</p>
          ) : (
            admins.map((admin) => (
              <article key={admin._id}>
                <div>
                  <h3>{admin.name}</h3>
                  <p>{admin.email}</p>
                  <p style={{ fontSize: 13, color: "#666" }}>
                    Role: {admin.role}
                  </p>
                </div>
                <div className="admin-row-actions">
                  <button type="button" onClick={() => setEditing(admin)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="delete"
                    onClick={() => remove(admin._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}

/* =========================================================
   SIDEBAR + TOP BAR
========================================================= */

function getAdminNavIcon(key) {
  switch (key) {
    case null:
      return <LayoutDashboard size={18} />;
    case "settings":
      return <Settings size={18} />;
    case "programs":
      return <GraduationCap size={18} />;
    case "news":
      return <Newspaper size={18} />;
    case "events":
      return <Calendar size={18} />;
    case "notices":
      return <Bell size={18} />;
    case "gallery":
      return <ImageIcon size={18} />;
    case "faculty":
      return <Users size={18} />;
    case "facility":
      return <Building2 size={18} />;
    case "achievements":
      return <Trophy size={18} />;
    case "testimonials":
      return <MessageSquareQuote size={18} />;
    case "faqs":
      return <HelpCircle size={18} />;
    case "careers":
      return <Briefcase size={18} />;
    case "downloads":
      return <Download size={18} />;
    case "posters":
      return <FileImage size={18} />;
    case "admissions":
      return <ClipboardList size={18} />;
    case "contacts":
      return <Mail size={18} />;
    case "career-apps":
      return <UserCheck size={18} />;
    case "admin-users":
      return <ShieldCheck size={18} />;
    default:
      return <FolderKanban size={18} />;
  }
}

function AdminSidebar({ user, view, setView, onLogout, open, onClose }) {
  const navItems = [
    { key: null, label: "Dashboard", icon: getAdminNavIcon(null) },
    ...Object.entries(singletons).map(([key, config]) => ({
      key,
      label: config.label,
      icon: getAdminNavIcon(key),
    })),
    ...Object.entries(resources).map(([key, config]) => ({
      key,
      label: config.label,
      icon: getAdminNavIcon(key),
    })),
    { key: "admissions", label: "Admissions", icon: getAdminNavIcon("admissions") },
    { key: "contacts", label: "Contact inbox", icon: getAdminNavIcon("contacts") },
    { key: "career-apps", label: "Career applications", icon: getAdminNavIcon("career-apps") },
  ];

  if (user.role === "superAdmin") {
    navItems.push({
      key: "admin-users",
      label: "Manage Admins",
      icon: getAdminNavIcon("admin-users"),
    });
  }

  return (
    <>
      <div
        className={`admin-sidebar-overlay ${open ? "visible" : ""}`}
        onClick={onClose}
      />
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-logo">B</div>
          <div className="admin-sidebar-brand-text">
            <strong>Babylon National</strong>
            <span>{user.role === "superAdmin" ? "Super Admin" : "Admin"}</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.key ?? "dashboard"}
              type="button"
              className={`admin-nav-item ${
                (item.key === null && !view) || view === item.key
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setView(item.key);
                onClose();
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-avatar">
            {(user.name || "A").charAt(0).toUpperCase()}
          </div>
          <div className="admin-sidebar-user">
            <strong>{user.name || "Admin"}</strong>
            <span>{user.role}</span>
          </div>
        </div>
      </aside>
    </>
  );
}

function AdminTopbar({ user, title, onLogout, onMenuToggle }) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button
          type="button"
          className="admin-menu-toggle"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu size={18} />
        </button>
        <h1 className="admin-topbar-title">{title}</h1>
      </div>
      <div className="admin-topbar-right">
        <span className="admin-badge">
          {user.role === "superAdmin" ? "SuperAdmin" : "Admin"}
        </span>
        <a
          href="/"
          className="admin-topbar-btn"
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink size={15} /> View Site
        </a>
        <button
          type="button"
          className="admin-topbar-btn logout"
          onClick={onLogout}
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </header>
  );
}

/* =========================================================
   DASHBOARD OVERVIEW
========================================================= */

async function fetchCount(endpoint) {
  try {
    const response = await api(endpoint);
    const data = response?.data;
    if (Array.isArray(data)) return data.length;
    if (Array.isArray(response)) return response.length;
    if (data && typeof data === "object" && Array.isArray(data.items)) {
      return data.items.length;
    }
    return 0;
  } catch {
    return 0;
  }
}

function DashboardOverview({ user, setView }) {
  const [stats, setStats] = useState({
    content: null,
    staff: null,
    events: null,
    blog: null,
    documents: null,
    pending: null,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const staffKey = resources.faculty ? "faculty" : null;
  const eventsKey = resources.events ? "events" : null;
  const blogKey = resources.news ? "news" : null;
  const docsKey = resources.downloads ? "downloads" : null;

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      setLoadingStats(true);

      const resourceEndpoints = Object.values(resources)
        .map((r) => r.endpoint)
        .filter(Boolean);

      const [
        resourceCounts,
        admissionsCount,
        contactsCount,
        careersCount,
        staffCount,
        eventsCount,
        blogCount,
        docsCount,
        noticesCount,
      ] = await Promise.all([
        Promise.all(resourceEndpoints.map((ep) => fetchCount(ep))),
        fetchCount("/admissions"),
        fetchCount("/contacts"),
        fetchCount("/career-applications"),
        resources.faculty
          ? fetchCount(resources.faculty.endpoint)
          : Promise.resolve(0),
        resources.events
          ? fetchCount(resources.events.endpoint)
          : Promise.resolve(0),
        resources.news
          ? fetchCount(resources.news.endpoint)
          : Promise.resolve(0),
        resources.downloads
          ? fetchCount(resources.downloads.endpoint)
          : Promise.resolve(0),
        resources.notices
          ? fetchCount(resources.notices.endpoint)
          : Promise.resolve(0),
      ]);

      if (cancelled) return;

      const contentTotal = resourceCounts.reduce((sum, n) => sum + n, 0);

      setStats({
        content: contentTotal,
        staff: staffCount,
        events: eventsCount,
        blog: blogCount,
        documents: docsCount + noticesCount,
        pending: admissionsCount + contactsCount + careersCount,
      });
      setLoadingStats(false);
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const display = (value) => {
    if (loadingStats) return "…";
    if (value === null || value === undefined) return "0";
    return String(value);
  };

  return (
    <div>
      <div className="admin-dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>
          Welcome back — Babylon National School ·{" "}
          {user.role === "superAdmin" ? "SuperAdmin" : "Admin"}
        </p>
      </div>

      <div className="admin-stats-grid">
        <button
          type="button"
          className="admin-stat-card"
          onClick={() => setView(null)}
          style={{
            cursor: "pointer",
            border: "1px solid var(--admin-line)",
            background: "#fff",
            textAlign: "left",
            font: "inherit",
          }}
        >
          <div className="admin-stat-icon blue">
            <Layers size={22} />
          </div>
          <div className="admin-stat-body">
            <strong>{display(stats.content)}</strong>
            <span>Content items</span>
          </div>
        </button>

        <button
          type="button"
          className="admin-stat-card"
          onClick={() => staffKey && setView(staffKey)}
          style={{
            cursor: staffKey ? "pointer" : "default",
            border: "1px solid var(--admin-line)",
            background: "#fff",
            textAlign: "left",
            font: "inherit",
          }}
        >
          <div className="admin-stat-icon gray">
            <Users size={22} />
          </div>
          <div className="admin-stat-body">
            <strong>{display(stats.staff)}</strong>
            <span>Staff</span>
          </div>
        </button>

        <button
          type="button"
          className="admin-stat-card"
          onClick={() => eventsKey && setView(eventsKey)}
          style={{
            cursor: eventsKey ? "pointer" : "default",
            border: "1px solid var(--admin-line)",
            background: "#fff",
            textAlign: "left",
            font: "inherit",
          }}
        >
          <div className="admin-stat-icon amber">
            <Calendar size={22} />
          </div>
          <div className="admin-stat-body">
            <strong>{display(stats.events)}</strong>
            <span>Events</span>
          </div>
        </button>

        <button
          type="button"
          className="admin-stat-card"
          onClick={() => blogKey && setView(blogKey)}
          style={{
            cursor: blogKey ? "pointer" : "default",
            border: "1px solid var(--admin-line)",
            background: "#fff",
            textAlign: "left",
            font: "inherit",
          }}
        >
          <div className="admin-stat-icon pink">
            <Newspaper size={22} />
          </div>
          <div className="admin-stat-body">
            <strong>{display(stats.blog)}</strong>
            <span>Blog Posts</span>
          </div>
        </button>

        <button
          type="button"
          className="admin-stat-card"
          onClick={() => docsKey && setView(docsKey)}
          style={{
            cursor: docsKey ? "pointer" : "default",
            border: "1px solid var(--admin-line)",
            background: "#fff",
            textAlign: "left",
            font: "inherit",
          }}
        >
          <div className="admin-stat-icon green">
            <FileText size={22} />
          </div>
          <div className="admin-stat-body">
            <strong>{display(stats.documents)}</strong>
            <span>Documents</span>
          </div>
        </button>

        <button
          type="button"
          className="admin-stat-card"
          onClick={() => setView("admissions")}
          style={{
            cursor: "pointer",
            border: "1px solid var(--admin-line)",
            background: "#fff",
            textAlign: "left",
            font: "inherit",
          }}
        >
          <div className="admin-stat-icon orange">
            <Clock size={22} />
          </div>
          <div className="admin-stat-body">
            <strong>{display(stats.pending)}</strong>
            <span>Pending Requests</span>
          </div>
        </button>
      </div>

      <div className="admin-grid">
        {Object.entries(singletons).map(([key, config]) => (
          <button key={key} type="button" onClick={() => setView(key)}>
            <strong>{config.label}</strong>
            <span>Manage page →</span>
          </button>
        ))}
        {Object.entries(resources).map(([key, config]) => (
          <button key={key} type="button" onClick={() => setView(key)}>
            <strong>{config.label}</strong>
            <span>Manage content →</span>
          </button>
        ))}
        <button type="button" onClick={() => setView("admissions")}>
          <strong>Admissions</strong>
          <span>Review applications →</span>
        </button>
        <button type="button" onClick={() => setView("contacts")}>
          <strong>Contact inbox</strong>
          <span>Review messages →</span>
        </button>
        <button type="button" onClick={() => setView("career-apps")}>
          <strong>Career applications</strong>
          <span>Review applications →</span>
        </button>
        {user.role === "superAdmin" && (
          <button type="button" onClick={() => setView("admin-users")}>
            <strong>Admin Users</strong>
            <span>Manage admins →</span>
          </button>
        )}
      </div>

      <div className="admin-panels" style={{ marginTop: 28 }}>
        <div className="admin-panel">
          <div className="admin-panel-head">
            <h3>Quick actions</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              type="button"
              className="admin-topbar-btn"
              style={{ justifyContent: "flex-start" }}
              onClick={() => setView("admissions")}
            >
              Review admission applications
            </button>
            <button
              type="button"
              className="admin-topbar-btn"
              style={{ justifyContent: "flex-start" }}
              onClick={() => setView("contacts")}
            >
              Open contact inbox
            </button>
            <button
              type="button"
              className="admin-topbar-btn"
              style={{ justifyContent: "flex-start" }}
              onClick={() => setView("career-apps")}
            >
              Review career applications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN ADMIN PAGE
========================================================= */

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const getViewFromPath = () => {
    const path = location.pathname.replace(/^\/admin\/?/, "");
    return path || null;
  };

  const view = getViewFromPath();

  const setView = (newView) => {
    if (!newView) navigate("/admin");
    else navigate(`/admin/${newView}`);
  };

  useEffect(() => {
    api("/users/profile")
      .then((response) => {
        if (["admin", "superAdmin"].includes(response.data.role)) {
          setUser(response.data);
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  async function logout() {
    await api("/users/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  }

  if (checking) {
    return <LoadingScreen message="Checking admin access..." />;
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const getTitle = () => {
    if (!view) return "Dashboard";
    if (view === "admissions") return "Admission Applications";
    if (view === "contacts") return "Contact messages";
    if (view === "career-apps") return "Career applications";
    if (view === "admin-users") return "Admin Users";
    if (resources[view]) return resources[view].label;
    if (singletons[view]) return singletons[view].label;
    return "Dashboard";
  };

  let content = null;

  if (view === "admin-users" && user.role === "superAdmin") {
    content = <AdminUsers onBack={() => setView(null)} />;
  } else if (resources[view]) {
    content = (
      <ResourceEditor resourceKey={view} onBack={() => setView(null)} />
    );
  } else if (singletons[view]) {
    content =
      view === "settings" ? (
        <SiteSettingsEditor onBack={() => setView(null)} />
      ) : (
        <SingletonEditor singletonKey={view} onBack={() => setView(null)} />
      );
  } else if (view === "admissions") {
    content = <AdmissionsInbox onBack={() => setView(null)} />;
  } else if (view === "contacts") {
    content = <ContactsInbox onBack={() => setView(null)} />;
  } else if (view === "career-apps") {
    content = <CareerAppsInbox onBack={() => setView(null)} />;
  } else {
    content = <DashboardOverview user={user} setView={setView} />;
  }

  return (
    <div className="admin-shell">
      <AdminSidebar
        user={user}
        view={view}
        setView={setView}
        onLogout={logout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="admin-main">
        <AdminTopbar
          user={user}
          title={getTitle()}
          onLogout={logout}
          onMenuToggle={() => setSidebarOpen((o) => !o)}
        />
        <div className="admin-content">{content}</div>
      </div>
    </div>
  );
}