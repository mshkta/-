import React, { useState } from "react";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import Card from "../components/ui/card";

const allOptions = [
  "無口", "元気", "ツンデレ", "ヤンデレ", "長身",
  "小柄", "頭脳明晰", "おバカ", "苦労人", "マイペース"
];

function getAllPairs(arr) {
  const pairs = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      pairs.push([arr[i], arr[j]]);
    }
  }
  return pairs;
}

const allPairs = getAllPairs(allOptions);

export default function DiagnosisGame() {
  const [step, setStep] = useState("input");
  const [name, setName] = useState("");
  const [votes, setVotes] = useState({});
  const [pairIndex, setPairIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizStep, setQuizStep] = useState("wait");

  function handleChoice(choice) {
    const newVotes = { ...votes, [choice]: (votes[choice] || 0) + 1 };
    const nextIndex = pairIndex + 1;
    if (nextIndex < allPairs.length) {
      setVotes(newVotes);
      setPairIndex(nextIndex);
    } else {
      const sorted = Object.entries(newVotes).sort((a, b) => b[1] - a[1]);
      const top = sorted[0]?.[0];
      const bottom = sorted[sorted.length - 1]?.[0];
      setResult({ best: top, worst: bottom });
      setStep("result");
    }
  }

  function handleStart() {
    setStep("diagnosis");
  }

  function handleQuizStart() {
    setQuizStep("quiz");
  }

  function checkQuiz(answerBest, answerWorst) {
    const correctBest = answerBest === result.best;
    const correctWorst = answerWorst === result.worst;
    setQuizAnswer({ correctBest, correctWorst });
  }

  return (
    <div style={{ padding: 20 }}>
      {step === "input" && (
        <Card>
          <div>診断者の名前を入力してください：</div>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="名前" />
          <Button onClick={handleStart}>診断スタート</Button>
        </Card>
      )}

      {step === "diagnosis" && pairIndex < allPairs.length && (
        <Card>
          <div>{name}さん、どちらが好き？</div>
          <Button onClick={() => handleChoice(allPairs[pairIndex][0])}>{allPairs[pairIndex][0]}</Button>
          <Button onClick={() => handleChoice(allPairs[pairIndex][1])}>{allPairs[pairIndex][1]}</Button>
        </Card>
      )}

      {step === "result" && result && quizStep === "wait" && (
        <Card>
          <div>診断結果</div>
          <div>ベスト属性：{result.best}</div>
          <div>ワースト属性：{result.worst}</div>
          <Button onClick={handleQuizStart}>この結果をクイズにする</Button>
        </Card>
      )}

      {quizStep === "quiz" && (
        <Card>
          <div>{name}さんのベストとワースト属性を当ててみて！</div>
          <Input placeholder="ベスト属性" id="quiz-best" />
          <Input placeholder="ワースト属性" id="quiz-worst" />
          <Button onClick={() => {
            const best = document.getElementById("quiz-best").value;
            const worst = document.getElementById("quiz-worst").value;
            checkQuiz(best, worst);
          }}>回答する</Button>
        </Card>
      )}

      {quizAnswer && (
        <Card>
          <div>クイズ結果</div>
          <div>ベスト：{quizAnswer.correctBest ? "正解" : "不正解（正解は「" + result.best + "」）"}</div>
          <div>ワースト：{quizAnswer.correctWorst ? "正解" : "不正解（正解は「" + result.worst + "」）"}</div>
        </Card>
      )}
    </div>
  );
}
