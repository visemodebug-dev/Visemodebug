"use client";

import React, { useState } from "react";
import Typography from '@mui/material/Typography';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex flex-col items-center">
      <nav className="flex justify-between items-center px-32 w-full border border-zinc-400 h-95px max-w-1200px max-md:px-16 max-sm:px-5 p-5">
          <Typography
            variant="h6"
            component="a"
            href="#"
            sx={{ flexGrow: 1, color: '#F18701', fontWeight: 'bold', fontSize: '20px', textDecoration: 'none' }}
          >
            VISEMO
          </Typography>
        <ul className="flex gap-5 items-center max-md:hidden">
          <li>
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-zinc-900"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-zinc-900"
            >
              Features
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-zinc-900"
            >
              About Us
            </a>
          </li>
          <li className="flex gap-5 items-center">
            <button className="px-4 py-2 text-sm font-semibold leading-6 bg-yellow-400 rounded-2xl text-stone-950">
              Login
            </button>
          </li>
        </ul>

        <button
          className="hidden max-md:block"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M4 6l16 0"></path>
            <path d="M4 12l16 0"></path>
            <path d="M4 18l16 0"></path>
          </svg>
        </button>

        {isMenuOpen && (
          <div className="absolute top-95px left-0 right-0 bg-white z-50 border-b border-zinc-400 md:hidden">
            <ul className="flex flex-col items-center py-4">
              <li className="py-2">
                <a
                  href="#"
                  className="text-sm font-semibold leading-6 text-zinc-900"
                >
                  Home
                </a>
              </li>
              <li className="py-2">
                <a
                  href="#"
                  className="text-sm font-semibold leading-6 text-zinc-900"
                >
                  Features
                </a>
              </li>
              <li className="py-2">
                <a
                  href="#"
                  className="text-sm font-semibold leading-6 text-zinc-900"
                >
                  About Us
                </a>
              </li>
              <li className="py-2">
                <button className="px-4 py-2 text-sm font-semibold leading-6 bg-yellow-400 rounded-2xl text-stone-950">
                  Login
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
