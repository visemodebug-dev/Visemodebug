// src/components/layouts/StudentLandingPage.tsx
import React, { useState, useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';

interface User {
  name: string;
  role: "Student" | "Teacher" | "Admin";
  avatarUrl?: string;
}

const user: User = {
  name: "Carl Andre Interino",
  role: "Student",
  avatarUrl: "/path/to/avatar.jpg",
};

const StudentLandingPage: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
  
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
        <div 
          className={`
            flex-1 bg-green-500 overflow-auto
            transition-all duration-300
            ${isVisible ? 'mt-0' : '-mt-16'}
          `}
        >
          <Outlet />
        </div>
      </div>
    );
  };

export default StudentLandingPage;