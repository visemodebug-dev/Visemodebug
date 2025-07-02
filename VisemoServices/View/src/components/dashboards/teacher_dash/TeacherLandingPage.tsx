// src/components/layouts/StudentLandingPage.tsx
import React, { useState, useEffect, use} from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import CreateClass from './CreateClass';

interface User {
  name: string;
  role: "Student" | "Teacher" | "Admin";
  avatarUrl?: string;
}

const user: User = {
  name: "Carl Andre Interino",
  role: "Teacher",
  avatarUrl: "/path/to/avatar.jpg",
};

const TeacherLandingPage: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateClass = (className: string) => {
      console.log("Creating Class:", className);
      setIsCreating(false);
    };

  
    useEffect(() => {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        
        setLastScrollY(currentScrollY);
      };
  
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [lastScrollY]);
  
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <div 
          className={`
            transition-all duration-300 ease-in-out
            ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
          `}
        >
          <Navbar 
            user={user} 
            logoText="VISEMO"
          />
        </div>
        <div className="min-h-screen bg-green-500 relative">
        <div 
          className={`
            flex-1 bg-green-500 overflow-auto
            transition-all duration-300
            ${isVisible ? 'mt-0' : '-mt-16'}
          `}
        >

          <button
        onClick={() => setIsCreating(true)}
        className="w-16 h-16 bg-white rounded-full leading-none
        text-4xl flex items-center justify-center 
        hover:scale-105 absolute right-8 top-24 
        shadow-md"
      >
        <svg xmlns="add-symbol-svgrepo-com.svg" 
        fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="black" 
        className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      </button>

      {isCreating && (
        <CreateClass
          onCreate={handleCreateClass}
          onCancel={() => setIsCreating(false)}
        />
      )}
      </div>
          <Outlet />
        </div>
      </div>
    );
  };

export default TeacherLandingPage;