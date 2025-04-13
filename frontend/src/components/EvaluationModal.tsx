"use client";
import { useState, ChangeEvent, FormEvent } from "react";

type EvaluationModalProps = {
  onClose: () => void;
};

const languagesList = [
  "C++",
  "Java",
  "Python",
  "C",
  "C#",
  "JavaScript",
  "TypeScript",
  "PHP",
  "Go",
  "Rust",
];

const fieldOptions = [
  "Frontend",
  "Backend",
  "DevOps",
  "Full Stack",
  "AI Engineer",
  "Data Analyst",
  "AI and Data Scientist",
  "Android",
  "iOS",
  "PostgreSQL",
  "Blockchain",
  "Software Architect",
  "Cyber Security",
  "UX Design",
];

export default function EvaluationModal({ onClose }: EvaluationModalProps) {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState("");
  const [field, setField] = useState("");

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    if (language && field) {
      setStep(1);
    }
  };

  return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-black mx-4 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-lg text-white space-y-6">
          {step === 0 && (
              <form onSubmit={handleNext} className="space-y-6">
                <h2 className="text-2xl font-bold text-center text-white">
                  In the last 7 days, what is your tech experience{" "}
                  <span className="text-blue-400">at its peak</span>?
                </h2>

                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Select a Language
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {languagesList.map((lang) => (
                        <label
                            key={lang}
                            className={`flex items-center px-4 py-2 rounded-xl cursor-pointer transition-all border ${
                                language === lang
                                    ? "bg-blue-600/20 border-blue-400 text-blue-200"
                                    : "border-white/10 hover:bg-white/10 text-white/80"
                            }`}
                        >
                          <input
                              type="radio"
                              name="language"
                              value={lang}
                              checked={language === lang}
                              onChange={(e) => setLanguage(e.target.value)}
                              className="mr-2 accent-blue-500"
                          />
                          {lang}
                        </label>
                    ))}
                  </div>
                </div>

                {/* Field Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Choose Your Field
                  </label>
                  <select
                      value={field}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          setField(e.target.value)
                      }
                      className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a field</option>
                    {fieldOptions.map((f) => (
                        <option key={f} value={f} className="text-black">
                          {f}
                        </option>
                    ))}
                  </select>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                  <button
                      type="submit"
                      disabled={!language || !field}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:brightness-110 transition"
                  >
                    Next
                  </button>
                </div>
              </form>
          )}

          {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white text-center">
                  Your selected interests
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Language Card */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-400 mb-1">
                        Programming Language
                      </h3>
                      <p className="text-white text-xl font-bold">{language}</p>
                    </div>
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:brightness-110 transition">
                      Take Quiz
                    </button>
                  </div>

                  {/* Field Card */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-400 mb-1">
                        Field
                      </h3>
                      <p className="text-white text-xl font-bold">{field}</p>
                    </div>
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:brightness-110 transition">
                      Take Quiz
                    </button>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <button
                      onClick={onClose}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl transition"
                  >
                    Close
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}
