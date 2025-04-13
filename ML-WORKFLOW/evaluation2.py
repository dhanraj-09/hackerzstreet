# main.py

from typing import List, Dict, Any
from pydantic import BaseModel, Field
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import re
import json
from dotenv import load_dotenv
import os

load_dotenv()  # Loads from .env
# (os.getenv("YOUR_ENV_VAR"))

# Flask setup
app = Flask(__name__)
CORS(app)

# Configure Gemini
genai.configure(api_key=os.getenv("YOUR_ENV_VAR"))
model = genai.GenerativeModel(model_name="gemini-2.0-flash")


# -------- Pydantic Schemas --------
class QuestionGeneratorInput(BaseModel):
    topic: str = Field(description="Topic for the question")
    difficulty: str = Field(description="Difficulty level: easy, medium, or hard")


class EvaluationInput(BaseModel):
    answer: str = Field(description="User's answer to evaluate")
    question: str = Field(description="The question that was asked")
    difficulty: str = Field(description="Difficulty level of the question")


class QuestionSelectorInput(BaseModel):
    current_difficulty: str = Field(description="Current difficulty level")
    eval_score: int = Field(description="Current evaluation score")
    question_count: int = Field(description="Number of questions asked so far")


class ReportGeneratorInput(BaseModel):
    questions: List[str]
    answers: List[str]
    eval_scores: List[int]


# -------- Utility Functions --------
def Question_generator(input_data: QuestionGeneratorInput, additional_prompt: str = "") -> str:
    # Build a clear and strict prompt
    prompt = (
        f"You are an experienced and strict teacher creating quiz questions.\n"
        f"Your task is to ask one theoretical, concise, and clear question about the topic '{input_data.topic}'.\n"
        f"The question should be of '{input_data.difficulty}' difficulty.\n"
        f"Make sure it is not too long or vague.\n"
        f"Only return the question, do not include explanations or any introductory text.\n"
    )

    if additional_prompt:
        prompt += f"\nAdditional Instructions: {additional_prompt}"

    try:
        response = model.generate_content(prompt)
        question = response.text.strip()

        # Remove unwanted formatting (like markdown or "Question:")
        question = re.sub(r"^(Question:|Q:)\s*", "", question, flags=re.IGNORECASE).strip()
        return question

    except Exception as e:
        return f"Error generating question: {str(e)}"


def evaluate_answer(input_data: EvaluationInput) -> int:
    prompt = f"""You are a strict evaluator. Based on this question: "{input_data.question}" and answer: "{input_data.answer}", evaluate the response on a scale of 0-10. Only return the number."""
    response = model.generate_content(prompt).text
    match = re.search(r'\d+', response)
    if match:
        return int(match.group())
    return 5


def choose_next_question(input_data: QuestionSelectorInput) -> Dict[str, Any]:
    curr_type = input_data.current_difficulty
    score = input_data.eval_score
    count = input_data.question_count

    if curr_type == "easy" and score >= 5:
        new_type = "medium"
    elif curr_type == "medium":
        if score >= 8:
            new_type = "hard"
        elif score < 5:
            new_type = "easy"
        else:
            new_type = "medium"
    elif curr_type == "hard" and score < 7:
        new_type = "medium"
    else:
        new_type = curr_type

    return {
        "new_difficulty": new_type,
        "should_continue": count < 6
    }


def generate_final_report(input_data: ReportGeneratorInput) -> str:
    combined = list(zip(input_data.questions, input_data.answers, input_data.eval_scores))
    prompt = f"""You are highly experienced in evaluation and you have this list: {combined} which contains [question, answer, score]. Generate a performance report in JSON format like:

```json
{{
  "qalist": [
    {{
      "question": "",
      "answer": "",
      "score": 0
    }},
    ...
  ],
  "analysisReport": "",
  "weaknesses": ""
}}
```"""

    return model.generate_content(prompt).text


def extract_json_from_text(text: str) -> Dict[str, Any]:
    match = re.search(r"```json\n([\s\S]*?)```", text, re.MULTILINE)
    if match:
        return json.loads(match.group(1))
    raise ValueError("No JSON block found in response")


# -------- Globals --------
questions = []
answers = []
scores = []
difficulty = "easy"
question_counter = 1
topic = "python"


# -------- API Endpoints --------
@app.route('/api/topic', methods=['POST'])
def set_topic():
    global topic
    data = request.json
    topic = data.get("topic", "python")
    return jsonify({"success": True, "topic": topic})


@app.route('/api/quiz', methods=['GET'])
def start_quiz():
    global questions, answers, scores, difficulty, question_counter

    questions = []
    answers = []
    scores = []
    difficulty = "easy"
    question_counter = 1

    return jsonify({"success": True, "message": "Quiz initialized"})


@app.route('/api/question', methods=['GET'])
def get_question():
    input_data = QuestionGeneratorInput(topic=topic, difficulty=difficulty)

    while True:
        question = Question_generator(input_data)
        if question not in questions:
            break
    questions.append(question)
    return jsonify({"success": True, "question": question})


@app.route('/api/answer', methods=['POST'])
def process_answer():
    global difficulty, question_counter

    data = request.json
    user_answer = data.get("answer", "")
    question = questions[-1]

    input_data = EvaluationInput(answer=user_answer, question=question, difficulty=difficulty)
    score = evaluate_answer(input_data)

    answers.append(user_answer)
    scores.append(score)

    # Select next difficulty
    selector_input = QuestionSelectorInput(
        current_difficulty=difficulty,
        eval_score=score,
        question_count=question_counter
    )
    next_step = choose_next_question(selector_input)

    difficulty = next_step["new_difficulty"]
    question_counter += 1

    if not next_step["should_continue"] or question_counter > 6:
        return jsonify({"success": True, "score": score, "end": True})

    return jsonify({"success": True, "score": score, "end": False})


@app.route('/api/report', methods=['GET'])
def get_report():
    report_input = ReportGeneratorInput(
        questions=questions,
        answers=answers,
        eval_scores=scores
    )
    raw_report = generate_final_report(report_input)
    try:
        report_json = extract_json_from_text(raw_report)
    except ValueError:
        return jsonify({"success": False, "error": "Failed to extract JSON report"}), 500

    return jsonify({"success": True, "report": report_json})


# -------- Start Server --------
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
