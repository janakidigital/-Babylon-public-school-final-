import React from "react";
import PageBanner from "../../components/common/PageBanner";
import AboutSidebar from "../../components/shared/AboutSidebar";
import AboutPossibilities from "./AboutPossibilities";
import AboutStats from "./AboutStats";
import "./SidebarsCommon.css";
import "./AboutPage.css";

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
            <AboutPossibilities />
            <AboutStats />
          </div>
        </div>
      </section>
    </>
  );
}
