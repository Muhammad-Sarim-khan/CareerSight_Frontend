"use client";

import { useState } from "react";
import { FileText, Briefcase, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LLMOutput from "../components/LLMOutput";
import { useJob } from "@/context/JobContext";

export default function JobRoleExpansionPage() {
  const {resumeFile, setResumeFile,resumeName, setResumeName} = useJob();
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert("Please upload a Resume.");
      return;
    }
    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const res = await fetch("http://localhost:8000/job_role_expansion", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      setResult(data.result || "No response received.");
    } catch (error) {
      console.error("Error fetching job role expansion:", error);
      alert("An error occurred while analyzing the resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <Briefcase className="w-8 h-8 text-purple-600" />
        AI-powered Job Role Expansion
      </h1>

      <Card className="bg-white shadow-lg">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-gray-600" />
              {/* <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="border border-gray-300 p-2 rounded-lg"
              /> */}
              <label className="cursor-pointer hover:border-green-400 bg-white p-2 rounded-lg border border-gray-300">
                Choose File
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setResumeFile(file);
                    setResumeName(file ? file.name : '');
                  }}
                  className="hidden"
                />
              </label>

              <span className="text-sm text-green-700">
                {resumeName || "No file chosen"}
              </span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white cursor-pointer hover:bg-purple-700 flex items-center gap-2 mt-10"
            >
              {loading && <Loader2 className="animate-spin w-5 h-5" />}
              {loading ? "Analyzing..." : "Get Job Role Suggestions"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-6 bg-gray-50 shadow-lg">
          <CardHeader>
            <CardTitle className='text-2xl'>Suggested Job Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <LLMOutput text={result} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
