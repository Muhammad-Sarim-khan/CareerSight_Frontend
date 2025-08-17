'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Gauge } from "lucide-react";
import { FileText } from "lucide-react";
import { Lightbulb } from "lucide-react";
import { useJob } from '@/context/JobContext';

import { ArrowPathIcon, ClipboardIcon, CheckIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import LLMOutput from './components/LLMOutput';
export default function Home() {
  const { jobDescription, setJobDescription, resumeFile, setResumeFile, resumeName, setResumeName } = useJob();
  // const [resumeFile, setResumeFile] = useJob();
  // const [resumeName, setResumeName] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [linkedinURL, setLinkedinURL] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feature, setFeature] = useState("");


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    setResumeName(file ? file.name : '');
  };

  const handleSubmit = async (promptType) => {
    if (!resumeFile && promptType !== 'linkedin_tips') {
      setError('Please upload a resume.');
      return;
    }
    if (promptType !== 'linkedin_tips' && !jobDescription) {
      setError('Please enter a job description.');
      return;
    }
    if (promptType === 'linkedin_tips' && !linkedinURL) {
      setError('Please enter your LinkedIn profile URL.');
      return;
    }

    setError('');
    const formData = new FormData();
    if (resumeFile) formData.append('resume', resumeFile);
    if (jobDescription) formData.append('job_description', jobDescription);
    formData.append('prompt_type', promptType);

    if (promptType === 'linkedin_tips' && linkedinURL) {
      formData.append('linkedin_url', linkedinURL);
    }

    try {
      setLoading(true);
      setResponse('');
      const res = await fetch('https://web-production-210ac.up.railway.app/analyze_resume', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResponse(data.result);
    } catch (err) {
      setResponse('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setJobDescription('');
    setResumeFile(null);
    setResumeName('');
    setLinkedinURL('');
    setResponse('');
    setError('');
  };

  return (
    <main className="relative min-h-screen bg-gray-50 py-5 px-4 overflow-hidden">

      <img
        src="/resume-bg4.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-1000 ease-in-out scale-105"
      />

      <div className="relative z-10 max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl px-10 py-8 backdrop-blur-md bg-opacity-90 animate-fadeIn">
        <div style={{ backgroundColor: '#CCF0B3' }} className="flex justify-center items-center rounded-lg p-3 shadow-inner">
          <img src="/logo.png" alt="logo" className="w-full h-25 object-contain max-h-32 mx-auto border-2 border-black rounded-lg" />
        </div>
        <p className="text-center text-black font-semibold mb-8 mt-4 text-2xl tracking-wide">
          Get professional insights, skill suggestions & match percentage
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-6 text-center font-medium shadow-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume (PDF only)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg p-2 bg-white hover:border-green-500 transition"
          />
          {resumeName && (
            <p className="text-sm text-green-600 mt-1 animate-fadeIn">📄 {resumeName}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here..."
            className="w-full rounded-lg border border-gray-300 p-3 h-40 resize-none hover:border-blue-500 transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <button
            onClick={() => { setFeature("resume_review"); handleSubmit('resume_review') }}
            className="flex items-center justify-center cursor-pointer gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition"
          >
            <FileText size={20} />
            Review Resume
          </button>

          <button
            onClick={() => { setFeature("skills_improvement"); handleSubmit('skills_improvement') }}
            className="flex items-center justify-center cursor-pointer gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition"
          >
            <Lightbulb size={20} />
            Improve My Skills
          </button>

          <button
            onClick={() => { setFeature("percentage_match"); handleSubmit('percentage_match') }}
            className="flex items-center justify-center cursor-pointer gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition"
          >
            <Gauge size={20} />
            Match Percentage
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center text-gray-600 mb-6">
            <ArrowPathIcon className="w-6 h-6 animate-spin mr-2" />
            <span>Analyzing your request...</span>
          </div>
        )}

        {response && !loading && (
          <div className="relative bg-gray-100 border border-gray-300 rounded-xl p-6 whitespace-pre-wrap text-gray-800 shadow-inner backdrop-blur-md bg-opacity-80 transition-all duration-300 hover:shadow-lg animate-fadeIn">
            {/* <h2 className="text-2xl font-semibold mb-3">Resume Evaluation</h2> */}
            <h2 className="text-2xl font-semibold mb-3">
              {feature === "resume_review" && "Resume Evaluation"}
              {feature === "skills_improvement" && "Skills Improvement Suggestions"}
              {feature === "percentage_match" && "Percentage Match Analysis"}
            </h2>
            <LLMOutput text={response}></LLMOutput>

            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleCopy}
                className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition"
              >
                {copied ? (
                  <span className="flex items-center gap-1">
                    <CheckIcon className="w-4 h-4" /> Copied
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <ClipboardIcon className="w-4 h-4" /> Copy
                  </span>
                )}
              </button>
              <button
                onClick={handleClear}
                className="text-sm text-gray-500 border border-gray-300 px-3 py-1 rounded hover:bg-gray-50 transition"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
