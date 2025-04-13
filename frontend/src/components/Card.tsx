"use client";

import React from "react";

interface QuesAnsScoProps {
  question: string;
  answer: string;
  score: number;
}

const QuesAnsSco: React.FC<QuesAnsScoProps> = ({ question, answer, score }) => {
  const getScoreColor = (score: number): string => {
    if (score >= 7) return "bg-emerald-600";
    if (score >= 5) return "bg-yellow-500";
    return "bg-red-600";
  };

  return (
    <div className="w-full max-w-7xl bg-[#1e293b] rounded-2xl shadow-lg border border-white/70 transition-shadow duration-300 overflow-hidden">
      {/* Score Badge */}
      <div className="relative">
        <div
          className={`absolute top-3 right-3 ${getScoreColor(
            score
          )} text-white text-sm sm:text-base font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-md`}
        >
          {score}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Question */}
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-200 uppercase tracking-wide">
            Question
          </h3>
          <p className="text-gray-100 text-base sm:text-lg font-medium">
            {question}
          </p>
        </div>

        {/* Answer */}
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-200 uppercase tracking-wide">
            Answer
          </h3>
          <p className="text-gray-300 text-sm sm:text-base">{answer}</p>
        </div>

        {/* Score - Mobile only */}
        <div className="md:hidden">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Score
          </h3>
          <p
            className={`text-base font-bold ${
              score >= 6 ? "text-emerald-500" : "text-red-400"
            }`}
          >
            {score}/10
          </p>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-500"></div>
    </div>
  );
};

export default QuesAnsSco;
