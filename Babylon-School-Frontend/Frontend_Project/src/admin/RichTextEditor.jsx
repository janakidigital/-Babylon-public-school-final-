import { useEffect, useId, useRef, useState } from "react";
import Quill from "quill";
import { isRichText, sanitizeRichText, serializeRichText } from "../lib/richText";
import "quill/dist/quill.snow.css";
import "./RichTextEditor.css";

export default function RichTextEditor({ name, label, defaultValue = "", required = false }) {
  const labelId = useId();
  const hostRef = useRef(null);
  const inputRef = useRef(null);
  const editorRef = useRef(null);
  const initialValue = useRef(defaultValue);
  const [error, setError] = useState("");

  useEffect(() => {
    const host = hostRef.current;
    const container = host.appendChild(document.createElement("div"));
    const quill = new Quill(container, {
      theme: "snow",
      placeholder: `Enter ${label.toLowerCase()}...`,
      formats: ["header", "bold", "italic", "underline", "strike", "list", "indent", "align", "link", "blockquote"],
      modules: {
        toolbar: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "blockquote", "clean"],
        ],
        history: { userOnly: true },
      },
    });
    editorRef.current = quill;
    quill.root.setAttribute("role", "textbox");
    quill.root.setAttribute("aria-labelledby", labelId);
    quill.root.setAttribute("aria-multiline", "true");
    quill.root.setAttribute("aria-required", String(required));
    quill.root.setAttribute("spellcheck", "true");
    if (isRichText(initialValue.current)) {
      quill.setContents(quill.clipboard.convert({ html: sanitizeRichText(initialValue.current) }));
    } else {
      quill.setText(String(initialValue.current || ""));
    }
    quill.history.clear();

    const sync = () => {
      const empty = !quill.getText().replace(/[\s\u200b-\u200d\ufeff]/g, "");
      inputRef.current.value = empty ? "" : serializeRichText(quill.getSemanticHTML());
      inputRef.current.setCustomValidity(required && empty ? `Please enter ${label.toLowerCase()}.` : "");
      quill.root.setAttribute("aria-invalid", String(required && empty));
      if (!empty) setError("");
    };
    quill.on("text-change", sync);
    sync();

    // Quill creates its toolbar dynamically; name every control for keyboard users.
    host.querySelectorAll(".ql-toolbar button").forEach(button => {
      const format = [...button.classList].find(value => value.startsWith("ql-"))?.slice(3) || "Format";
      const labels = { clean: "Clear formatting", list: button.value === "ordered" ? "Numbered list" : "Bullet list", indent: button.value === "+1" ? "Increase indent" : "Decrease indent", strike: "Strikethrough", link: "Insert link" };
      const title = labels[format] || format[0].toUpperCase() + format.slice(1);
      button.type = "button";
      button.title = title;
      button.setAttribute("aria-label", title);
    });
    host.querySelectorAll(".ql-picker-label").forEach(picker => {
      picker.setAttribute("aria-label", picker.closest(".ql-header") ? "Heading style" : "Text alignment");
    });

    return () => {
      quill.off("text-change", sync);
      quill.disable();
      editorRef.current = null;
      host.replaceChildren();
    };
  }, [label, labelId, required]);

  return (
    <div className="admin-rich-field">
      <span id={labelId} className="admin-rich-label">{label}</span>
      <div className="admin-rich-editor" ref={hostRef} />
      <div className="admin-rich-history">
        <button type="button" onClick={() => { editorRef.current?.history.undo(); editorRef.current?.focus(); }}>Undo</button>
        <button type="button" onClick={() => { editorRef.current?.history.redo(); editorRef.current?.focus(); }}>Redo</button>
      </div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <textarea
        ref={inputRef}
        name={name}
        defaultValue={defaultValue}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        className="admin-rich-value"
        onInvalid={event => { event.preventDefault(); setError(event.currentTarget.validationMessage); editorRef.current?.focus(); }}
      />
    </div>
  );
}
