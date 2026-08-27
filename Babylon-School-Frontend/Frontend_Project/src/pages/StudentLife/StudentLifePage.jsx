import PageBanner from "../../components/common/PageBanner";
// import StudentLifeSection from "../../components/home/StudentLifeSection";
import { assetPath } from "../../data/content";

const activities = [
  ["Sports & wellbeing", "features/courses_provide_1.jpg"],
  ["Arts, music & dance", "features/courses_provide_2.jpg"],
  ["Scouting & service", "features/courses_provide_3.jpg"],
];

export default function StudentLifePage() {
  return (
    <>
      <PageBanner
        eyebrow="STUDENT LIFE"
        title="A vibrant life beyond class."
        image="banner/inner_banner_4.jpg"
      />
      <StudentLifeSection />
      <section className="activity-section shell">
        <p className="eyebrow">EXPLORE & BELONG</p>
        <h2>More ways to find your spark.</h2>
        <p className="muted-copy">
          Scouting, sport, music, dance and community service sit alongside a
          hygienic cafeteria, library and labs — a congenial, home-away-from-home
          environment.
        </p>
        <div className="activity-grid">
          {activities.map(([title, image]) => (
            <article key={title}>
              <img src={`${assetPath}${image}`} alt="" />
              <h3>{title}</h3>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
