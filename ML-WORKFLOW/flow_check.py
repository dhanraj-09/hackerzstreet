# Fixed version - correctly handling LangGraph message objects

from typing import Annotated, Dict, List, Any, Union
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_core.messages import HumanMessage, AIMessage,SystemMessage

from pydantic import BaseModel, Field
import re

# Keep your original model definitions
class QuestionGeneratorInput(BaseModel):
    language: str = Field(description="Programming language for the question")
    field: str = Field(description="Technical field for the question")
    dsa: str = Field(description="Data structure or algorithm focus")
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
    answers: List[str] = Field(description="List of all user answers")
    eval_scores: List[int] = Field(description="List of evaluation scores")
    difficulty_counts: Dict[str, int] = Field(description="Count of questions by difficulty")

# Keep your original utility functions
def question_generator(input_data: QuestionGeneratorInput) -> str:
    """Generate a question based on language, field, DSA concept and difficulty level."""
    prompt = f"You are a teacher with expertise in {input_data.language}, {input_data.field}, and {input_data.dsa}. Ask a {input_data.difficulty} level question."
    # For testing without an actual LLM, just return a sample question
    # In a real implementation, you would use: return llm.invoke(prompt).content
    return f"Here's a {input_data.difficulty} level question about {input_data.dsa} in {input_data.language}: How would you implement a binary search tree?"

def evaluate_answer(input_data: EvaluationInput) -> int:
    """Evaluate the answer based on the given question."""
    prompt = f"""You are evaluating this {input_data.difficulty} level answer on a scale of 0-10.
    Question: {input_data.question}
    Answer: {input_data.answer}
    Provide a score between 0 and 10."""
    # For testing without an actual LLM
    # In a real implementation, you would use: score = llm.invoke(prompt)
    # and then extract the number using regex
    # For now, just return a sample score
    return 7

def choose_next_question(input_data: QuestionSelectorInput) -> Dict[str, Any]:
    """Choose the next question difficulty based on performance."""
    curr_type = input_data.current_difficulty
    eval_score = input_data.eval_score
    question_count = input_data.question_count
    
    if curr_type == "easy" and eval_score >= 5:
        new_type = "medium"
    elif curr_type == "medium":
        if eval_score >= 8:
            new_type = "hard"
        elif eval_score < 5:
            new_type = "easy"
        else:
            new_type = "medium"
    elif curr_type == "hard" and eval_score < 7:
        new_type = "medium"
    else:
        new_type = curr_type

    should_continue = question_count < 15
    
    return {
        "new_difficulty": new_type,
        "should_continue": should_continue
    }

def generate_final_report(input_data: ReportGeneratorInput) -> str:
    """Generate a final report of the user's performance."""
    prompt = f"""Based on these answers and scores, write a short evaluation:
    - Number of easy questions answered: {input_data.difficulty_counts.get('easy', 0)}
    - Number of medium questions answered: {input_data.difficulty_counts.get('medium', 0)}
    - Number of hard questions answered: {input_data.difficulty_counts.get('hard', 0)}
    - Average score: {sum(input_data.eval_scores) / len(input_data.eval_scores) if input_data.eval_scores else 0}
    """
    # For testing without an actual LLM
    return f"You answered {len(input_data.answers)} questions with an average score of {sum(input_data.eval_scores) / len(input_data.eval_scores) if input_data.eval_scores else 0}."

# Define the state properly
class QuizState(TypedDict):
    messages: Annotated[List[Union[SystemMessage, HumanMessage, AIMessage]], add_messages]
    current_question: str
    difficulty: str
    question_count: int
    current_score: int
    eval_scores: List[int]
    difficulty_counts: Dict[str, int]
    answers: List[str]
    should_continue: bool

# Now let's define the node functions that handle the LangGraph message format
def question_generator_node(state: QuizState) -> QuizState:
    # Extract information from state or use defaults
    language = "Python"  # Default or extract from initial messages
    field = "Software Engineering"
    dsa = "Data Structures"
    difficulty = state.get("difficulty", "easy")
    
    # Create input data
    input_data = QuestionGeneratorInput(
        language=language,
        field=field,
        dsa=dsa,
        difficulty=difficulty
    )
    
    # Generate the question
    question = question_generator(input_data)
    
    # Update state with the generated question
    new_state = state.copy()
    new_state["messages"] = list(state["messages"]) + [AIMessage(content=question)]
    new_state["current_question"] = question
    new_state["difficulty"] = difficulty
    
    # Initialize or update question count
    if "question_count" not in new_state:
        new_state["question_count"] = 1
    else:
        new_state["question_count"] += 1
    
    # Initialize other fields if needed
    if "eval_scores" not in new_state:
        new_state["eval_scores"] = []
    if "difficulty_counts" not in new_state:
        new_state["difficulty_counts"] = {"easy": 0, "medium": 0, "hard": 0}
    if "answers" not in new_state:
        new_state["answers"] = []
    
    return new_state

def evaluate_answer_node(state: QuizState) -> QuizState:
    # Extract the last user message if available
    user_messages = [m for m in state["messages"] if isinstance(m, HumanMessage)]
    
    if not user_messages:
        # No user response yet, return state unchanged
        return state
    
    # Get the latest user answer
    answer = user_messages[-1].content
    
    # Get the current question and difficulty
    question = state.get("current_question", "")
    difficulty = state.get("difficulty", "easy")
    
    # Create input for evaluation
    input_data = EvaluationInput(
        answer=answer,
        question=question,
        difficulty=difficulty
    )
    
    # Get evaluation score
    score = evaluate_answer(input_data)
    
    # Create updated state
    new_state = state.copy()
    
    # Store the answer
    new_state["answers"] = list(state.get("answers", [])) + [answer]
    
    # Update scores
    new_state["eval_scores"] = list(state.get("eval_scores", [])) + [score]
    new_state["current_score"] = score
    
    # Add evaluation message
    new_state["messages"] = list(state["messages"]) + [
        AIMessage(content=f"Your answer scored {score}/10")
    ]
    
    return new_state

def choose_next_question_node(state: QuizState) -> QuizState:
    # Extract current state values
    current_difficulty = state.get("difficulty", "easy")
    eval_score = state.get("current_score", 5)
    question_count = state.get("question_count", 1)
    
    # Create input for selecting next question
    input_data = QuestionSelectorInput(
        current_difficulty=current_difficulty,
        eval_score=eval_score,
        question_count=question_count
    )
    
    # Determine next question parameters
    result = choose_next_question(input_data)
    
    # Create updated state
    new_state = state.copy()
    new_state["difficulty"] = result["new_difficulty"]
    new_state["should_continue"] = result["should_continue"]
    
    # Update difficulty count
    difficulty_counts = state.get("difficulty_counts", {"easy": 0, "medium": 0, "hard": 0}).copy()
    difficulty_counts[current_difficulty] = difficulty_counts.get(current_difficulty, 0) + 1
    new_state["difficulty_counts"] = difficulty_counts
    
    return new_state

def generate_final_report_node(state: QuizState) -> QuizState:
    # Extract data for report
    eval_scores = state.get("eval_scores", [])
    difficulty_counts = state.get("difficulty_counts", {"easy": 0, "medium": 0, "hard": 0})
    answers = state.get("answers", [])
    
    # Create input for report generation
    input_data = ReportGeneratorInput(
        answers=answers,
        eval_scores=eval_scores,
        difficulty_counts=difficulty_counts
    )
    
    # Generate the report
    report = generate_final_report(input_data)
    
    # Create updated state
    new_state = state.copy()
    new_state["messages"] = list(state["messages"]) + [
        AIMessage(content=f"## Final Report\n\n{report}")
    ]
    
    return new_state

def end_quiz_condition(state: QuizState) -> str:
    question_count = state.get("question_count", 0)
    should_continue = state.get("should_continue", True)
    
    if not should_continue or question_count >= 15:
        return "create_report"
    else:
        return "next_question"

# Create the graph
def create_quiz_graph():
    # Define the state structure
    graph = StateGraph(QuizState)
    
    # Add nodes
    graph.add_node("question_generator", question_generator_node)
    graph.add_node("evaluate_answer", evaluate_answer_node)
    graph.add_node("choose_next_question", choose_next_question_node)
    graph.add_node("generate_final_report", generate_final_report_node)
    
    # Add edges
    graph.add_edge(START, "question_generator")
    graph.add_edge("question_generator", "evaluate_answer")
    graph.add_edge("evaluate_answer", "choose_next_question")
    
    # Add conditional edges
    graph.add_conditional_edges(
        "choose_next_question",
        end_quiz_condition,
        {
            "next_question": "question_generator",
            "create_report": "generate_final_report"
        }
    )
    
    graph.add_edge("generate_final_report", END)
    
    return graph.compile()

# Create the compiled graph
quiz_graph = create_quiz_graph()

# Example of how to use the graph
def run_quiz():
    # Initial state with a system message and user query
    initial_state = {
        "messages": [
            SystemMessage(content="You are an adaptive quiz agent for programming concepts."),
            HumanMessage(content="I'd like to practice Python data structures questions.")
        ],
        "difficulty": "easy",
        "question_count": 0,
        "current_score": 0,
        "eval_scores": [],
        "difficulty_counts": {"easy": 0, "medium": 0, "hard": 0},
        "answers": [],
        "should_continue": True
    }
    
    # Start the conversation with the initial question
    state = quiz_graph.invoke(initial_state)
    
    # This would typically be part of an interactive loop
    print("First question generated:")
    print(state["messages"][-1].content)
    
    # In a real application, you would:
    # 1. Get user's answer
    # 2. Add it to state["messages"]
    # 3. Continue the graph execution
    
    return state

# Run this to see the quiz in action
result = run_quiz()