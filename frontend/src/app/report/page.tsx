"use client";

import React from "react";
import QuesAnsSco from "@/components/Card";

type QAItem = {
  question: string;
  answer: string;
  score: number;
};

const Report: React.FC = () => {
  const sampleQAs: QAItem[] = [
    {
      question: "What is the primary role of a database index?",
      answer:
        "A database index improves the speed of data retrieval operations by providing a quick lookup structure, similar to a book's index.",
      score: 9,
    },
    {
      question: "Explain the concept of dependency injection.",
      answer:
        "Dependency injection is a design pattern where objects receive their dependencies from external sources rather than creating them internally.",
      score: 6,
    },
    {
      question: "What are the key principles of RESTful APIs?",
      answer:
        "RESTful APIs follow stateless client-server architecture, using standard HTTP methods and providing uniform resource identifiers.",
      score: 4,
    },
    {
      question: "What is the purpose of the 'this' keyword in JavaScript?",
      answer:
        "The 'this' keyword refers to the object that is executing the current function.",
      score: 8,
    },
  ];

  const weaknesses: string[] = [
    "Understanding of RESTful API principles needs improvement",
    "Dependency injection concepts could be strengthened",
    "Need to work on explaining technical concepts more clearly",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10 bg-gradient-to-br from-[#1a237e] to-[#0d47a1] rounded-2xl py-12 px-6 shadow-xl">
          <h1 className="text-5xl font-bold text-white pb-2">
            Skill Assessment Report
          </h1>
          <p className="text-xl text-blue-100">
            Review your responses and scores below
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Overall Score Card */}
          <div className="bg-[#1e293b] rounded-2xl shadow-md p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6">
              Overall Analysis
            </h2>
            <div className="bg-[#2c3e50] rounded-xl p-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-400 mb-4">80%</div>
                <p className="text-xl text-gray-300">Overall Score</p>
              </div>
              <div className="mt-6">
                <div className="flex justify-between mb-2 text-gray-400">
                  <span>Performance</span>
                  <span className="font-semibold text-white">Good</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Weaknesses Card */}
          <div className="bg-[#1e293b] rounded-2xl shadow-md p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6">
              Areas for Improvement
            </h2>
            <div className="space-y-4">
              {weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <p className="ml-3 text-gray-300">{weakness}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl hover:brightness-110 transition duration-300 shadow-lg">
                View Detailed Recommendations
              </button>
            </div>
          </div>
        </div>
        <div className="text-white font-bold text-4xl pb-6 px-2 rounded-xl">Your Responses</div>

        {/* Cards */}
        <div className="space-y-8 mb-12">
          {sampleQAs.map((qa, index) => (
            <div key={index} className="flex justify-center">
              <QuesAnsSco
                question={qa.question}
                answer={qa.answer}
                score={qa.score}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Report;

