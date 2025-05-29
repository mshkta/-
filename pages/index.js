import React, { useState } from "react";

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

export default function Home() {
  const [step, setStep] = useState("input");
  const [name, setName] = useState("");
  const [votes, setVotes] = useState({});
  const [pairIndex, setPairIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizStep, setQuizStep] = useState("wait");

  function handleChoice(choice) {
    const newVotes = { ...votes, [choice]: (votes[choice] || 0) + 1 };
    setVotes(newVotes);
    const nextIndex = pairIndex + 1;
    if (nextIndex < allPairs.length) {
      setPairIndex(nextIndex);
    } else {
      const sorted = Object.entries(newVotes).sort((a, b) => b[1] - a[1]);
      const top = sorted[0]?.[0];
      const bottom = sorted[sorted.length - 1]?.[0];
      setResult({ best: top, worst: bottom });
      setStep("result");
    }
  }

  function checkQuiz(answerBest, answerWorst) {
    const correctBest = answerBest === result.best;
    const correctWorst = answerWorst === result.worst;
    setQuizAnswer({ correctBest, correctWorst });
  }

  return (
    <div style={{ padding: "20px" }}>
      {step === "input" && (
        <div>
          <p>診断者の名前を入力してください：</p>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="名前" />
          <button onClick={() => setStep("diagnosis")}>診断スタート</button>
        </div>
      )}

      {step === "diagnosis" && pairIndex < allPairs.length && (
        <div>
          <p>{name}さん、どちらが好き？</p>
          <button onClick={() => handleChoice(allPairs[pairIndex][0])}>{allPairs[pairIndex][0]}</button>
          <button onClick={() => handleChoice(allPairs[pairIndex][1])}>{allPairs[pairIndex][1]}</button>
        </div>
      )}

      {step === "result" && result && quizStep === "wait" && (
        <div>
          <h2>診断結果</h2>
          <p>ベスト属性：{result.best}</p>
          <p>ワースト属性：{result.worst}</p>
          <button onClick={() => setQuizStep("quiz")}>この結果をクイズにする</button>
        </div>
      )}

      {quizStep === "quiz" && (
        <div>
          <p>{name}さんのベストとワースト属性を当ててみて！</p>
          <input placeholder="ベスト属性" id="quiz-best" />
          <input placeholder="ワースト属性" id="quiz-worst" />
          <button onClick={() => {
            const best = document.getElementById("quiz-best").value;
            const worst = document.getElementById("quiz-worst").value;
            checkQuiz(best, worst);
          }}>回答する</button>
        </div>
      )}

      {quizAnswer && (
        <div>
          <h3>クイズ結果</h3>
          <p>ベスト：{quizAnswer.correctBest ? "正解" : `不正解（正解は「${result.best}」）`}</p>
          <p>ワースト：{quizAnswer.correctWorst ? "正解" : `不正解（正解は「${result.worst}」）`}</p>
        </div>
      )}
    </div>
  );
}