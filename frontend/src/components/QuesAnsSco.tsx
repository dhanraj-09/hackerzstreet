// components/QuesAnsSco.tsx

import React from 'react';

interface QuesAnsScoProps {
    question: string;
    answer: string;
    score: number;
}

const QuesAnsSco: React.FC<QuesAnsScoProps> = ({ question, answer, score }) => {
    // Function to determine score color based on value
    const getScoreColor = (score: number): string => {
        if (score >= 7) return 'bg-green-700';
        if (score >= 5) return 'bg-yellow-500';
        return 'bg-red-600';
    };

    return (
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            {/* Score Badge */}
            <div className="relative">
                <div
                    className={`absolute top-4 right-4 ${getScoreColor(
                        score
                    )} text-white text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-lg`}
                >
                    {score}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Question Section */}
                <div className="space-y-2">
                    <h3 className="text-4xl font-semibold text-indigo-600 tracking-wide uppercase">
                        Question
                    </h3>
                    <p className="text-gray-800 text-2xl font-medium">{question}</p>
                </div>

                {/* Answer Section */}
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-purple-600 tracking-wide uppercase">
                        Answer
                    </h3>
                    <p className="text-gray-600 text-xl">{answer}</p>
                </div>

                {/* Score Section - Mobile view */}
                <div className="md:hidden">
                    <h3 className="text-sm font-semibold text-emerald-600 tracking-wide uppercase">
                        Score
                    </h3>
                    <p
                        className={`text-lg font-bold ${
                            score >= 6 ? 'text-emerald-600' : 'text-red-600'
                        }`}
                    >
                        {score}/10
                    </p>
                </div>
            </div>

            {/* Gradient Border Bottom */}
            <div className="h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500"></div>
        </div>
    );
};

export default QuesAnsSco;
