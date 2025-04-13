'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';

const FullScreenContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
`;

const QuestionCard = styled.div`
  background-color: #1e293b;
  border-radius: 1rem;
  padding: 2.5rem;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Header = styled.div`
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const QuestionText = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: white;
  font-weight: 600;
  line-height: 1.4;
`;

const AnswerContainer = styled.div`
  background-color: #2c3e50;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const AnswerTextarea = styled.textarea`
  width: 100%;
  min-height: 150px;
  background-color: #1e293b;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  color: white;
  padding: 1rem;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  
  &:hover {
    transform: translateY(-2px);
    filter: brightness(110%);
  }
`;

const GiveUpButton = styled(Button)`
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
`;

const SkipButton = styled(Button)`
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.2);
`;

const NextButton = styled(Button)`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
`;

export default function PotentialTest() {
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [questionCount, setQuestionCount] = useState(0);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Initialize quiz and fetch first question
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setError('');
        // Initialize the quiz
        const initResponse = await fetch('http://192.168.131.108:5000/api/quiz', {
          method: 'GET',
        });

        if (!initResponse.ok) {
          throw new Error('Failed to initialize quiz');
        }

        // Get the first question
        const response = await fetch('http://192.168.131.108:5000/api/question', {
          method: 'GET',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch question');
        }

        const data = await response.json();
        if (data.success) {
          setQuestion(data.question);
          setQuestionCount(1);
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Error initializing quiz:', error);
        setError('Failed to start quiz. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeQuiz();
  }, []);

  // Handle submitting answer and getting next question
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;

    try {
      setError('');
      // Submit the answer
      const response = await fetch('http://192.168.131.108:5000/api/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const data = await response.json();

      // If there are more questions, get the next one
      if (!data.end) {
        const nextQuestionResponse = await fetch('http://192.168.131.108:5000/api/question', {
          method: 'GET',
        });

        if (!nextQuestionResponse.ok) {
          throw new Error('Failed to fetch next question');
        }

        const nextQuestionData = await nextQuestionResponse.json();
        if (nextQuestionData.success) {
          setQuestion(nextQuestionData.question);
          setAnswer('');
          setQuestionCount(prev => prev + 1);
        } else {
          throw new Error('Invalid response from server');
        }
      } else {
        // Quiz is complete, redirect to report
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        router.push('/report');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to submit answer. Please try again.');
    }
  };

  const handleSkip = async () => {
    try {
      setError('');
      // Submit empty answer to maintain question count
      const skipResponse = await fetch('http://192.168.131.108:5000/api/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer: "" }),
      });

      if (!skipResponse.ok) {
        throw new Error('Failed to skip question');
      }

      // Get next question
      const response = await fetch('http://192.168.131.108:5000/api/question', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch next question');
      }

      const data = await response.json();
      if (data.success) {
        setQuestion(data.question);
        setAnswer('');
        setQuestionCount(prev => prev + 1);
      } else {
        throw new Error('Invalid response from server');
      }

      // Check if we should redirect to report
      if (questionCount >= 5) {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        router.push('/report');
      }
    } catch (error) {
      console.error('Error skipping question:', error);
      setError('Failed to skip question. Please try again.');
    }
  };

  const handleGiveUp = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      router.push('/report');
    } catch (err) {
      console.error('Error giving up:', err);
      router.push('/report');
    }
  };

  if (isLoading) {
    return (
      <FullScreenContainer>
        <QuestionCard>
          <Header>
            <QuestionText>Loading...</QuestionText>
          </Header>
        </QuestionCard>
      </FullScreenContainer>
    );
  }

  if (error) {
    return (
      <FullScreenContainer>
        <QuestionCard>
          <Header>
            <QuestionText>Error</QuestionText>
          </Header>
          <AnswerContainer>
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </AnswerContainer>
        </QuestionCard>
      </FullScreenContainer>
    );
  }

  return (
    <FullScreenContainer>
      <QuestionCard>
        <Header>
          <QuestionText>Subjective Assessment</QuestionText>
        </Header>
        <AnswerContainer>
          <QuestionText>{question}</QuestionText>
          <AnswerTextarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
          />
        </AnswerContainer>
        <ButtonContainer>
          <GiveUpButton onClick={handleGiveUp}>Give Up</GiveUpButton>
          <SkipButton onClick={handleSkip}>Skip</SkipButton>
          <NextButton onClick={handleSubmitAnswer}>Next</NextButton>
        </ButtonContainer>
      </QuestionCard>
    </FullScreenContainer>
  );
}
