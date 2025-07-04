"use client";
import * as React from "react";

interface UserProfileProps {
  name: string;
  role: string;
}

function UserProfile({ name, role }: UserProfileProps) {
  return (
    <div className="flex gap-3 items-center">
      <div className="flex gap-3 items-center">
        <div className="h-[46px] w-[46px]">
          <div className="rounded-full bg-zinc-300 h-[46px] w-[46px]" />
        </div>
        <div className="flex flex-col">
          <p className="text-lg font-bold text-white">{name}</p>
          <p className="text-lg font-medium text-white">{role}</p>
        </div>
      </div>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/89e6a4fab90a7ee027fa248ddd38fda738186506"
        alt="Expand arrow"
        className="w-[32px] h-[37px]"
      />
    </div>
  );
}

export default UserProfile;
