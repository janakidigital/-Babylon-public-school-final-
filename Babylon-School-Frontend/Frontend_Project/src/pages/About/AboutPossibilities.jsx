import { useSite } from "../../context/SiteContext";

export default function AboutPossibilities() {
  const { about } = useSite();

  const mission = about?.mission || {};
  const vision = about?.vision || {};

  const goals = [
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

  const possibilities = [
    {
      title: "Vision",
      text:
        vision.description ||
        "The vision of our school is to provide an inclusive and dynamic learning environment where students can thrive both academically and personally. We aim to foster a love of learning in our students and equip them with the skills and knowledge they need to succeed in the 21st century. Our focus is on developing critical thinking, creativity, collaboration, and communication skills that will enable our students to become lifelong learners and effective problem-solvers. We strive to create a school culture that values diversity, promotes positive relationships, and encourages a growth mindset. Our ultimate goal is to prepare our students to be responsible, compassionate, and engaged citizens who will make a positive impact in their communities and the world.",
    },
    {
      title: "Mission",
      text:
        mission.description ||
        "Our mission is to provide a quality education that prepares students to become responsible, productive, and ethical members of society. We strive to create a learning environment that fosters academic excellence, social and emotional growth, and a commitment to lifelong learning. We are dedicated to promoting diversity, inclusivity, and respect for all individuals, and we seek to cultivate a strong sense of community and citizenship among our students.",
    },
    {
      title: "Our Goals",
      text: goals,
    },
  ];

  return (
    <section className="possibilities">
      <div className="shell">
        <div className="center-heading">
          <p className="eyebrow">OUR DIFFERENCE</p>
          <h2>Unlimited possibilities</h2>
          <p>
            A supportive school experience that sees each child as an individual
            with potential.
          </p>
        </div>

        <div className="possibility-grid">
          {possibilities.map((item, index) => (
            <article key={item.title}>
              <span>0{index + 1}</span>

              <h3>{item.title}</h3>

              {Array.isArray(item.text) ? (
                <ul>
                  {item.text.map((goal, goalIndex) => (
                    <li key={goalIndex}>{goal}</li>
                  ))}
                </ul>
              ) : (
                <p>{item.text}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}