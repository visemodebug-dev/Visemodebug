import React from "react";

const ActivitiesTab: React.FC = () => {
    return (
        <div>
            <div className="flex justify-center my-6">
                <button className="bg-yellow-400 text-lg font-bold px-6 py-2 rounded-full hover:scale-105 transition flex items-center gap-2 shadow">
                <svg xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create Activity
                </button>

            </div>
        </div>
    );
}

export default ActivitiesTab;
