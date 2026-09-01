import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { assetPath } from "../../data/content";

const slides = [
  {
    eyebrow: "WELCOME TO BABYLON NATIONAL SCHOOL",
    heading: (
      <>
        Education for
        <br />
        <em>the Quest</em>
      </>
    ),
    description:
      "A community of passionate educators in Shantinagar, Kathmandu, dedicated since 1996 to a dynamic learning environment from PG to secondary.",
  },
  {
    eyebrow: "EXCELLENCE IN LEARNING",
    heading: (
      <>
        Building
        <br />
        <em>Tomorrow's Leaders</em>
      </>
    ),
    description:
      "Empowering students with world-class education, values, and skills to succeed in a rapidly changing global landscape.",
  },
  {
    eyebrow: "NURTURING YOUNG MINDS",
    heading: (
      <>
        A Place to
        <br />
        <em>Grow & Thrive</em>
      </>
    ),
    description:
      "From pre-school to secondary, we provide a nurturing environment where every child's potential is discovered and developed.",
  },
  {
    eyebrow: "COMMUNITY & CULTURE",
    heading: (
      <>
        Learn, Lead,
        <br />
        <em>Inspire</em>
      </>
    ),
    description:
      "At Babylon National School, we celebrate diversity, foster creativity, and build a strong foundation for lifelong success.",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);
  const videoRef = useRef(null);

  const goTo = useCallback(
    (index) => {
      if (index === current) return;

      setIsTransitioning(true);

      setTimeout(() => {
        setCurrent(index);
        setIsTransitioning(false);
      }, 350);
    },
    [current],
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  // Auto-play text slides
  useEffect(() => {
    timerRef.current = setInterval(next, 5500);
    return () => clearInterval(timerRef.current);
  }, [next]);

  // Ensure video keeps playing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.play().catch(() => {});
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);

    return () => video.removeEventListener("loadeddata", tryPlay);
  }, []);

  const slide = slides[current];

  return (
    <section className="hero" id="home">
      {/* Single video background */}
      <video
        ref={videoRef}
        className="hero-video-bg"
        src="https://res.cloudinary.com/hjjxysan/video/upload/v1788272714/videoPlay_zx3gc8.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="hero-shade" />

      {/* Content */}
      <div
        className={`shell hero-content ${
          isTransitioning ? "fade-out" : "fade-in"
        }`}
      >
        <p className="eyebrow light">{slide.eyebrow}</p>
        <h1>{slide.heading}</h1>
        <p className="hero-description">{slide.description}</p>

        <div className="hero-actions">
          <Link className="button primary" to="/academics">
            Explore Academics <span>&rarr;</span>
          </Link>
          <Link className="button ghost" to="/about">
            Discover Babylon
          </Link>
        </div>
      </div>

      {/* Counter */}
      {/* <div className="hero-mark">
        0{current + 1} <span />
      </div> */}
    </section>
  );
}
