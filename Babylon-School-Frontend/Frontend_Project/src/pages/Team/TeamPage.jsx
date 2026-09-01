import { useState, useMemo } from "react";
import PageBanner from "../../components/common/PageBanner";
import AboutSidebar from "../../components/shared/AboutSidebar";
import TeacherGrid from "../../components/shared/TeacherGrid";
import TeacherModal from "../../components/shared/TeacherModal";
import EmptyState from "../../components/common/EmptyState";
import usePublicData from "../../hooks/usePublicData";
import { publicApi } from "../../services/api";
import "../About/SidebarsCommon.css";

const TEAM_CATEGORIES = [
  "ALL",
  "BOARD OF DIRECTORS",
  "ADMINISTRATION",
  "COORDINATORS",
  "HOD",
  "FACULTIES",
  "ACCOUNT & FINANCE",
  "ECA / CCA",
  "CAFETERIA",
  "TRANSPORT",
];

const ALPHABETS = [
  "ALL",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export default function TeamPage() {
  const { data: teachers, loading } = usePublicData(publicApi.faculty, []);

  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedLetter, setSelectedLetter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Available letters from loaded teachers
  const availableLetters = useMemo(() => {
    const letters = new Set(
      (teachers || [])
        .map((t) => (t.name || "").trim().charAt(0).toUpperCase())
        .filter(Boolean),
    );
    return letters;
  }, [teachers]);

  // Filtered teachers based on Category, Alphabet, and Search Query
  const filteredTeachers = useMemo(() => {
    return (teachers || []).filter((teacher) => {
      // 1. Category Filter
      if (selectedCategory !== "ALL") {
        const teacherCat = String(teacher.category || "")
          .trim()
          .toUpperCase();
        if (teacherCat) {
          if (teacherCat !== selectedCategory) return false;
        } else {
          // If unassigned category, match with "FACULTIES" by default
          if (selectedCategory !== "FACULTIES") return false;
        }
      }

      // 2. Alphabet Filter
      if (selectedLetter !== "ALL") {
        const firstLetter = (teacher.name || "").trim().charAt(0).toUpperCase();
        if (firstLetter !== selectedLetter) return false;
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (teacher.name || "").toLowerCase().includes(q);
        const matchesDesig = (teacher.designation || "")
          .toLowerCase()
          .includes(q);
        const matchesDept = (teacher.department || "")
          .toLowerCase()
          .includes(q);
        if (!matchesName && !matchesDesig && !matchesDept) return false;
      }

      return true;
    });
  }, [teachers, selectedCategory, selectedLetter, searchQuery]);

  return (
    <>
      <PageBanner
        eyebrow="OUR TEAM"
        title="Meet the people behind Babylon."
        image="banner/inner_banner_2.jpg"
        pageKey="team"
      />

      <section className="shell about-page-layout">
        <div className="about-container">
          <AboutSidebar currentPage="team" />
          <div className="about-main-content">
            <section className="listing-page team-page-section">
              <div className="center-heading">
                <p className="eyebrow">OUR TEAM</p>
                <h2>Guiding every learner forward.</h2>
              </div>

              {/* ========== CATEGORY FILTER TABS ========== */}
              <div
                className="team-category-tabs"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "10px",
                  margin: "24px 0 20px",
                }}
              >
                {TEAM_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        background: isActive ? "#1a365d" : "#ffffff",
                        color: isActive ? "#ffffff" : "#2d3748",
                        border: isActive ? "none" : "1px solid #e2e8f0",
                        borderRadius: "10px",
                        padding: "10px 18px",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: isActive
                          ? "0 4px 12px rgba(26, 54, 93, 0.35)"
                          : "0 2px 6px rgba(0,0,0,0.04)",
                        transition: "all 0.2s ease",
                        letterSpacing: "0.02em",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.borderColor = "#1a365d";
                          e.currentTarget.style.color = "#1a365d";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.borderColor = "#e2e8f0";
                          e.currentTarget.style.color = "#2d3748";
                        }
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* ========== ALPHABET FILTER BAR ========== */}
              <div
                className="team-alphabet-bar"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  margin: "0 0 32px",
                  padding: "8px 12px",
                }}
              >
                {ALPHABETS.map((letter) => {
                  const isActive = selectedLetter === letter;
                  const hasMembers =
                    letter === "ALL" || availableLetters.has(letter);

                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => setSelectedLetter(letter)}
                      style={{
                        width: letter === "ALL" ? "auto" : "36px",
                        height: "36px",
                        padding: letter === "ALL" ? "0 14px" : "0",
                        borderRadius: letter === "ALL" ? "999px" : "50%",
                        background: isActive ? "#1a365d" : "#f1f5f9",
                        color: isActive
                          ? "#ffffff"
                          : hasMembers
                            ? "#1a365d"
                            : "#a0aec0",
                        border: "none",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: isActive
                          ? "0 3px 8px rgba(26, 54, 93, 0.35)"
                          : "none",
                        transition: "all 0.15s ease",
                        opacity: hasMembers || isActive ? 1 : 0.6,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "#e0f2fe";
                          e.currentTarget.style.color = "#1a365d";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "#f1f5f9";
                          e.currentTarget.style.color = hasMembers
                            ? "#1a365d"
                            : "#a0aec0";
                        }
                      }}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>

              {/* ========== MEMBER CARDS / EMPTY STATE ========== */}
              {loading ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#64748b",
                    margin: "40px 0",
                  }}
                >
                  Loading team members...
                </p>
              ) : filteredTeachers.length === 0 ? (
                <div style={{ margin: "20px 0" }}>
                  <EmptyState
                    title="No team members found"
                    text={
                      selectedCategory !== "ALL" || selectedLetter !== "ALL"
                        ? "Try selecting another category or letter filter."
                        : "Add team members from the admin panel to introduce them here."
                    }
                  />
                  {(selectedCategory !== "ALL" || selectedLetter !== "ALL") && (
                    <div style={{ textAlign: "center", marginTop: "16px" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory("ALL");
                          setSelectedLetter("ALL");
                          setSearchQuery("");
                        }}
                        style={{
                          background: "#0a192f",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 18px",
                          fontSize: "14px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <TeacherGrid
                  teachers={filteredTeachers}
                  onSelect={(teacher) => setSelectedTeacher(teacher)}
                />
              )}
            </section>

            {/* ========== PROFILE MODAL POPUP ========== */}
            {selectedTeacher && (
              <TeacherModal
                teacher={selectedTeacher}
                onClose={() => setSelectedTeacher(null)}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
