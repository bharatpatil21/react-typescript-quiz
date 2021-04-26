import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';

// Conponents
import QuestionCard from "./components/QuestionCard";

// Types
import { QuestionState, Difficulty } from './API';

const TOTAL_QUESTIONS = 10;

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const App = () => {

  const [loadding, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  // console.log(fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY))

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY);

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver) {
      // User Answer
      const answer = e.currentTarget.value;
      // Check answer with correct answer
      const correct = questions[number].correct_answer === answer;
      // Add score if answer correct_answer
      if(correct) setScore(prev => prev + 1);
      //Save anser in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      };
      setUserAnswers(prev => [...prev, answerObject]);
    }
  }

  const nextQuestion = () => {
    // Move on to nect question
    const nextQuestion = number + 1;

    if(nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }

  }

  return (
    <div className="App">
      <h1>React Quiz</h1>
      { gameOver || userAnswers.length === TOTAL_QUESTIONS ?
        (<button className="start" onClick={startTrivia}>Start</button>)
        : null}

      { !gameOver ? <p className="score">Score: {score}</p> : null}
      { loadding && <p>Loading Question ...</p>}
      { !loadding && !gameOver ? (<QuestionCard
        questionNr={number + 1}
        totalQuestion={TOTAL_QUESTIONS}
        question={questions[number].question}
        answers={questions[number].answers}
        userAnswer={userAnswers ? userAnswers[number] : undefined}
        callback={checkAnswer}
      />) : null}

      { !gameOver && !loadding && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
        <button className="next" onClick={nextQuestion}>Next Question</button>
      ) : null}
    </div>
  );
}

export default App;
