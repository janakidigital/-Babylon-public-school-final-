import { isRichText, sanitizeRichText } from "../../lib/richText";
import "./RichText.css";

export default function RichText({ value, className = "", ...props }) {
  if (!value) return null;
  if (isRichText(value)) {
    return <div {...props} className={`rich-text ${className}`} dangerouslySetInnerHTML={{ __html: sanitizeRichText(value) }} />;
  }
  // Existing descriptions remain plain text, including literal angle brackets.
  return (
    <div {...props} className={`rich-text rich-text-plain ${className}`}>
      {String(value).split(/(https?:\/\/[^\s<>]+)/g).map((part, index) =>
        /^https?:\/\//.test(part)
          ? <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
          : part,
      )}
    </div>
  );
}
