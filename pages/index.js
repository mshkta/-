import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";

const allOptions = [
  "性転換", "未亡人", "兄弟姦", "親子丼", "３P",
  "スカ", "オホ声", "体調不良", "無理矢理", "睡眠姦"
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

  // クエリからクイズ情報を読み込む処理
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("quiz") === "1") {
      const best = params.get("best");
      const worst = params.get("worst");
      const name = params.get("name");
      if (best && worst && name) {
        setResult({ best, worst, ranking: [] });
        setName(name);
        setQuizStep("quiz");
        setStep("result");
      }
    }
  }, []);

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
        setResult({ best: top, worst: bottom, ranking: sorted });
        setStep("result");
      }
      return updated;
    });
  }

  function handleStart() {
    setStep("diagnosis");
  }

  // クイズ用URLの生成
  const quizUrl = result ? `${window.location.origin}${window.location.pathname}?quiz=1&name=${encodeURIComponent(name)}&best=${encodeURIComponent(result.best)}&worst=${encodeURIComponent(result.worst)}` : "";

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
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => handleChoice(allPairs[pairIndex][0])}>{allPairs[pairIndex][0]}</Button>
              <Button className="flex-1" onClick={() => handleChoice(allPairs[pairIndex][1])}>{allPairs[pairIndex][1]}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "result" && result && quizStep === "wait" && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <div>診断結果</div>
            <div><strong>ベスト属性：</strong>{result.best}</div>
            <div><strong>ワースト属性：</strong>{result.worst}</div>
            <hr />
            <div>ランキング：</div>
            <ol className="list-decimal pl-6">
              {result.ranking.map(([key, count]) => (
                <li key={key}>{key}（{count}票）</li>
              ))}
            </ol>
            <div className="pt-4">
              <div>クイズを共有する場合はこのリンクを使ってね：</div>
              <code>{quizUrl}</code>
              <Button onClick={() => navigator.clipboard.writeText(quizUrl)}>リンクをコピー</Button>
              <Button onClick={() => setQuizStep("quiz")}>クイズにする</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {quizStep === "quiz" && result && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <div>{name}さんのベストとワースト属性を当ててみて！</div>
            <select id="quiz-best">
              {allOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
            <select id="quiz-worst">
              {allOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
            <Button onClick={() => {
              const best = document.getElementById("quiz-best").value;
              const worst = document.getElementById("quiz-worst").value;
              const correctBest = best === result.best;
              const correctWorst = worst === result.worst;
              setQuizAnswer({ correctBest, correctWorst });
            }}>回答する</Button>
          </CardContent>
        </Card>
      )}

      {quizAnswer && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <div>クイズ結果</div>
            <div>ベスト：{quizAnswer.correctBest ? "正解" : `不正解（正解は「${result.best}」）`}</div>
            <div>ワースト：{quizAnswer.correctWorst ? "正解" : `不正解（正解は「${result.worst}」）`}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
