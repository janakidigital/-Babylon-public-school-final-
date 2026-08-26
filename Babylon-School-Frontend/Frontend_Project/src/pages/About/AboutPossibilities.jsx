import { useSite } from "../../context/SiteContext";

const DEFAULT_VISION =
  "To become a leading educational institution that inspires excellence, innovation and lifelong learning.";

const DEFAULT_MISSION =
  "To provide quality education that develops knowledgeable, skilled and responsible individuals.";

const DEFAULT_GOALS = [
  "To cultivate, recognize, and respect the opinions and contributions of children, parents, and teachers.",
  "To provide a safe, nurturing environment for learning where individuality is recognized and diversity is celebrated.",
  "To provide instruction that encourages the development of each child’s practical, cognitive, physical, social, and moral potential.",
  "To present a curriculum that is intellectually stimulating and developmentally appropriate.",
  "To encourage initiative, self-discipline, critical thinking, and creative approaches to problem-solving.",
  "To foster the values of good citizenship through community service, civic awareness, and the development of leadership potential.",
  "Committed to its dictum “Knowledge, Wisdom and Education Par Excellence”, for students who are determined to meet the challenges posed by the brutal advance of scientism, modernism, and post-modernism.",
  "The school aims to accord the type of education that can meet the individual and collective needs of learners and make them self-confident, self-disciplined, and self-reliant by stressing value education, career guidance, social works, leadership training, and extra-curricular activities.",
  "Babylon National School envisions an educational institute “Par Excellence” that is academically solid, socially relevant, and value-oriented.",
];

function getText(value, fallback) {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value.description || value.text || value.content || fallback;
  }
  return fallback;
}

function renderContent(text) {
  if (Array.isArray(text)) {
    return (
      <ul className="possibility-list">
        {text.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p>{text}</p>;
}

export default function AboutPossibilities() {
  const { about } = useSite();

  const visionText = getText(about?.vision, DEFAULT_VISION);
  const missionText = getText(about?.mission, DEFAULT_MISSION);

  const goals =
    Array.isArray(about?.goals) && about.goals.length > 0
      ? about.goals
      : Array.isArray(about?.goal) && about.goal.length > 0
      ? about.goal
      : DEFAULT_GOALS;

  const possibilities = [
    { id: "vision", title: "Vision", content: visionText },
    { id: "mission", title: "Mission", content: missionText },
    { id: "goals", title: "Our Goals", content: goals },
  ];

  return (
    <section className="possibilities" aria-labelledby="possibilities-heading">
      <div className="shell">
        <header className="center-heading">
          <p className="eyebrow">OUR DIFFERENCE</p>
          <h2 id="possibilities-heading">Unlimited possibilities</h2>
          <p>
            A supportive school experience that sees each child as an individual
            with potential.
          </p>
        </header>

        <div className="possibility-grid">
          {possibilities.map((item, index) => (
            <article key={item.id} className="possibility-card">
              <span className="possibility-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{item.title}</h3>
              {renderContent(item.content)}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}