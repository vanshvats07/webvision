import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const photos = [
  {
    src: '/images/campus-courtyard.jpeg',
    alt: 'MAIT courtyard fountain surrounded by the institute buildings',
    title: 'A Place to Learn and Belong',
    description: 'The campus courtyard at Maharaja Agrasen Institute of Technology.',
  },
  {
    src: '/images/innovation-awards.jpeg',
    alt: 'Student teams receive awards at an innovation event',
    title: 'Ideas That Make an Impact',
    description: 'MAIT students recognized for their work in innovation and entrepreneurship.',
  },
  {
    src: '/images/academic-medalists.jpeg',
    alt: 'MAIT congratulates B.Tech gold medalists from the 2021–2025 batch',
    title: 'Celebrating Academic Excellence',
    description: 'Honouring the B.Tech batch of 2021–2025 for outstanding academic achievement.',
  },
  {
    src: '/images/leadership-recognition.jpeg',
    alt: 'MAIT students and institute leadership at a recognition event',
    title: 'A Community That Celebrates Achievement',
    description: 'Students, faculty, and leadership come together to recognize success.',
  },
  {
    src: '/images/coding-competition.jpeg',
    alt: 'MAIT Team Phoenix celebrates its Spellbound Coders Cup win',
    title: 'Building the Next Generation of Innovators',
    description: 'Team Phoenix wins the Spellbound Coders Cup 2025.',
  },
];

export const HomepagePhotoCarousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activePhoto, setActivePhoto] = useState(0);

  const showPhoto = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollTo({
      left: index * carousel.clientWidth,
      behavior: 'smooth',
    });
    setActivePhoto(index);
  };

  return (
    <section
      id="campus-highlights"
      aria-label="Campus highlights"
      className="py-12 sm:py-14 bg-white border-b border-[#E7E3D8]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 border-b border-[#E7E3D8] pb-4 mb-5">
          <div>
            <p className="text-xs font-semibold text-[#873A2B] uppercase tracking-wider mb-1">
              Life at MAIT
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#203044]">
              Campus Highlights
            </h2>
          </div>
          <span className="text-xs text-[#657080] hidden sm:block">
            {activePhoto + 1} / {photos.length}
          </span>
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            onScroll={(event) => {
              const { scrollLeft, clientWidth } = event.currentTarget;
              if (clientWidth > 0) {
                setActivePhoto(Math.round(scrollLeft / clientWidth));
              }
            }}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
            aria-live="polite"
          >
            {photos.map((photo, index) => (
              <article
                key={photo.src}
                className="w-full shrink-0 snap-center bg-[#F7F5EF]"
                aria-label={`Photo ${index + 1} of ${photos.length}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-[230px] sm:h-[360px] lg:h-[460px] object-contain bg-[#203044]"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="px-4 py-3 sm:px-6 sm:py-4">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#203044]">
                    {photo.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-[#657080]">
                    {photo.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={() => showPhoto(Math.max(0, activePhoto - 1))}
            disabled={activePhoto === 0}
            aria-label="Show previous campus highlight"
            className="absolute left-2 top-[calc(50%-2rem)] sm:left-4 w-10 h-10 flex items-center justify-center bg-white/90 text-[#203044] shadow hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => showPhoto(Math.min(photos.length - 1, activePhoto + 1))}
            disabled={activePhoto === photos.length - 1}
            aria-label="Show next campus highlight"
            className="absolute right-2 top-[calc(50%-2rem)] sm:right-4 w-10 h-10 flex items-center justify-center bg-white/90 text-[#203044] shadow hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-4" aria-label="Choose a campus highlight">
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => showPhoto(index)}
              aria-label={`Show photo ${index + 1}: ${photo.title}`}
              aria-current={activePhoto === index ? 'true' : undefined}
              className={`h-2.5 rounded-full transition-all ${
                activePhoto === index ? 'w-6 bg-[#873A2B]' : 'w-2.5 bg-[#D0CAC0] hover:bg-[#873A2B]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
