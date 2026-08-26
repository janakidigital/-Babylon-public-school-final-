import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";
import { slugify } from "../lib/media";
import { resources, singletons } from "./resourceConfig";

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
        <p className="eyebrow">BABYLON ADMIN</p>

        <h1>Content management</h1>

        <p>
          Sign in to manage the information shown across the school website.
        </p>

        <label>
          Email
          <input name="email" type="email" required />
        </label>

        <label>
          Password
          <input name="password" type="password" required />
        </label>

        {error && <p className="admin-error">{error}</p>}

        <button className="button primary" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"} <span>&rarr;</span>
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

  const formValues = useMemo(
    () => (editing ? { ...blank(config), ...editing } : blank(config)),
    [editing, config]
  );

  const load = async () => {
    setLoading(true);

    try {
      const response = await api(config.endpoint);
      setItems(response.data || []);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [resourceKey]);

  async function save(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    // Clean empty image
    const image = form.get("image");

    if (!image?.name) {
      form.delete("image");
    }

    // Clean empty attachment
    const fileField = config.fileField || "attachment";
    const file = form.get(fileField);

    if (!file?.name) {
      form.delete(fileField);
    }

    // Auto slug
    if (form.has("slug") && !String(form.get("slug") || "").trim()) {
      form.set(
        "slug",
        slugify(
          form.get("title") ||
            form.get("name") ||
            `item-${Date.now()}`
        )
      );
    }

    // Checkboxes
    config.fields.forEach(([key, , type]) => {
      if (type === "checkbox") {
        form.set(
          key,
          form.has(key) ? "true" : "false"
        );
      }
    });

    // Send remaining images
    if (config.multiple && editing?.images) {
      form.set(
        "existingImages",
        JSON.stringify(editing.images)
      );
    }

    const body =
      config.image || config.file
        ? form
        : Object.fromEntries(form.entries());

    try {
      await api(
        `${config.endpoint}${
          editing?._id ? `/${editing._id}` : ""
        }`,
        {
          method: editing?._id ? "PUT" : "POST",
          body,
        }
      );

      setEditing(null);
      setMessage(`${config.label} saved successfully.`);

      window.dispatchEvent(
        new CustomEvent("site-data-updated")
      );

      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this item?")) return;

    try {
      await api(`${config.endpoint}/${id}`, {
        method: "DELETE",
      });

      setMessage("Item deleted.");

      window.dispatchEvent(
        new CustomEvent("site-data-updated")
      );

      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  function removeImage(index) {
    if (!editing?.images) return;

    const updatedImages = editing.images.filter(
      (_, i) => i !== index
    );

    setEditing({
      ...editing,
      images: updatedImages,
      coverImage:
        editing.coverImage ===
        editing.images[index]?.url
          ? updatedImages[0]?.url || ""
          : editing.coverImage,
    });
  }

  return (
    <section className="admin-resource">
      <div className="admin-resource-head">
        <button
          type="button"
          className="admin-back"
          onClick={onBack}
        >
          ← Dashboard
        </button>

        <div>
          <p className="eyebrow">CONTENT EDITOR</p>
          <h2>{config.label}</h2>
        </div>

        <button
          type="button"
          className="button primary"
          onClick={() => setEditing({})}
        >
          Add {config.label.slice(0, -1)}
        </button>
      </div>

      {message && (
        <p className="admin-message">
          {message}
        </p>
      )}

      {editing !== null && (
        <form
          className="admin-form"
          onSubmit={save}
        >
          {config.fields.map(
            ([key, label, type = "text"]) => {
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
                              formValues[key]
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
            }
          )}

          {/* IMAGE */}

          {config.image && (
            <label
              style={{
                gridColumn: "1 / -1",
              }}
            >
              {config.multiple
                ? "Upload Images (select many)"
                : "Image upload"}

              <input
                name="image"
                type="file"
                accept="image/*"
                multiple={!!config.multiple}
              />

              {editing?.image &&
                !config.multiple && (
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

              {config.multiple && (
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

              {config.multiple &&
                editing?.images?.length > 0 && (
                  <div
                    style={{
                      marginTop: "16px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        marginBottom: "10px",
                        color: "#1a365d",
                      }}
                    >
                      Current Images (
                      {editing.images.length}) — click ×
                      to remove
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(100px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      {editing.images.map(
                        (img, index) => (
                          <div
                            key={index}
                            style={{
                              position: "relative",
                              border:
                                "1px solid #e2e8f0",
                              borderRadius: "6px",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={img.url}
                              alt={
                                img.caption ||
                                `Image ${
                                  index + 1
                                }`
                              }
                              style={{
                                width: "100%",
                                height: "90px",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeImage(index)
                              }
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
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                lineHeight: 1,
                              }}
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </label>
          )}

          {/* FILE */}

          {config.file && (
            <label>
              {config.fileLabel ||
                "Attachment (PDF)"}

              <input
                name={
                  config.fileField ||
                  "attachment"
                }
                type="file"
                accept={
                  config.fileAccept ||
                  ".pdf,application/pdf"
                }
              />

              {editing?.[
                config.fileField ||
                  "attachment"
              ] && (
                <small
                  style={{
                    display: "block",
                    marginTop: 6,
                    color: "#666",
                  }}
                >
                  Current file:{" "}
                  {
                    editing[
                      config.fileField ||
                        "attachment"
                    ]
                  }
                </small>
              )}
            </label>
          )}

          <div>
            <button className="button primary">
              Save changes{" "}
              <span>&rarr;</span>
            </button>

            <button
              className="admin-cancel"
              type="button"
              onClick={() =>
                setEditing(null)
              }
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>
          Loading{" "}
          {config.label.toLowerCase()}...
        </p>
      ) : (
        <div className="admin-table">
          {items.length === 0 ? (
            <p>
              No{" "}
              {config.label.toLowerCase()} yet.
            </p>
          ) : (
            items.map((item) => (
              <article key={item._id}>
                <div>
                  {(item.coverImage ||
                    item.image) && (
                    <img
                      src={
                        item.coverImage ||
                        item.image
                      }
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
                      {item.title ||
                        item.name ||
                        item.question}
                    </h3>

                    <p>
                      {item.shortDescription ||
                        item.description ||
                        item.designation ||
                        item.category ||
                        item.answer ||
                        (item.images
                          ? `${item.images.length} photos`
                          : "No description")}
                    </p>

                    {item.attachment && (
                      <p
                        style={{
                          marginTop: 6,
                        }}
                      >
                        <a
                          href={
                            item.attachment
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#1a365d",
                            fontWeight: 500,
                          }}
                        >
                          📄 View Attachment
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                <div className="admin-row-actions">
                  <button
                    type="button"
                    onClick={() =>
                      setEditing(item)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete"
                    onClick={() =>
                      remove(item._id)
                    }
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
   SINGLETON EDITOR
========================================================= */

function SingletonEditor({
  singletonKey,
  onBack,
}) {
  const config = singletons[singletonKey];

  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    try {
      const response = await api(
        config.endpoint
      );

      setData(response.data || {});
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [singletonKey]);

  async function save(event) {
    event.preventDefault();

    const form = new FormData(
      event.currentTarget
    );

    const formDataObj =
      Object.fromEntries(form.entries());

    const body = {};

    Object.entries(config.schema).forEach(
      ([section, fields]) => {
        if (section !== "root") {
          body[section] = {};
        }

        fields.forEach(([key]) => {
          if (section === "root") {
            body[key] =
              formDataObj[
                `${section}.${key}`
              ];
          } else {
            body[section][key] =
              formDataObj[
                `${section}.${key}`
              ];
          }
        });
      }
    );

    try {
      await api(config.endpoint, {
        method: "PUT",
        body,
      });

      setMessage(
        `${config.label} saved successfully.`
      );

      window.dispatchEvent(
        new CustomEvent("site-data-updated")
      );
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <section className="admin-resource">
      <div className="admin-resource-head">
        <button
          type="button"
          className="admin-back"
          onClick={onBack}
        >
          ← Dashboard
        </button>

        <div>
          <p className="eyebrow">
            CONTENT EDITOR
          </p>

          <h2>{config.label}</h2>
        </div>
      </div>

      {message && (
        <p className="admin-message">
          {message}
        </p>
      )}

      {loading ? (
        <p>
          Loading{" "}
          {config.label.toLowerCase()}...
        </p>
      ) : (
        <form
          className="admin-form"
          onSubmit={save}
        >
          {Object.entries(
            config.schema
          ).map(([section, fields]) => (
            <fieldset
              key={section}
              className="admin-fieldset"
            >
              <legend>
                {section === "root"
                  ? "General"
                  : section}
              </legend>

              {fields.map(
                ([key, label, type = "text"]) => (
                  <label key={key}>
                    {label}

                    {type === "textarea" ? (
                      <textarea
                        name={`${section}.${key}`}
                        defaultValue={
                          section === "root"
                            ? data?.[key] || ""
                            : data?.[
                                section
                              ]?.[key] || ""
                        }
                      />
                    ) : (
                      <input
                        name={`${section}.${key}`}
                        type={type}
                        defaultValue={
                          section === "root"
                            ? data?.[key] || ""
                            : data?.[
                                section
                              ]?.[key] || ""
                        }
                      />
                    )}
                  </label>
                )
              )}
            </fieldset>
          ))}

          <div>
            <button className="button primary">
              Save changes{" "}
              <span>&rarr;</span>
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

function Inbox({
  endpoint,
  title,
  fields,
  onBack,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = () => {
    setLoading(true);

    api(endpoint)
      .then((response) =>
        setItems(response.data || [])
      )
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [endpoint]);

  async function remove(id) {
    if (
      !window.confirm(
        "Are you sure you want to delete this application?"
      )
    ) {
      return;
    }

    try {
      await api(`${endpoint}/${id}`, {
        method: "DELETE",
      });

      setMessage(
        "Application deleted successfully."
      );

      load();
    } catch (err) {
      setMessage(
        err.message ||
          "Failed to delete application."
      );
    }
  }

  return (
    <section className="admin-resource">
      <div className="admin-resource-head">
        <button
          type="button"
          className="admin-back"
          onClick={onBack}
        >
          ← Dashboard
        </button>

        <div>
          <p className="eyebrow">INBOX</p>
          <h2>{title}</h2>
        </div>
      </div>

      {message && (
        <p className="admin-message">
          {message}
        </p>
      )}

      <div className="admin-table">
        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          items.map((item) => (
            <article key={item._id}>
              <div>
                <h3>
                  {item.name ||
                    item.fullName ||
                    item.email}
                </h3>

                {fields.map((field) => (
                  <p key={field}>
                    <b>{field}:</b>{" "}
                    {item[field] || "—"}
                  </p>
                ))}

                {(item.resumeUrl ||
                  item.cv ||
                  item.resume) && (
                  <p
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    <a
                      href={
                        item.resumeUrl ||
                        item.cv ||
                        item.resume
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#1a365d",
                        fontWeight: 600,
                        textDecoration:
                          "underline",
                      }}
                    >
                      📄 Download / View CV
                    </a>
                  </p>
                )}
              </div>

              <div className="admin-row-actions">
                <span className="status-chip">
                  {item.status || "New"}
                </span>

                <button
                  type="button"
                  className="delete"
                  onClick={() =>
                    remove(item._id)
                  }
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
   ADMISSIONS
   Everything is handled inside AdminPage.jsx
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
      setMessage(
        err.message ||
          "Failed to load admission applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ---------------------------------------------
     Update admission status + admin note
  --------------------------------------------- */

  async function updateAdmission(event) {
    event.preventDefault();

    if (!editing?._id) return;

    const form = new FormData(
      event.currentTarget
    );

    const body = {
      status: form.get("status"),
      adminNote: form.get("adminNote"),
    };

    try {
      await api(
        `/admissions/${editing._id}`,
        {
          method: "PUT",
          body,
        }
      );

      setMessage(
        "Admission application updated successfully."
      );

      setEditing(null);

      load();
    } catch (err) {
      setMessage(
        err.message ||
          "Failed to update admission application."
      );
    }
  }

  /* ---------------------------------------------
     Delete admission
  --------------------------------------------- */

  async function remove(id) {
    if (
      !window.confirm(
        "Are you sure you want to delete this admission application?"
      )
    ) {
      return;
    }

    try {
      await api(`/admissions/${id}`, {
        method: "DELETE",
      });

      setMessage(
        "Admission application deleted successfully."
      );

      load();
    } catch (err) {
      setMessage(
        err.message ||
          "Failed to delete admission application."
      );
    }
  }

  /* ---------------------------------------------
     Date formatter
  --------------------------------------------- */

  function formatDate(date) {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  }

  return (
    <section className="admin-resource">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="admin-resource-head">
        <button
          type="button"
          className="admin-back"
          onClick={onBack}
        >
          ← Dashboard
        </button>

        <div>
          <p className="eyebrow">INBOX</p>

          <h2>
            Admission Applications
          </h2>
        </div>
      </div>

      {message && (
        <p className="admin-message">
          {message}
        </p>
      )}

      {/* ==========================================
          EDIT APPLICATION
      ========================================== */}

      {editing && (
        <form
          className="admin-form"
          onSubmit={updateAdmission}
          style={{
            maxWidth: 600,
            marginBottom: 30,
          }}
        >
          <h3>
            Update Admission Application
          </h3>

          <p>
            <strong>Student:</strong>{" "}
            {editing.name || "—"}
          </p>

          <p>
            <strong>Programme:</strong>{" "}
            {editing.program || "—"}
          </p>

          <label>
            Application Status

            <select
              name="status"
              defaultValue={
                editing.status || "pending"
              }
            >
              <option value="pending">
                Pending
              </option>

              <option value="reviewing">
                Reviewing
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>
          </label>

          <label>
            Admin Note

            <textarea
              name="adminNote"
              rows="5"
              defaultValue={
                editing.adminNote || ""
              }
              placeholder="Add an internal note..."
            />
          </label>

          <div>
            <button
              type="submit"
              className="button primary"
            >
              Update Application{" "}
              <span>&rarr;</span>
            </button>

            <button
              type="button"
              className="admin-cancel"
              onClick={() =>
                setEditing(null)
              }
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ==========================================
          APPLICATION LIST
      ========================================== */}

      <div className="admin-table">
        {loading ? (
          <p>
            Loading admission applications...
          </p>
        ) : items.length === 0 ? (
          <p>
            No admission applications yet.
          </p>
        ) : (
          items.map((item) => (
            <article
              key={item._id}
              style={{
                display: "block",
                padding: "24px",
              }}
            >

              {/* ----------------------------------
                  APPLICATION HEADER
              ---------------------------------- */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "flex-start",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h3
                    style={{
                      marginBottom: "6px",
                    }}
                  >
                    {item.name}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                    }}
                  >
                    Applied for:{" "}
                    <strong>
                      {item.program || "—"}
                    </strong>
                  </p>
                </div>

                <span className="status-chip">
                  {item.status || "pending"}
                </span>
              </div>

              {/* ----------------------------------
                  STUDENT / APPLICATION DETAILS
              ---------------------------------- */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <strong>
                    Student Name
                  </strong>

                  <p>
                    {item.name || "—"}
                  </p>
                </div>

                <div>
                  <strong>Email</strong>

                  <p>
                    {item.email || "—"}
                  </p>
                </div>

                <div>
                  <strong>Phone</strong>

                  <p>
                    {item.phone || "—"}
                  </p>
                </div>

                <div>
                  <strong>
                    Date of Birth
                  </strong>

                  <p>
                    {formatDate(
                      item.dateOfBirth
                    )}
                  </p>
                </div>

                <div>
                  <strong>Gender</strong>

                  <p>
                    {item.gender
                      ? item.gender
                          .charAt(0)
                          .toUpperCase() +
                        item.gender.slice(1)
                      : "—"}
                  </p>
                </div>

                <div>
                  <strong>
                    Programme
                  </strong>

                  <p>
                    {item.program || "—"}
                  </p>
                </div>

                <div>
                  <strong>
                    Previous School
                  </strong>

                  <p>
                    {item.previousSchool ||
                      "—"}
                  </p>
                </div>

                <div>
                  <strong>
                    Parent / Guardian
                  </strong>

                  <p>
                    {item.parentName ||
                      "—"}
                  </p>
                </div>

                <div>
                  <strong>
                    Parent Phone
                  </strong>

                  <p>
                    {item.parentPhone ||
                      "—"}
                  </p>
                </div>

                <div>
                  <strong>
                    Temporary Address
                  </strong>

                  <p>
                    {item.temporaryAddress ||
                      "—"}
                  </p>
                </div>

                <div>
                  <strong>
                    Permanent Address
                  </strong>

                  <p>
                    {item.permanentAddress ||
                      "—"}
                  </p>
                </div>

                <div>
                  <strong>
                    Submitted
                  </strong>

                  <p>
                    {formatDate(
                      item.createdAt
                    )}
                  </p>
                </div>
              </div>

              {/* ----------------------------------
                  APPLICANT MESSAGE
              ---------------------------------- */}

              {item.message && (
                <div
                  style={{
                    padding: "15px",
                    background: "#f7fafc",
                    borderRadius: "8px",
                    marginBottom: "15px",
                  }}
                >
                  <strong>
                    Applicant Message
                  </strong>

                  <p
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    {item.message}
                  </p>
                </div>
              )}

              {/* ----------------------------------
                  ADMIN NOTE
              ---------------------------------- */}

              {item.adminNote && (
                <div
                  style={{
                    padding: "15px",
                    background: "#fffaf0",
                    borderRadius: "8px",
                    marginBottom: "15px",
                  }}
                >
                  <strong>
                    Admin Note
                  </strong>

                  <p
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    {item.adminNote}
                  </p>
                </div>
              )}

              {/* ----------------------------------
                  ACTIONS
              ---------------------------------- */}

              <div className="admin-row-actions">
                <button
                  type="button"
                  onClick={() =>
                    setEditing(item)
                  }
                >
                  Update Status / Note
                </button>

                <button
                  type="button"
                  className="delete"
                  onClick={() =>
                    remove(item._id)
                  }
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
      const response = await api(
        "/users/admins"
      );

      setAdmins(response.data || []);
    } catch (err) {
      setMessage(
        err.message ||
          "Failed to load admins"
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

    const form = new FormData(
      event.currentTarget
    );

    const body = {
      name: form.get("name"),
      email: form.get("email"),
    };

    const password = form.get("password");

    if (password && password.trim()) {
      body.password = password;
    }

    try {
      if (editing?._id) {
        await api(
          `/users/${editing._id}`,
          {
            method: "PUT",
            body,
          }
        );

        setMessage(
          "Admin updated successfully."
        );
      } else {
        await api("/users/admin", {
          method: "POST",
          body: {
            name: form.get("name"),
            email: form.get("email"),
            password:
              form.get("password"),
          },
        });

        setMessage(
          "Admin created successfully."
        );
      }

      setEditing(null);
      load();
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong"
      );
    }
  }

  async function remove(id) {
    if (
      !window.confirm(
        "Are you sure you want to delete this admin?"
      )
    ) {
      return;
    }

    try {
      await api(`/users/${id}`, {
        method: "DELETE",
      });

      setMessage(
        "Admin deleted successfully."
      );

      load();
    } catch (err) {
      setMessage(
        err.message ||
          "Failed to delete admin"
      );
    }
  }

  return (
    <section className="admin-resource">
      <div className="admin-resource-head">
        <button
          type="button"
          className="admin-back"
          onClick={onBack}
        >
          ← Dashboard
        </button>

        <div>
          <p className="eyebrow">
            SUPER ADMIN
          </p>

          <h2>Admin Users</h2>
        </div>

        <button
          type="button"
          className="button primary"
          onClick={() =>
            setEditing({})
          }
        >
          Add New Admin
        </button>
      </div>

      {message && (
        <p className="admin-message">
          {message}
        </p>
      )}

      {error && (
        <p className="admin-error">
          {error}
        </p>
      )}

      {editing !== null && (
        <form
          className="admin-form"
          onSubmit={save}
          style={{ maxWidth: 420 }}
        >
          <label>
            Full Name

            <input
              name="name"
              type="text"
              required
              defaultValue={
                editing.name || ""
              }
            />
          </label>

          <label>
            Email Address

            <input
              name="email"
              type="email"
              required
              defaultValue={
                editing.email || ""
              }
            />
          </label>

          <label>
            Password{" "}
            {editing._id && (
              <small>
                (leave blank to keep current
                password)
              </small>
            )}

            <input
              name="password"
              type="password"
              minLength={
                editing._id ? 0 : 6
              }
              required={!editing._id}
              placeholder={
                editing._id
                  ? "••••••••"
                  : ""
              }
            />
          </label>

          <div>
            <button className="button primary">
              {editing._id
                ? "Update Admin"
                : "Create Admin"}{" "}
              <span>&rarr;</span>
            </button>

            <button
              className="admin-cancel"
              type="button"
              onClick={() =>
                setEditing(null)
              }
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
              <article
                key={admin._id}
              >
                <div>
                  <h3>
                    {admin.name}
                  </h3>

                  <p>
                    {admin.email}
                  </p>

                  <p
                    style={{
                      fontSize: 13,
                      color: "#666",
                    }}
                  >
                    Role: {admin.role}
                  </p>
                </div>

                <div className="admin-row-actions">
                  <button
                    type="button"
                    onClick={() =>
                      setEditing(admin)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete"
                    onClick={() =>
                      remove(admin._id)
                    }
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
   ADMIN TOP BAR
========================================================= */

function AdminTop({ user, onLogout }) {
  async function logout() {
    await api(
      "/users/logout",
      {
        method: "POST",
      }
    ).catch(() => {});

    onLogout();
  }

  return (
    <header className="admin-top">
      <a href="/">
        BABYLON <span>ADMIN</span>
      </a>

      <div>
        {user.name}{" "}

        <button
          type="button"
          onClick={logout}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}

/* =========================================================
   MAIN ADMIN PAGE
========================================================= */

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] =
    useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  /* ---------------------------------------------
     URL → VIEW
  --------------------------------------------- */

  const getViewFromPath = () => {
    const path =
      location.pathname.replace(
        /^\/admin\/?/,
        ""
      );

    return path || null;
  };

  const view = getViewFromPath();

  /* ---------------------------------------------
     CHANGE VIEW
  --------------------------------------------- */

  const setView = (newView) => {
    if (!newView) {
      navigate("/admin");
    } else {
      navigate(`/admin/${newView}`);
    }
  };

  /* ---------------------------------------------
     CHECK ADMIN LOGIN
  --------------------------------------------- */

  useEffect(() => {
    api("/users/profile")
      .then((response) => {
        if (
          ["admin", "superAdmin"].includes(
            response.data.role
          )
        ) {
          setUser(response.data);
        }
      })
      .catch(() => {})
      .finally(() =>
        setChecking(false)
      );
  }, []);

  if (checking) {
    return (
      <main className="admin-login">
        <p>
          Checking admin access...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <Login
        onLogin={setUser}
      />
    );
  }

  /* =====================================================
     SUPER ADMIN → ADMIN USERS
  ===================================================== */

  if (
    view === "admin-users" &&
    user.role === "superAdmin"
  ) {
    return (
      <main className="admin-shell">
        <AdminTop
          user={user}
          onLogout={() =>
            setUser(null)
          }
        />

        <AdminUsers
          onBack={() =>
            setView(null)
          }
        />
      </main>
    );
  }

  /* =====================================================
     RESOURCE EDITORS
  ===================================================== */

  if (resources[view]) {
    return (
      <main className="admin-shell">
        <AdminTop
          user={user}
          onLogout={() =>
            setUser(null)
          }
        />

        <ResourceEditor
          resourceKey={view}
          onBack={() =>
            setView(null)
          }
        />
      </main>
    );
  }

  /* =====================================================
     SINGLETON EDITORS
  ===================================================== */

  if (singletons[view]) {
    return (
      <main className="admin-shell">
        <AdminTop
          user={user}
          onLogout={() =>
            setUser(null)
          }
        />

        <SingletonEditor
          singletonKey={view}
          onBack={() =>
            setView(null)
          }
        />
      </main>
    );
  }

  /* =====================================================
     ADMISSIONS
  ===================================================== */

  if (view === "admissions") {
    return (
      <main className="admin-shell">
        <AdminTop
          user={user}
          onLogout={() =>
            setUser(null)
          }
        />

        <AdmissionsInbox
          onBack={() =>
            setView(null)
          }
        />
      </main>
    );
  }

  /* =====================================================
     CONTACTS
  ===================================================== */

  if (view === "contacts") {
    return (
      <main className="admin-shell">
        <AdminTop
          user={user}
          onLogout={() =>
            setUser(null)
          }
        />

        <Inbox
          endpoint="/contacts"
          title="Contact messages"
          fields={[
            "email",
            "phone",
            "subject",
            "message",
          ]}
          onBack={() =>
            setView(null)
          }
        />
      </main>
    );
  }

  /* =====================================================
     CAREER APPLICATIONS
  ===================================================== */

  if (view === "career-apps") {
    return (
      <main className="admin-shell">
        <AdminTop
          user={user}
          onLogout={() =>
            setUser(null)
          }
        />

        <Inbox
          endpoint="/career-applications"
          title="Career applications"
          fields={[
            "email",
            "phone",
            "careerTitle",
            "coverLetter",
          ]}
          onBack={() =>
            setView(null)
          }
        />
      </main>
    );
  }

  /* =====================================================
     DEFAULT DASHBOARD
  ===================================================== */

  return (
    <main className="admin-shell">
      <AdminTop
        user={user}
        onLogout={() =>
          setUser(null)
        }
      />

      <section className="admin-dashboard">
        <p className="eyebrow">
          DASHBOARD
        </p>

        <h1>
          Welcome back, {user.name}.
        </h1>

        <p>
          Manage the live content shown on
          the Babylon website. About and
          student-life copy stay on the
          public pages.
        </p>

        <div className="admin-grid">

          {/* SINGLETONS */}

          {Object.entries(
            singletons
          ).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() =>
                setView(key)
              }
            >
              <strong>
                {config.label}
              </strong>

              <span>
                Manage page &rarr;
              </span>
            </button>
          ))}

          {/* RESOURCES */}

          {Object.entries(
            resources
          ).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() =>
                setView(key)
              }
            >
              <strong>
                {config.label}
              </strong>

              <span>
                Manage content &rarr;
              </span>
            </button>
          ))}

          {/* ADMISSIONS */}

          <button
            type="button"
            onClick={() =>
              setView("admissions")
            }
          >
            <strong>
              Admissions
            </strong>

            <span>
              Review applications &rarr;
            </span>
          </button>

          {/* CONTACTS */}

          <button
            type="button"
            onClick={() =>
              setView("contacts")
            }
          >
            <strong>
              Contact inbox
            </strong>

            <span>
              Review messages &rarr;
            </span>
          </button>

          {/* CAREERS */}

          <button
            type="button"
            onClick={() =>
              setView("career-apps")
            }
          >
            <strong>
              Career applications
            </strong>

            <span>
              Review applications &rarr;
            </span>
          </button>

          {/* ADMIN USERS */}

          {user.role ===
            "superAdmin" && (
            <button
              type="button"
              onClick={() =>
                setView(
                  "admin-users"
                )
              }
            >
              <strong>
                Admin Users
              </strong>

              <span>
                Manage admins &rarr;
              </span>
            </button>
          )}
        </div>
      </section>
    </main>
  );
}