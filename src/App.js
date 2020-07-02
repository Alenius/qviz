import React, { useState, useEffect } from "react";
import "./App.css";

const getQuestions = async () => {
  const res = await fetch("http://lvh.me:4000/questions?id=3");
  const json = await res.json();
  const questions = json.questions;
  console.log({ questions });
  return questions;
};

function App() {
  const [questions, setQuestions] = useState(["question 1", "question 2"]);

  useEffect(() => {
    const getQuestionsAsync = async () => {
      const fetchedQuestions = await getQuestions();
      console.log({ fetchedQuestions });
      setQuestions(fetchedQuestions[0].questions);
    };
    getQuestionsAsync();
  }, []);
  return (
    <div className="App">
      <div>{questions.map((it) => it)}</div>
    </div>
  );
}

export default App;
