import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const allOptions = [
  "真面目優等生", "不真面目危険人物", "俺様ナルシスト", "ヘタレ陰キャ",
  "ツッコミ苦労人", "マイペースなボケ", "猫系美人", "かわいいわんこ系",
  "温厚癒し系", "腹黒毒舌", "クーデレ", "ヤンデレ", "ツンデレ", "ツンツン",
  "年上/上司/先輩", "年下/部下/後輩", "童貞", "ビッチ"
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
    setVotes(prev => {
      const updated = { ...prev, [choice]: (prev[choice] || 0) + 1 };
      const nextIndex = pairIndex + 1;
      if (nextIndex < allPairs.length) {
        setPairIndex(nextIndex);
      } else {
        const sorted = Object.entries(updated).sort((a, b) => b[1] - a[1]);
        const top = sorted[0]?.[0];
        const bottom = sorted[sorted.length - 1]?.[0];
        setResult({ best: top, worst: bottom });
        setStep("result");
      }
      return updated;
    });
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

  const quizURL = typeof window !== "undefined" ? `${window.location.href}?best=${encodeURIComponent(result?.best || '')}&worst=${encodeURIComponent(result?.worst || '')}&name=${encodeURIComponent(name)}` : "";

  return (
    <div className="p-4 space-y-4">
      {step === "input" && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <div>診断者の名前を入力してください：</div>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="名前" />
            <Button onClick={handleStart}>診断スタート</Button>
          </CardContent>
        </Card>
      )}

      {step === "diagnosis" && pairIndex < allPairs.length && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <div>{name}さん、どちらが好き？</div>
            <Button onClick={() => handleChoice(allPairs[pairIndex][0])}>{allPairs[pairIndex][0]}</Button>
            <Button onClick={() => handleChoice(allPairs[pairIndex][1])}>{allPairs[pairIndex][1]}</Button>
          </CardContent>
        </Card>
      )}

      {step === "result" && result && quizStep === "wait" && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <div>診断結果</div>
            <div>ベスト属性：{result.best}</div>
            <div>ワースト属性：{result.worst}</div>
            <div>クイズを共有する場合はこのリンクを送ってください：</div>
            <div className="break-all text-blue-600 underline">{quizURL}</div>
            <Button onClick={handleQuizStart}>この結果をクイズにする</Button>
          </CardContent>
        </Card>
      )}

      {quizStep === "quiz" && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <div>{name}さんのベストとワースト属性を当ててみて！</div>
<select id="quiz-best" className="border p-2 rounded w-full">
  <option value="">選んでください</option>
  {allOptions.map(opt => (
    <option key={opt} value={opt}>{opt}</option>
  ))}
</select>

<select id="quiz-worst" className="border p-2 rounded w-full">
  <option value="">選んでください</option>
  {allOptions.map(opt => (
    <option key={opt} value={opt}>{opt}</option>
  ))}
</select>

            <Button onClick={() => {
              const best = document.getElementById("quiz-best").value;
              const worst = document.getElementById("quiz-worst").value;
              checkQuiz(best, worst);
            }}>回答する</Button>
          </CardContent>
        </Card>
      )}

      {quizAnswer && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <div>クイズ結果</div>
            <div>ベスト：{quizAnswer.correctBest ? "正解" : "不正解（正解は「" + result.best + "」）"}</div>
            <div>ワースト：{quizAnswer.correctWorst ? "正解" : "不正解（正解は「" + result.worst + "」）"}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
