"use client";

import React, { useRef } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import RoleSelection from "./RoleSelection";

const VisemoLanding: React.FC = () => {
  const roleRef = useRef<HTMLDivElement>(null);

  return (
    <main className="flex flex-col w-full bg-white min-h-screen">
      <Header onLoginClick={() => {
        roleRef.current?.scrollIntoView({ behavior: "smooth" });
      }} />
      <HeroSection />
      <div ref={roleRef}>
        <RoleSelection />
      </div>
    </main>
  );
};

export default VisemoLanding;
