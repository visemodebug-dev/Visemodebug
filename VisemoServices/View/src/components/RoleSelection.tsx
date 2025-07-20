import React from "react";
import RoleCard from "./RoleCard";

const RoleSelection: React.FC = () => {
  return (
    <section className="px-32 py-16 w-full bg-green-500 max-md:px-16 max-sm:px-5">
      <div className="flex flex-col items-center">
        <header className="flex gap-2 items-center mb-10">
          <h2 className="text-4xl font-semibold text-white">Are you</h2>
          <span className="text-4xl font-semibold text-amber-500">a...</span>
        </header>

        <div className="flex gap-10 justify-center max-md:flex-wrap">
          <RoleCard
            imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/ca93317db8d44b9dd4132a0801dbe2bc64ce7931"
            altText="Teacher illustration"
            role="Teacher"
            imageClassName="w-[178px] h-[180px]"
            link="/loginauth/teacher"
          />

          <RoleCard
            imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/33dfef96428ad5c0496e4917e49fe774aa3be797"
            altText="Student illustration"
            role="Student"
            imageClassName="w-[113px] h-[172px]"
            link="/loginauth/student"
          />
        </div>
      </div>
    </section>
  );
};

export default RoleSelection;
