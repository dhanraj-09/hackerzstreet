"use client";

import React, { useEffect, useState } from "react";
import QuesAnsSco from "@/components/Card";
import { useRouter } from "next/navigation";

type QAItem = {
  question: string;
  answer: string;
  score: number;
};

type ReportData = {
  qalist: QAItem[];
  analysisReport: string;
  weaknesses: string[] | string; // Changed to accept both string and string array
};

const Report: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [overallScore, setOverallScore] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setError('');
        const response = await fetch('http://192.168.131.108:5000/api/report', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }

        const data = await response.json();
        
        if (data.success && data.report) {
          setReportData(data.report);
          // Calculate overall score
          const totalScore = data.report.qalist.reduce((acc: number, qa: QAItem) => acc + qa.score, 0);
          const avgScore = Math.round((totalScore / data.report.qalist.length) * 10);
          setOverallScore(avgScore);
        } else {
          throw new Error('Invalid report data received');
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        setError('Failed to load report. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setError('');
    window.location.reload();
  };

  const handleBackToHome = () => {
    router.push('/home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center">
        <div className="text-white text-2xl">Loading report...</div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center">
        <div className="bg-[#1e293b] rounded-2xl shadow-md p-8 border border-gray-700 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Report</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={handleRetry}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
            >
              Try Again
            </button>
            <button
              onClick={handleBackToHome}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-xl hover:bg-gray-700 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Convert weaknesses to array if it's a string
  const weaknessesArray = Array.isArray(reportData.weaknesses) 
    ? reportData.weaknesses 
    : typeof reportData.weaknesses === 'string'
      ? [reportData.weaknesses] // Convert single string to array
      : []; // Default empty array if undefined or null

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
                <div className="text-6xl font-bold text-blue-400 mb-4">{overallScore}%</div>
                <p className="text-xl text-gray-300">Overall Score</p>
              </div>
              <div className="mt-6">
                <div className="flex justify-between mb-2 text-gray-400">
                  <span>Performance</span>
                  <span className="font-semibold text-white">
                    {overallScore >= 80 ? 'Excellent' : 
                     overallScore >= 60 ? 'Good' :
                     overallScore >= 40 ? 'Fair' : 'Needs Improvement'}
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${overallScore}%` }}
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
              {weaknessesArray.map((weakness, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <p className="ml-3 text-gray-300">{weakness}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-gray-300">
              <p className="text-sm italic">{reportData.analysisReport}</p>
            </div>
          </div>
        </div>

        <div className="text-white font-bold text-4xl pb-6 px-2 rounded-xl">Your Responses</div>

        {/* Cards */}
        <div className="space-y-8 mb-12">
          {reportData.qalist.map((qa, index) => (
            <div key={index} className="flex justify-center">
              <QuesAnsSco
                question={qa.question}
                answer={qa.answer}
                score={qa.score}
              />
            </div>
          ))}
        </div>

        {/* Back to Home Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleBackToHome}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-xl hover:brightness-110 transition duration-300 shadow-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;