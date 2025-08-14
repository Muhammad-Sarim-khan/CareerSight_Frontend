"use client";
import ReactMarkdown from "react-markdown";

export default function LLMOutput({ text }) {
  return <ReactMarkdown>{text}</ReactMarkdown>;
}
