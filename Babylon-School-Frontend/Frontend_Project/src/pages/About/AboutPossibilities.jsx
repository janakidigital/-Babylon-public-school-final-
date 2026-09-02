import { useState } from "react";
import { useSite } from "../../context/SiteContext";

const DEFAULT_VISION =
  "The vision of our school is to provide an inclusive and dynamic learning environment where students can thrive both academically and personally. We aim to foster a love of learning in our students and equip them with the skills and knowledge they need to succeed in the 21st century. Our focus is on developing critical thinking, creativity, collaboration, and communication skills that will enable our students to become lifelong learners and effective problem-solvers. We strive to create a school culture that values diversity, promotes positive relationships, and encourages a growth mindset. Our ultimate goal is to prepare our students to be responsible, compassionate, and engaged citizens who will make a positive impact in their communities and the world.";

const DEFAULT_MISSION =
  "Our mission is to provide a quality education that prepares students to become responsible, productive, and ethical members of society. We strive to create a learning environment that fosters academic excellence, social and emotional growth, and a commitment to lifelong learning. We are dedicated to promoting diversity, inclusivity, and respect for all individuals, and we seek to cultivate a strong sense of community and citizenship among our students.";

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

const ABOUT_US_TEXT =
  "We are a community of passionate educators dedicated since 1996 to providing a dynamic and engaging learning environment for all our students. We are located at Shantinagar, Kathmandu. Our team of experienced teachers works tirelessly to inspire and motivate students to achieve their full potential. We strive to create a welcoming and inclusive school culture that fosters a love of learning, creativity, and collaboration. We are committed to empowering students to become lifelong learners who are equipped with the 21st-century skills and knowledge they need to succeed in a rapidly changing world.";

function getText(value, fallback) {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value.description || value.text || value.content || fallback;
  }
  return fallback;
}

function GoalsList({ goals }) {
  const [expanded, setExpanded] = useState(false);
  const INITIAL_COUNT = 5; // show first 5 items

  const visibleGoals = expanded ? goals : goals.slice(0, INITIAL_COUNT);
  const hasMore = goals.length > INITIAL_COUNT;

  return (
    <>
      <ul className="possibility-list">
        {visibleGoals.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          className="show-more-btn"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : `Show more (${goals.length - INITIAL_COUNT} more)`}
        </button>
      )}
    </>
  );
}

function renderContent(text) {
  if (Array.isArray(text)) {
    return <GoalsList goals={text} />;
  }
  return <p>{text}</p>;
}

export default function AboutPossibilities() {
  // Always show the default values (ignore SiteContext data)
  const visionText = DEFAULT_VISION;
  const missionText = DEFAULT_MISSION;
  const goals = DEFAULT_GOALS;

  const possibilities = [
    { id: "vision", title: "Vision", content: visionText },
    { id: "mission", title: "Mission", content: missionText },
    { id: "goals", title: "Our Goals", content: goals },
  ];

  return (
    <section className="possibilities" aria-labelledby="possibilities-heading">
      <div className="shell">
        {/* About Us – separate boxed section */}
        <div className="about-us-box">
          <header className="center-heading about-us-heading">
            {/* <p className="eyebrow">ABOUT US</p> */}
            <h2 id="about-us-heading">About Us</h2>
            <p>{ABOUT_US_TEXT}</p>
          </header>
        </div>

        {/* Our Difference section */}
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