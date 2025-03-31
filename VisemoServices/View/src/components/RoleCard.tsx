import React from "react";
import { Link } from "react-router-dom";

interface RoleCardProps {
  imageUrl: string;
  altText: string;
  role: string;
  imageClassName?: string;
  link: string;
}

const RoleCard: React.FC<RoleCardProps> = ({
  imageUrl,
  altText,
  role,
  imageClassName = "",
  link,
}) => {
  return (
    <Link to={link}>
    <article className="flex flex-col gap-5 items-center">
      <div className="flex flex-col justify-center items-center rounded-3xl border-orange-600 bg-zinc-300 bg-opacity-60 border-[3px] h-[236px] w-[238px]">
        <img src={imageUrl} alt={altText} className={imageClassName} />
        <h3 className="text-2xl font-semibold text-white">{role}</h3>
      </div>
    </article>
    </Link>
  );
};

export default RoleCard;
