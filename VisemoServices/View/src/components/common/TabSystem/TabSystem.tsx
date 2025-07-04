// src/components/common/TabSystem/TabSystem.tsx
import React from 'react';
import { TabSystemProps } from './Types';

const TabSystem: React.FC<TabSystemProps> = ({
  tabs,
  activeTab,
  onTabChange,
  children
}) => {
  return (
    <div className="overflow-hidden bg-white rounded-lg border">
      {/* Tabs Header */}
      <div className="flex border-b border-green-500">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-8 py-2 text-base font-medium ${
              activeTab === tab.id
                ? 'bg-green-100 text-black border-r border-green-500'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="bg-white min-h-[500px]">
        {children}
      </div>
    </div>
  );
};

export default TabSystem;