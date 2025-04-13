// app/report/page.tsx or components/Report.tsx (based on your structure)

'use client';

import React from 'react';
import QuesAnsSco from "@/components/QuesAnsSco";

type QAItem = {
    question: string;
    answer: string;
    score: number;
};

const Report: React.FC = () => {
    // Sample data - replace with actual data later
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
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8 bg-gradient-to-br from-[#1a237e] to-[#0d47a1] rounded-2xl py-12 px-6 shadow-lg">
                    <h1 className="text-5xl font-bold text-white pb-2">
                        Skill Assessment Report
                    </h1>
                    <p className="text-xl text-white">
                        Review your responses and scores below
                    </p>
                </div>

                {/* Cards Container */}
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

                {/* Analysis Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Overall Score Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            Overall Analysis
                        </h2>
                        <div className="bg-blue-50 rounded-xl p-6">
                            <div className="text-center">
                                <div className="text-6xl font-bold text-blue-600 mb-4">80%</div>
                                <p className="text-xl text-gray-700">Overall Score</p>
                            </div>
                            <div className="mt-6">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Performance</span>
                                    <span className="font-semibold">Good</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: '80%' }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weaknesses Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            Areas for Improvement
                        </h2>
                        <div className="space-y-4">
                            {weaknesses.map((weakness, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    </div>
                                    <p className="ml-3 text-gray-700">{weakness}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors duration-300">
                                View Detailed Recommendations
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Report;
