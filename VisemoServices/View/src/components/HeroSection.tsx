import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="flex justify-between items-center px-32 py-10 w-full max-w-[1200px] max-md:flex-col max-md:gap-10 max-md:px-16 max-sm:px-5 mx-auto">
      <div className="flex flex-col max-w-[620px]">
        <p className="mb-5 text-sm font-semibold leading-6 text-zinc-900">
          Enhancing Education Through Emotional Insights
        </p>
        <h2 className="text-8xl font-black leading-normal max-md:text-7xl max-sm:text-5xl">
          <span className="text-zinc-900">Welcome to </span>
          <span className="text-amber-500">VISEMO</span>
        </h2>
      </div>
      <p className="text-lg font-semibold leading-6 max-w-[358px] text-zinc-900">
        Visemo uses advanced sentiment analysis and computer vision technology
        to help educators understand their students' emotional states. Empower
        your teaching strategies with real-time insights!
      </p>
    </section>
  );
};

export default HeroSection;
