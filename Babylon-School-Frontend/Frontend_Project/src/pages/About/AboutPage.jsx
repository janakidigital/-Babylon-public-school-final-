import PageBanner from "../../components/common/PageBanner";
import AboutSidebar from "../../components/shared/AboutSidebar";
import AboutStory from "./AboutStory";
import AboutPossibilities from "./AboutPossibilities";
import AboutStats from "./AboutStats";
import AboutFaculty from "./AboutFaculty";
import AboutFaq from "./AboutFaq";
import "./SidebarsCommon.css";

export default function AboutPage() {
  return (
    <>
      <PageBanner
        eyebrow="ABOUT BABYLON"
        title="A co-ed English medium school since 1996."
        image="banner/inner_banner_2.jpg"
        pageKey="about"
      />
      <section className="shell about-page-layout">
        <div className="about-container">
          <AboutSidebar currentPage="about" />
          <div className="about-main-content">
            {/* <AboutStory /> */}
            <AboutPossibilities />
            <section className="statement">
              <div className="shell">
                <p className="eyebrow">OUR PHILOSOPHY</p>
                <h2>How we teach, and why it matters.</h2>
                <p>
                  High expectations for every student. Small, personalised
                  classrooms. Thoughtful use of technology. Recognition of
                  different learning styles. Babylon National School began in
                  1996 with 27 students in Shantinagar, Kathmandu, and remains
                  committed to knowledge, wisdom and education par excellence.
                </p>
              </div>
            </section>
            <AboutStats />
          </div>
        </div>
      </section>
    </>
  );
}
