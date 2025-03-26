"use client";

import React from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import RoleSelection from "./RoleSelection";

const VisemoLanding: React.FC = () => {
  return (
    <main className="flex flex-col w-full bg-white min-h-screen">
      <Header />
      <HeroSection />
      <RoleSelection />
    </main>
  );
};

export default VisemoLanding;
