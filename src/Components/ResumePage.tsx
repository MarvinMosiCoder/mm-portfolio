import React from "react";
import { useParams } from "react-router-dom";
import Resume from "../Components/Resume";
import { resumeDataMap } from "../data/resumeData";

export default function ResumePage() {
  const { slug = "marvin-mosico" } = useParams();

  const resumeData = resumeDataMap[slug] ?? null;

  if (!resumeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-red-500">
          Failed to load resume: Profile not found.
        </p>
      </div>
    );
  }

  return <Resume data={resumeData} />;
}