import PageBanner from "../../components/common/PageBanner";
import ProgramsSection from "../../components/home/ProgramsSection";

export default function AcademicsPage() {
  return (
    <>
      <PageBanner
        eyebrow="OUR ACADEMICS"
        title="Learning with purpose."
        image="banner/inner_banner_3.jpg"
        pageKey="academics"
      />
      <ProgramsSection />
      <section className="academic-note">
        <div className="shell">
          <div>
            <p className="eyebrow">OUR APPROACH</p>
            <h2>Knowledge, character and creativity in balance.</h2>
          </div>
          <p>
            Babylon is a co-ed English medium school from PG to secondary. Our
            curriculum is intellectually stimulating and developmentally
            appropriate, with activity-based learning in the early years and
            strong foundations through to graduation.
          </p>
        </div>
      </section>
    </>
  );
}
