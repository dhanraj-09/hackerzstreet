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
  const router = useRouter();
  
  const question = "What are the potential implications of artificial intelligence on human creativity and artistic expression?";

  useEffect(() => {
    const element = document.documentElement;
    let fullscreenInterval;

    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await element.requestFullscreen({ navigationUI: 'hide' });
        }
      } catch (err) {
        console.error('Error attempting to enable full-screen mode:', err);
      }
    };

    const enforceFullscreen = () => {
      if (!document.fullscreenElement) {
        enterFullscreen();
      }
    };

    // Initial setup
    enterFullscreen();
    fullscreenInterval = setInterval(enforceFullscreen, 100);

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        enterFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      clearInterval(fullscreenInterval);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  const handleGiveUp = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      router.push('/results');
    } catch (err) {
      console.error('Error exiting fullscreen:', err);
      router.push('/results');
    }
  };

  const handleSkip = () => {
    setAnswer('');
  };

  const handleNext = () => {
    setAnswer('');
  };

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
          <NextButton onClick={handleNext}>Next</NextButton>
        </ButtonContainer>
      </QuestionCard>
    </FullScreenContainer>
  );
}
