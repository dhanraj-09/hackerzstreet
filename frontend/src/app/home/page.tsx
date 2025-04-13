"use client";

import EvaluationModal from "@/components/EvaluationModal";
import { useState } from "react";

export default function EvaluationPage() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-12 space-y-10 overflow-hidden">

            {/* Decorative Background Glow */}
            <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl animate-pulse" />

            {/* Title */}
            <h1 className="text-5xl font-extrabold text-center drop-shadow-md z-10">Skill Evaluation Portal
            </h1>

            {/* Description */}
            <p className="text-lg max-w-2xl text-center text-slate-300 z-10">
                Test your expertise across various domains. Whether it's Web Dev, AI, Cybersecurity, or DevOps — we’ve crafted quick evaluations to gauge your knowledge and help you grow.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl z-10">
                {[
                    {
                        title: "🌐 Multiple Domains",
                        desc: "Choose from AI/ML, Web Development, Cybersecurity, and DevOps.",
                    },
                    {
                        title: "⚡ Quick & Easy",
                        desc: "Assess your skills in just a few minutes with curated questions.",
                    },
                    {
                        title: "📊 Instant Feedback",
                        desc: "Get real-time insights on your performance and where to improve.",
                    },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                        <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                        <p className="text-sm text-slate-300">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* Call-to-action Button */}
            <button
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:brightness-110 transition-all shadow-xl z-10"
                onClick={() => setModalOpen(true)}
            >
                Start Evaluation
            </button>

            {/* Modal */}
            {modalOpen && <EvaluationModal onClose={() => setModalOpen(false)} />}
        </div>
    );
}
