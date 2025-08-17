"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ClipboardList, Edit3, Briefcase } from "lucide-react";

export default function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    setIsOpen(false);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
     
      <div
        className={`bg-gray-800 text-white p-4 transition-all duration-300 ease-in-out z-50 fixed top-0 left-0 h-screen 
          ${isMobile
            ? isOpen
              ? "translate-x-0 w-64"
              : "-translate-x-full w-64"
            : isOpen
            ? "w-64"
            : "w-20"}
        `}
      >
        <button
          className="mb-6 text-sm bg-gray-700 px-2 py-1 rounded w-full cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Close" : "☰"}
        </button>
        <nav className="space-y-3 ml-1">
          <Link
            href="/resume-scoring"
            className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded"
            title="Resume Scoring"
            onClick={() => isMobile && setIsOpen(false)}
          >
            <ClipboardList size={20} />
            {isOpen && <span>Resume Scoring</span>}
          </Link>

          <Link
            href="/resume-rewrite"
            className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded"
            title="Resume Rewrite"
            onClick={() => isMobile && setIsOpen(false)}
          >
            <Edit3 size={20} />
            {isOpen && <span>Resume Rewrite</span>}
          </Link>

          <Link
            href="/job-role-expansion"
            className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded"
            title="Job Role Expansion"
            onClick={() => isMobile && setIsOpen(false)}
          >
            <Briefcase size={20} />
            {isOpen && <span>Job Role Expansion</span>}
          </Link>
        </nav>
      </div>

      <div
        className={`flex-1 flex flex-col transition-all duration-300
          ${isMobile ? "ml-0" : isOpen ? "ml-64" : "ml-20"}
        `}
      >
        <header className="bg-gray-900 text-white p-4 shadow-md flex items-center">
          {isMobile && (
            <button
              className="bg-gray-700 px-3 py-2 rounded mr-4 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              ☰
            </button>
          )}
          <Link href='/' className="text-2xl font-bold ">CareerSight</Link>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
