# # %%
# from typing import Dict, List, Any
# from langchain.agents import AgentExecutor, create_openai_tools_agent
# from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
# from langchain.tools import BaseTool
# from langchain_core.tools import Tool
# import re
# import json

# from langchain_core.chat_history import BaseChatMessageHistory
# from langchain_core.runnables.history import RunnableWithMessageHistory
# from langchain.memory import ChatMessageHistory
# from langchain_ollama import ChatOllama
# from pydantic import BaseModel, Field
# import re
# from flask import Flask, request, jsonify
# from flask_cors import CORS

# app = Flask(__name__)

# CORS(app)


# # %%
# import google.generativeai as genai 

# genai.configure(api_key="AIzaSyDrPY-M6t2BUQ32WIoKOpxfd2izJkxaJPk")

# model = genai.GenerativeModel(model_name="gemini-2.0-flash")  
# response = model.generate_content("Tell me a joke about AI.")

# # print(response.text)


# # %%
# llm = ChatOllama(model="llama3.2:1b", temperature=0.5)

# # %%
# class QuestionGeneratorInput(BaseModel):
#     topic: str = Field(description="Topic for the question")
#     difficulty: str = Field(description="Difficulty level: easy, medium, or hard")

# # %%
# class EvaluationInput(BaseModel):
#     answer: str = Field(description="User's answer to evaluate")
#     question: str = Field(description="The question that was asked")
#     difficulty: str = Field(description="Difficulty level of the question")

# # %%
# class QuestionSelectorInput(BaseModel):
#     current_difficulty: str = Field(description="Current difficulty level")
#     eval_score: int = Field(description="Current evaluation score")
#     question_count: int = Field(description="Number of questions asked so far")

# # %%
# class ReportGeneratorInput(BaseModel):
#     questions : List[str] = Field(description="List of all user answers")
    
#     answers: List[str] = Field(description="List of all user answers")
    
#     eval_scores: List[int] = Field(description="List of evaluation scores")

# # %%
# def Question_generator(input_data: QuestionGeneratorInput,additional_prompt = "") -> str:
#     """Generate a question based on the topic and difficulty level."""
#     prompt = f"You are a teacher with expertise in {input_data.topic}. Ask a strictly theoretical and short {input_data.difficulty} level question." + additional_prompt
#     return model.generate_content(prompt).text

# # %%
# def evaluate_answer(input_data: EvaluationInput) -> Dict[str, Any]:
# 	"""you are a highly educated expert and your job is to perform strict evaluation of the answer based on the given question"""
# 	# Simple evaluation logic - can be made more sophisticated
# 	prompt = f"""you are a highly educated expert and your job is to perform strict evaluation of the answer based on the given question"{input_data.question}" 
# 	And the answer: "{input_data.answer}"
# 	Evaluate this {input_data.difficulty} level answer on a scale of 0-10.
# 	make sure to respond with a number between 0 and 10."""
# 	score = model.generate_content(prompt).text
# 	try:
# 		match = re.search(r'\d+', score.content)
# 		if match:
# 				return int(match.group())
# 	except:
# 		return 5

# # %%
# def evaluate_answer(input_data: EvaluationInput) -> Dict[str, Any]:
# 	"""you are a highly educated expert and your job is to perform strict evaluation of the answer based on the given question"""
# 	# Simple evaluation logic - can be made more sophisticated
# 	prompt = f"""you are a highly educated expert and your job is to perform strict evaluation of the answer based on the given question"{input_data.question}" 
# 	And the answer: "{input_data.answer}"
# 	Evaluate this {input_data.difficulty} level answer on a scale of 0-10.
# 	make sure to respond with a number between 0 and 10."""
# 	score = model.generate_content(prompt).text
# 	# try:
# 	# 	match = re.search(r'\d+', score.content)
# 	# 	if match:
# 	# 			return int(match.group())
# 	# except:
# 	# 	return 5
# 	return score

# # %%
# # # input_da = EvaluationInput(
# # #     answer = "continuous collection of items in an index based array, a list in python can have multiple data types",
# # #     question = "what is list in python",
# # #     difficulty= "easy"
    
# # )

# # %%
# # print(evaluate_answer(input_da))

# # %%
# def choose_next_question(input_data: QuestionSelectorInput) -> Dict[str, Any]:
#     """Choose the next question difficulty based on performance."""
#     curr_type = input_data.current_difficulty
#     eval_score = input_data.eval_score
#     question_count = input_data.question_count
    
#     if curr_type == "easy" and eval_score >= 5:
#         new_type = "medium"
#     elif curr_type == "medium":
#         if eval_score >= 8:
#             new_type = "hard"
#         elif eval_score < 5:
#             new_type = "easy"
#         else:
#             new_type = "medium"
#     elif curr_type == "hard" and eval_score < 7:
#         new_type = "medium"
#     else:
#         new_type = curr_type

#     should_continue = question_count < 6
    
#     return {
#         "new_difficulty": new_type,
#         "should_continue": should_continue
#     }

# # %%
# # def generate_final_report(input_data: ReportGeneratorInput) -> str:
# #     """Generate a final report of the user's performance."""
# #     prompt = f"""Based on these answers and scores, write a short evaluation highlighting strengths, weaknesses, and areas for improvement:
# #     - Average score: {sum(input_data.eval_scores) / len(input_data.eval_scores) if input_data.eval_scores else 0}
# #     """
# #     return model.generate_content(prompt).text

# # %%
# def generate_final_report(input_data : ReportGeneratorInput) -> str:
# 	"""Generate a final report of the user's performance."""
# 	zipped_lists = zip(input_data.questions, input_data.answers, input_data.eval_scores) 
# 	new_lists = [list(group) for group in zipped_lists]
# 	prompt = f"You are highly experienced in evaluation and you have this list : {new_lists} which contains list of [questions,answers,score], you have to create a short report evaluating the student's skills and in . give response in this json format : " + '''
# {
#   "qalist": [
#     {
#       "question": "",
#       "answer": "",
#       "score": 
#     },
#   ],
#   "analysisReport": "",
#   "weaknesses": "Historical Dates"
# }

# '''
# 	return model.generate_content(prompt).text
           

# # %%
# def generate_final_report(input_data : ReportGeneratorInput) -> str:
# 	"""Generate a final report of the user's performance."""
# 	zipped_lists = zip(input_data.questions, input_data.answers, input_data.eval_scores) 
# 	new_lists = [list(group) for group in zipped_lists]
# 	prompt = f"You are highly experienced in evaluation and you have this list : {new_lists} which contains list of [questions,answers,score], you have to create a short report evaluating the student's skills and in . give response in this list format : " + '''
# {
#   "qalist": [
#     {
#       "question": "",
#       "answer": "",
#       "score": 
#     },
#   ],
#   "analysisReport": "",
#   "weaknesses": "Historical Dates"
# }

# '''
# 	return model.generate_content(prompt).text

# # %%
# # print(QuestionGeneratorInput.model_fields.keys())

# def extract_json_from_text(final_text):
#     pattern = r"```json\n([\s\S]*?)```"
#     match = re.search(pattern, final_text, re.MULTILINE)
#     if match:
#         return json.loads(match.group(1))
#     else:
#         raise ValueError("No JSON block found")
# # %%
# questions = []
# answers = []
# scores = []

# difficulty = "easy"
# flag = 1


# @app.route('/api/topic',methods = ['POST'])
# def get_topic():
#      data = request.json
#      user_topic = data.get("topic","python")
#      return user_topic


# topic = get_topic
# if topic:
#      pass
# else:
#      topic = "python"

# @app.route('/api/quiz',methods = ['POST'])
# def get_topic2():
#      data = request.json
#      user_topic = data.get("topic")
#      return user_topic
# topic2 = get_topic2   


# def quiz(topic2):
#     while True:
#         input_data_q = QuestionGeneratorInput(
#         topic = topic2,
#         difficulty = difficulty        
#         )

#         while True:
#             question = Question_generator(input_data_q)
#             if question not in questions:
#                 break
#             else:
#                 question = Question_generator(input_data_q,additional_prompt="Generate a new and different question")

#         userMessage = input(f"answer the following : {question}")

#         input_data_e=EvaluationInput(
#                         answer=userMessage,
#                         question=question,
#                         difficulty=difficulty
#                     )
        
#         score = int(evaluate_answer(input_data_e))
#         questions.append(question)
#         answers.append(userMessage)
#         scores.append(score)

#         input_data_qs = QuestionSelectorInput(
#             current_difficulty= difficulty,
#             eval_score=score,
#             question_count=flag
#         )

#         new_difficulty,should_continue = choose_next_question(input_data_qs)

#         if not should_continue or flag>4:
#             input_data_r = ReportGeneratorInput(
#                 questions=questions,
#                 answers=answers,
#                 eval_scores=scores
#             )
#             report = generate_final_report(input_data_r)
#             break
#         else:
#             difficulty = new_difficulty
#             flag +=1

#     return extract_json_from_text(report)

# if __name__ == "__main__":

#     app.run(debug=True,host = '0.0.0.0', port = 5000)


    
    
    




# # @app.route('/api/question',methods = ['POST'])
# # def question_quiz():
# #     data = request.json
# #     user_topic = data.get("topic","python")

# #     input_data_q = QuestionGeneratorInput(
# #     topic = user_topic,
# #     difficulty = difficulty        
# #     )

# #     while True:
# #         question = Question_generator(input_data_q)
# #         if question not in questions:
# #             break
# #         else:
# #             question = Question_generator(input_data_q,additional_prompt="Generate a new and different question")
# #     return jsonify({
# #             "success" : True,
# #             "question" : question
# #     })

# # @app.route('/api/answer',methods = ['POST'])
# # def answer_quiz(question):
# #     data = request.json

# #     userMessage = data.get("answer","i dont know")


# #     input_data_e=EvaluationInput(
# #                     answer=userMessage,
# #                     question=question,
# #                     difficulty=difficulty
# #                 )

# #     score = int(evaluate_answer(input_data_e))
# #     questions.append(question)
# #     answers.append(userMessage)
# #     scores.append(score)

# #     input_data_qs = QuestionSelectorInput(
# #         current_difficulty= difficulty,
# #         eval_score=score,
# #         question_count=flag
# #     )

# #     new_difficulty,should_continue = choose_next_question(input_data_qs)

# #     if not should_continue or flag>3:
# #         input_data_r = ReportGeneratorInput(
# #             questions=questions,
# #             answers=answers,
# #             eval_scores=scores
# #         )
# #         report = generate_final_report(input_data_r)
# #     else:
# #         difficulty = new_difficulty
# #         flag +=1






    
    

# # # %%
# # print(report)

# # # %%

# # import re
# # import json

# # def extract_json_from_text(final_text):
# #     pattern = r"```json\n([\s\S]*?)```"
# #     match = re.search(pattern, final_text, re.MULTILINE)
# #     if match:
# #         return json.loads(match.group(1))
# #     else:
# #         raise ValueError("No JSON block found")


# # # %%
# # extract_json_from_text(report)

# # # %%



