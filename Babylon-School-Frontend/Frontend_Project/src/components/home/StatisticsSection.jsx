import { useState } from "react";
import principalImg from "../../assets/principal.png";
import chairmanImg from "../../assets/chairperson.png";

const MESSAGES = [
  {
    id: 1,
    title: "Principal",
    quote: `"If there is no struggle, there is no progress" – Frederick Douglass`,
    content:
      "The truth behind these words resonates profoundly in all aspects of life. Every challenge we encounter shapes us into who we are, instilling resilience and determination.",
    name: "Raju Rai",
    designation: "Founder Principal",
    image: principalImg,
  },
  {
    id: 2,
    title: "Chairman",
    quote: `"Education is the most powerful weapon which you can use to change the world." – Nelson Mandela`,
    content:
      "At Babylon School, we believe that quality education is the foundation of a better future. Our commitment is to nurture young minds with knowledge, character, and compassion so they can become responsible global citizens.",
    name: "Mr. Chairman",
    designation: "Chairman",
    image: chairmanImg,
  },
];

export default function LeadershipMessageSection() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = (index) => {
    if (index === current || fading) return;
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 280);
  };

  const prev = () => goTo(current === 0 ? MESSAGES.length - 1 : current - 1);
  const next = () => goTo(current === MESSAGES.length - 1 ? 0 : current + 1);

  const message = MESSAGES[current];

  return (
    <section className="leadership">
      <div className="shell leadership-grid">
        {/* Photo */}
        <div className="leadership-photo">
          <img src={message.image} alt={message.name} />
        </div>

        {/* Content */}
        <div className={`leadership-body ${fading ? "is-fading" : ""}`}>
          <p className="eyebrow">Leadership</p>

          <h2>
            Message from the <em>{message.title}</em>
          </h2>

          <blockquote>{message.quote}</blockquote>

          <p className="leadership-text">{message.content}</p>

          <div className="leadership-meta">
            <strong>{message.name}</strong>
            <span>{message.designation}</span>
          </div>

          <div className="leadership-controls">
            <button onClick={prev} aria-label="Previous" className="ctrl-btn">
              ←
            </button>

            <div className="ctrl-dots">
              {MESSAGES.map((_, i) => (
                <button
                  key={i}
                  className={i === current ? "active" : ""}
                  onClick={() => goTo(i)}
                  aria-label={`Message ${i + 1}`}
                />
              ))}
            </div>

            <button onClick={next} aria-label="Next" className="ctrl-btn">
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}