const philosophy = {
  description:
    "We are open to broaden academic outreach of young learners into the zenith of the global standard of 21st century. We basically believe in the uniqueness of the child and try accordingly to explore the uniqueness in a full scale without overbearing their creativity. Our teaching teams assume and nurture them to respect the opinions of others, draw logical conclusions of critical questions by using their own senses, ingenuity, and inquisitiveness in a fearless environment. We duly respect the diversity of cultures in school. We maintain inclusiveness while treating a child so that he/she would feel the importance of social equity and equality in the learning process. We provide individual care to the students so that they would feel the importance of self-respect, self-discovery, and inclusion.",

  approach: [
    "High expectations for all students.",
    "Small and personalized classrooms.",
    "Use of technology to enhance learning.",
    "Recognition and application of learning styles.",
    "Increased instructional time.",
    "Highly qualified staff and faculties.",
    "Parents as partners.",
  ],

  principles: [
    "Learning is a lifelong process.",
    "Every individual is capable of excellence.",
    "Every individual is smart with immense potential.",
    "Learning from mistakes.",
    "Collaborative and cooperative learning.",
  ],
};

export default function AboutStats() {
  return (
    <section className="about-stats">
      <div className="shell">
        <div className="center-heading">
          <p className="eyebrow light">OUR PHILOSOPHY</p>
          <h2>Learning with purpose, growing with confidence.</h2>
          <p>{philosophy.description}</p>
        </div>

        <div className="stats-grid philosophy-grid">
          <div>
            <strong>Our Approach</strong>
            <ul>
              {philosophy.approach.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <strong>Our Guiding Principles</strong>
            <ul>
              {philosophy.principles.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}