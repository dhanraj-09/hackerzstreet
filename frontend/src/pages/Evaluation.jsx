import  { useState } from "react";
import "./Modal.css";

export default function Evaluation() {
    const [modalOpen, setModalOpen] = useState(false);






    return (
        <div className="evaluation-container">
            <h1>Evaluation Page</h1>
            <button id={"submit"} onClick={() => setModalOpen(true)}>Give us your Knowledge</button>
            {modalOpen && <EvaluationModal onClose={() => setModalOpen(false)} />}
        </div>
    );
}

function EvaluationModal({ onClose })
{
    const [step, setStep] = useState(0); // 0 = Knowledge, 1 = Interest
    const [languages,setLanguages]=useState([]);
    const [currentLanguage,setCurrentLanguage] =useState("")

    const [fields,setFields] = useState([]);
    const [currentField,setCurrentField] = useState("");

    const [dsaTopics,setDsaTopics] = useState([]);
    const [currentDsaTopic,setCurrentDsaTopic] = useState("");

    const handleAddLanguage = () => {
        if (currentLanguage && !languages.includes(currentLanguage)) {
            setLanguages([...languages, currentLanguage]);
            setCurrentLanguage("");
        }
    };

    const handleAddField = () => {
        if (currentField && !fields.includes(currentField)) {
            setFields([...fields, currentField]);
            setCurrentField("");
        }
    };

    const handleAddDsaTopic = () => {
        if (currentDsaTopic && !dsaTopics.includes(currentDsaTopic)) {
            setDsaTopics([...dsaTopics, currentDsaTopic]);
            setCurrentDsaTopic("");
        }
    };

    const removeLanguage = (lang) => {
        setLanguages(languages.filter(l => l !== lang));
    };

    const removeField = (field) => {
        setFields(fields.filter(f => f !== field));
    };

    const removeTopic = (topic) => {
        setDsaTopics(dsaTopics.filter(t => t !== topic));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
    };




    const languageOptions = [
        "C++",
        "Java",
        "Python",
        "Python3",
        "C",
        "C#",
        "JavaScript",
        "TypeScript",
        "PHP",
        "Swift",
        "Kotlin",
        "Dart",
        "Go",
        "Ruby",
        "Scala",
        "Rust",
        "Racket",
        "Erlang",
        "Elixir"
    ]

    const fieldOptions = [
        "Web Development",
        "Mobile App Development",
        "Data Science / Machine Learning",
        "Backend Development",
        "Game Development",
        "Cloud Development",
        "DevOps",
        "Cyber Security",
        "Blockchain",
        "AI/ML Development",
        "Systems Programming",
    ];

    const dsaOptions = [
        "Arrays",
        "Strings",
        "Linked Lists",
        "Trees",
        "Graphs",
        "Dynamic Programming",
        "Backtracking",
        "Greedy Algorithms",
        "Bit Manipulation",
        "Binary Search",
        "Sorting Algorithms",
        "Recursion",
    ];




    const handleKnowledgeSubmit = (e) => {
        e.preventDefault();

            setStep(1);

    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className={`slider ${step === 1 ? "slide-left" : ""}`}>





                    {/* Knowledge Page */}
                    <div className="modal-page">
                        <h2>Knowledge</h2>
                        <form onSubmit={handleKnowledgeSubmit}>
                            <div className={"Section"}>
                                <h3 className={"section-title"}>
                                    <span className={"section-number number-blue"}>1</span>
                                    Select Your Programming Languages
                                </h3>
                                <div className={"selection-controls"}>
                                    <select value={currentLanguage} onChange={(e)=>{setCurrentLanguage(e.target.value)}} className={"select-dropdown"}>
                                        <option value={""}>Select a language</option>
                                        {languageOptions.filter(lang=>!languages.includes(lang)).map((lang)=>(
                                            <option key={lang} value={lang}>{lang}</option>
                                        ))}
                                    </select>
                                    <button className={"btn btn-blue"} onClick={handleAddLanguage}
                                            disabled={!currentLanguage}>
                                        <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                             fill="currentColor">
                                            <path fillRule="evenodd"
                                                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                        Add Language
                                    </button>
                                </div>

                                <div className={"selected-items"}>
                                    {languages.length>0 ? (
                                        languages.map((language)=>(
                                            <div key={language} className={"tag tag-blue"}>
                                                {language}
                                                <button type={"button"} onClick={() => {
                                                    removeLanguage(language)
                                                }} className={"remove-btn"}>
                                                    <svg className="remove-icon" xmlns="http://www.w3.org/2000/svg"
                                                         viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd"
                                                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                              clipRule="evenodd"/>
                                                    </svg>
                                                </button>
                                            </div>
                                                ))):(
                                        <div className={"no-items"}>No languages selected yet</div>
                                    )
                                    }
                                            </div>
                                        </div>
                            <div className={"section"}>
                                <h3 className={"section-title"}>
                                    <span className={"section-number number-green"}>2</span>

                                </h3>
                            </div>




                                        <button type="submit">Next</button>
                                        </form>
                                        </div>


                                    {/* Interest Page */}
                    <div className="modal-page">
                        <h2>Interest</h2>

                        <button onClick={onClose}>Close</button>
                    </div>





                </div>
            </div>
        </div>
    );
}


// <div className={"container"}>
//     <div className={"header"}>
//         <h1>Knowledge</h1>
//     </div>
//     <div className={"container"}>
//         <div className={"Languages"}>
//             <div></div>
//             <div></div>
//         </div>
//         <div className={"dev_fields"}>
//             <div></div>
//             <div></div>
//         </div>
//         <div className={"dsa"}>
//             <div></div>
//             <div></div>
//         </div>
//     </div>
// </div>
