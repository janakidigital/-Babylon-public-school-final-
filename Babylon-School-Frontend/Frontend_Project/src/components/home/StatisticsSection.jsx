import { useState } from "react";
import { Link } from "react-router-dom"; // change to next/link if needed

// Import images from src/assets
import principalImg from "../../assets/principal.png";
import chairmanImg from "../../assets/chairperson.png";

const MESSAGES = [
  {
    id: 1,
    titleType: "principal",
    quote: `"If there is no struggle, there is no progress" – Frederick Douglass`,
    content:
      "The truth behind these words resonates profoundly in all aspects of life. Every challenge we encounter shapes us into who we are, instilling resilience and determination.",
    name: "Raju Rai",
    designation: "Founder Principal",
    image: principalImg,
    link: "",
  },
  {
    id: 2,
    titleType: "chairman",
    quote: `"Education is the most powerful weapon which you can use to change the world." – Nelson Mandela`,
    content:
      "At Babylon School, we believe that quality education is the foundation of a better future. Our commitment is to nurture young minds with knowledge, character, and compassion so they can become responsible global citizens.",
    name: "Mr. Chairman",
    designation: "Chairman",
    image: chairmanImg,
    link: "",
  },
];

export default function LeadershipMessageSection() {
  const [current, setCurrent] = useState(0);
  const message = MESSAGES[current];

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? MESSAGES.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrent((prev) => (prev === MESSAGES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      className="leadership-message shell"
      style={{
        padding: "5rem 0",
        display: "flex",
        alignItems: "center",
        gap: "4rem",
        flexWrap: "wrap",
      }}
    >
      {/* Left Content */}
      <div style={{ flex: "1 1 480px", minWidth: "300px" }}>
        <h2
          style={{
            fontSize: "2.4rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
            lineHeight: 1.25,
          }}
        >
          <span style={{ color: "#00a8e8" }}>Message</span>{" "}
          <span style={{ color: "#6b7280" }}>from the</span>{" "}
          <span style={{ color: "#e11d48" }}>
            {message.titleType === "principal" ? "Principal" : "Chairman"}
          </span>
        </h2>

        <p
          style={{
            fontSize: "1.15rem",
            fontWeight: 500,
            color: "#1f2937",
            marginBottom: "1.25rem",
            fontStyle: "italic",
          }}
        >
          {message.quote}
        </p>

        {/* Full content - no truncation */}
        <p
          style={{
            color: "#4b5563",
            lineHeight: 1.7,
            marginBottom: "1.5rem",
            fontSize: "1.05rem",
          }}
        >
          {message.content}
        </p>

        <div style={{ marginTop: "1.75rem" }}>
          <h4
            style={{
              margin: 0,
              fontSize: "1.15rem",
              fontWeight: 600,
              color: "#1f2937",
            }}
          >
            {message.name}
          </h4>
          <p
            style={{
              margin: "0.2rem 0 0",
              color: "#6b7280",
              fontStyle: "italic",
              fontSize: "0.95rem",
            }}
          >
            {message.designation}
          </p>
        </div>

        {/* Arrows */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            marginTop: "2.5rem",
            alignItems: "center",
          }}
        >
          <button
            onClick={prev}
            aria-label="Previous message"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.6rem",
              color: "#00a8e8",
              padding: "4px 8px",
              lineHeight: 1,
            }}
          >
            ←
          </button>
          <button
            onClick={next}
            aria-label="Next message"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.6rem",
              color: "#00a8e8",
              padding: "4px 8px",
              lineHeight: 1,
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* Right Circular Image + Red Arc */}
      <div
        style={{
          flex: "0 0 380px",
          position: "relative",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "340px",
            height: "340px",
            borderRadius: "50%",
            backgroundColor: "#e5e7eb",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={message.image}
            alt={message.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
            }}
          />
        </div>

        {/* Red curved border */}
        <div
          style={{
            position: "absolute",
            top: "-12px",
            right: "-12px",
            width: "364px",
            height: "364px",
            borderRadius: "50%",
            border: "6px solid transparent",
            borderRight: "6px solid #e11d48",
            borderBottom: "6px solid #e11d48",
            pointerEvents: "none",
            transform: "rotate(25deg)",
          }}
        />
      </div>
    </section>
  );
}