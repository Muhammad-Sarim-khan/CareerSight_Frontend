"use client";
import { createContext, useState, useContext } from "react";

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null); // can store base64 if needed
  const [resumeName, setResumeName] = useState('');

  return (
    <JobContext.Provider value={{
      jobDescription,
      setJobDescription,
      resumeFile,
      setResumeFile,
      resumeName, 
      setResumeName
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJob = () => useContext(JobContext);
