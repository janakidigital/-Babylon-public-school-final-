import PageBanner from "../../components/common/PageBanner";
import PartnersSidebar from "../../components/shared/PartnersSidebar";
import "../../pages/About/PartnersPage.css";

export default function InternationalPartnersPage() {
  const partners = [
    {
      name: "John Moores University, UK",
      description:
        "Our teachers have been granted official visits to some universities in the UK under the partnership programs. In addition, one of the renowned universities called 'John Moores University' sends some students as trainee teachers every year in February as per the institutional understanding. They serve us for one month. We especially utilize them for enhancing the linguistic proficiency of our students and internalizing multiculturalism in contemporary society. Similarly, we have access to volunteers from global outreach. They frequently attend school for a short period of time and share about the cultural, educational, historical, and socioeconomic issues of their countries comparatively. It benefits our students in every sphere by broadening their understanding of multiculturalism.",
    },
    {
      name: "AIESEC",
      description:
        "AIESEC is a global, non-profit organization that aims to develop leadership skills in young people through international internships and volunteer opportunities. Founded in 1948, AIESEC has a presence in over 125 countries and territories, and its members come from diverse cultural, educational, and professional backgrounds.",
    },
    {
      name: "Digi School",
      description:
        "Digi School is an educational concept that involves the use of digital technology and tools to enhance the learning experience. It is a teaching method that uses digital devices such as computers, tablets, and smartphones, as well as software applications and online resources, to deliver educational content and engage students in the learning process.",
    },
    {
      name: "School Enterprise Challenge",
      description:
        "The School Enterprise Challenge is an initiative of Teach A Man To Fish, a UK-based charity that works to promote entrepreneurship education in developing countries. The School Enterprise Challenge is a global business competition that encourages schools to establish and run profitable and sustainable businesses as a way to teach entrepreneurship, life skills, and financial literacy to students.",
    },
    {
      name: "Connecting Classrooms, British Council",
      description:
        "Connecting classrooms is the process of linking students and teachers from different geographical locations through technology to facilitate cross-cultural learning and collaboration. This allows students to share their experiences, learn about different cultures and lifestyles, and develop a global perspective. The British Council Nepal offers several programs and initiatives for connecting classrooms and promoting cross-cultural learning. The program aims to promote cross-cultural understanding and educational excellence in Nepal by connecting classrooms, providing professional development opportunities, and promoting international education.",
    },
    {
      name: "Chinese Language",
      description:
        "For the past two years, Babylon National School has proudly offered Mandarin Chinese as part of our curriculum, thanks to our dedicated Chinese volunteer teacher, Lin Wenjin. Students not only acquire language skills but also delve into the richness of Chinese culture. This program fosters global perspectives and cognitive development, preparing our students for an interconnected world.",
    },
  ];

  return (
    <>
      <PageBanner
        eyebrow="OUR PARTNERS"
        title="International Partners"
        image="banner/inner_banner_2.jpg"
        pageKey="about"
      />

      <section className="shell partners-page-layout">
        <div className="partners-container">
          <PartnersSidebar currentPage="international" />

          <div className="partners-main-content">
            <div className="partners-header">
              <h1>International Partners</h1>
              <p>
                Babylon National School collaborates with international
                organizations and institutions to provide global learning
                opportunities and cultural enrichment for our students.
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
