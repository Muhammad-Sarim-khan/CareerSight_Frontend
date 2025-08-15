'use client';

import { useState } from "react";
import { FileText, ClipboardList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import LiquidFillGauge from "react-liquid-gauge"; // ⬅ New import
import { useJob } from "@/context/JobContext";

export default function ResumeScoringPage() {
  const { jobDescription, setJobDescription, resumeFile, setResumeFile, resumeName, setResumeName } = useJob();
  // const [resumeFile, setResumeFile] = useJob();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription) {
      alert("Please provide both Job Description and Resume.");
      return;
    }
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("job_description", jobDescription);
    formData.append("resume", resumeFile);

    try {
      const res = await fetch("http://localhost:8000/resume_scoring_dashboard", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      setResult(data.result || data);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert("An error occurred while analyzing the resume.");
    } finally {
      setLoading(false);
    }
  };

  const getBarColor = (score) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const renderScores = (data, isCircle = false) => {
    if (!data || typeof data !== "object") return null;

    return (
      <div
        className={
          isCircle
            ? "grid grid-cols-2 sm:grid-cols-4 gap-6"
            : "space-y-4"
        }
      >
        {Object.entries(data).map(([category, value]) => {
          if (typeof value === "number") {
            if (isCircle) {
              return (
                <div
                  key={category}
                  className="flex flex-col items-center justify-center"
                >
                  <LiquidFillGauge
                    style={{ margin: "0 auto" }}
                    width={120}
                    height={120}
                    value={value}
                    textSize={1}
                    textOffsetX={0}
                    textOffsetY={0}
                    textRenderer={(props) => {
                      const valueStyle = {
                        fontSize: "22px",
                        fontWeight: "bold",
                        fill: "#0f766e"
                      };
                      const percentStyle = {
                        fontSize: "14px",
                        fill: "#0f766e"
                      };
                      return (
                        <tspan>
                          <tspan style={valueStyle}>{props.value}</tspan>
                          <tspan style={percentStyle}>%</tspan>
                        </tspan>
                      );
                    }}
                    waveAnimation
                    waveFrequency={2}
                    waveAmplitude={3}
                    gradient
                    gradientStops={[
                      { key: "0%", stopColor: "#bbf7d0", stopOpacity: 1, offset: "0%" },
                      { key: "100%", stopColor: "#22c55e", stopOpacity: 1, offset: "100%" }
                    ]}
                    circleStyle={{ fill: "#d1fae5" }}
                  />
                  <div className="text-xs font-medium text-gray-700 mt-2 text-center capitalize">
                    {category.replace(/_/g, " ")}
                  </div>
                </div>
              );
            }
            return (
              <li key={category}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{category}</span>
                  <span className="font-bold">{value}%</span>
                </div>
                <Progress value={value} className={`${getBarColor(value)} h-3`} />
              </li>
            );
          }
          if (typeof value === "object" && value !== null && "score" in value) {
            if (isCircle) {
              return (
                <div
                  key={category}
                  className="flex flex-col items-center justify-center"
                  title={value?.description ?? "No description provided."}
                >
                  <LiquidFillGauge
                    style={{ margin: "0 auto" }}
                    width={120}
                    height={120}
                    value={value?.score ?? 0}
                    textSize={1}
                    textOffsetX={0}
                    textOffsetY={0}
                    textRenderer={(props) => {
                      const valueStyle = {
                        fontSize: "22px",
                        fontWeight: "bold",
                        fill: "#0f766e"
                      };
                      const percentStyle = {
                        fontSize: "14px",
                        fill: "#0f766e"
                      };
                      return (
                        <tspan>
                          <tspan style={valueStyle}>{props.value}</tspan>
                          <tspan style={percentStyle}>%</tspan>
                        </tspan>
                      );
                    }}
                    waveAnimation
                    waveFrequency={2}
                    waveAmplitude={3}
                    gradient
                    gradientStops={[
                      { key: "0%", stopColor: "#bbf7d0", stopOpacity: 1, offset: "0%" },
                      { key: "100%", stopColor: "#22c55e", stopOpacity: 1, offset: "100%" }
                    ]}
                    circleStyle={{ fill: "#d1fae5" }}
                  />
                  <div className="text-xs font-medium text-gray-700 mt-2 text-center capitalize">
                    {category.replace(/_/g, " ")}
                  </div>
                </div>
              );
            }
            return (
              <div
                key={category}
                className="mb-4 p-4 bg-white rounded-lg shadow-sm border"
              >
                <p className="font-bold">
                  {category} ({value?.score ?? 0}%)
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {value?.description ?? "No description provided."}
                </p>
              </div>
            );
          }
          if (typeof value === "object" && value !== null) {
            return renderScores(value, isCircle);
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <ClipboardList className="w-8 h-8 text-blue-600" />
        Resume Scoring Dashboard
      </h1>
      <p className=" text-black font-semibold mb-8 mt-4 text-xl tracking-wide ">Evaluate your resume’s relevance and strength against any job description.
        </p>

      <Card className="bg-white shadow-lg">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <textarea
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-blue-200"
              rows="4"
              placeholder="Paste Job Description..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-gray-600" />
              {/* <input
                type="file"
                accept="application/pdf"
                // onChange={(e) => setResumeFile(e.target.files[0])}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setResumeFile(file); // stores file in context
                  setResumeName(file ? file.name : ""); // stores file name in context
                }}
                className="border border-gray-300 p-2 rounded-lg"
              />
              <span className="text-sm text-gray-700">
                {resumeName || "No file chosen"}
              </span> */}
              <label className="cursor-pointer bg-white hover:border-green-400 p-2 rounded-lg border border-gray-300">
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

              <span className="text-sm text-green-600">
                {resumeName || "No file chosen"}
              </span>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700 flex items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin w-5 h-5" />}
              {loading ? "Analyzing..." : "Score Resume"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-6 bg-gray-50 shadow-lg">
          <CardHeader>
            <CardTitle>Scores & Details</CardTitle>
          </CardHeader>
          <CardContent>
            {result.resume_score && (
              <>
                <h2 className="text-xl font-bold mb-2">Scores</h2>
                <ul className="space-y-4">
                  {renderScores(result.resume_score)}
                </ul>
              </>
            )}
            {result.category_details && (
              <>
                <h2 className="text-xl font-bold mt-6 mb-4">Details</h2>
                {renderScores(result.category_details, true)}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
