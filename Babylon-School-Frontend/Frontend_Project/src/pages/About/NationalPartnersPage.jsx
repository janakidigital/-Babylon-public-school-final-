import PageBanner from "../../components/common/PageBanner";
import PartnersSidebar from "../../components/shared/PartnersSidebar";
import "../../pages/About/PartnersPage.css";

export default function NationalPartnersPage() {
  const partners = [
    {
      name: "EduPlay",
      description:
        "Eduplay is an educational concept that aims to integrate learning with play to make the learning process more enjoyable and effective for children. It is a teaching method that uses play-based activities to help children learn and develop important skills such as problem-solving, critical thinking, creativity, and social interaction.",
    },
    {
      name: "Doko Recycle",
      description:
        "Doko Recyclers is a waste management company based in Nepal that focuses on recycling and upcycling waste materials. The company was founded in 2014 and has since then been working towards promoting sustainable waste management practices in Nepal.",
    },
    {
      name: "NCC",
      description:
        "The National Cadet Corps is a youth organization in Nepal that provides military training to school and college students. It aims to develop qualities of leadership, discipline, and patriotism among young people.",
    },
  ];

  return (
    <>
      <PageBanner
        eyebrow="OUR PARTNERS"
        title="National Partners"
        image="banner/inner_banner_2.jpg"
        pageKey="about"
      />

      <section className="shell partners-page-layout">
        <div className="partners-container">
          <PartnersSidebar currentPage="national" />

          <div className="partners-main-content">
            <div className="partners-header">
              <h1>National Partners</h1>
              <p>
                Babylon National School partners with leading national
                organizations to enhance educational experiences and promote
                sustainable development and community engagement.
              </p>
            </div>

            <div className="partners-list">
              {partners.map((partner, index) => (
                <div key={index} className="partner-card">
                  <div className="partner-number">{index + 1}</div>
                  <div className="partner-content">
                    <h3>{partner.name}</h3>
                    <p>{partner.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
