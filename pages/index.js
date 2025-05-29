"use client";

import React, { useState, useEffect } from "react";

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

export default function Home() {
  const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const isQuiz = urlParams?.get("quiz") === "1";
  const quizName = urlParams?.get("name") || "";
  const quizBest = urlParams?.get("best") || "";
  const quizWorst = urlParams?.get("worst") || "";

  const [step, setStep] = useState(isQuiz ? "quiz" : "input");
  const [name, setName] = useState("");
  const [votes, setVotes] = useState({});
  const [pairIndex, setPairIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const allPairs = getAllPairs(allOptions);

  function handleChoice(choice) {
    const updated = { ...votes, [choice]: (votes[choice] || 0) + 1 };
    if (pairIndex + 1 < allPairs.length) {
      setVotes(updated);
      setPairIndex(pairIndex + 1);
    } else {
      const sorted = Object.entries(updated).sort((a, b) => b[1] - a[1]);
      const top = sorted[0][0];
      const bottom = sorted[sorted.length - 1][0];
      setResult({ best: top, worst: bottom, ranking: sorted });
      setStep("result");
    }
  }

  function handleShare() {
    const quizURL = `${window.location.origin}?quiz=1&name=${encodeURIComponent(name)}&best=${encodeURIComponent(result.best)}&worst=${encodeURIComponent(result.worst)}`;
    navigator.clipboard.writeText(quizURL);
    alert("リンクをコピーしました！");
  }

  return (
    <main className="p-6 space-y-6">
      {step === "input" && (
        <div>
          <h2 className="text-xl font-bold">診断をはじめよう！</h2>
          <input
            type="text"
            className="border p-2 mt-2"
            placeholder="名前を入力"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="block mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setStep("quizStart")}
          >
            スタート！
          </button>
        </div>
      )}

      {step === "quizStart" && pairIndex < allPairs.length && (
        <div>
          <h2 className="text-lg mb-4">{name}さん、どちらが好き？</h2>
          <div className="grid grid-cols-2 gap-4">
            {allPairs[pairIndex].map((opt) => (
              <button
                key={opt}
                onClick={() => handleChoice(opt)}
                className="w-full bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "result" && result && (
        <div>
          <h2 className="text-lg font-bold mb-2">診断結果</h2>
          <div>ベスト属性：<strong>{result.best}</strong></div>
          <div>ワースト属性：<strong>{result.worst}</strong></div>
          <div className="mt-4">
            <h3 className="font-semibold">ランキング：</h3>
            <ol className="list-decimal pl-6">
              {result.ranking.map(([key, count]) => (
                <li key={key}>{key}（{count}票）</li>
              ))}
            </ol>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setStep("quiz")}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              クイズにする
            </button>
          </div>
          <div className="mt-4">
            <p>クイズを共有するには以下のリンクを使ってね：</p>
            <code className="block bg-gray-100 p-2 rounded mt-1 text-sm">{`${window.location.origin}?quiz=1&name=${encodeURIComponent(name)}&best=${encodeURIComponent(result.best)}&worst=${encodeURIComponent(result.worst)}`}</code>
            <button
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
              onClick={handleShare}
            >
              リンクをコピー
            </button>
          </div>
        </div>
      )}

      {step === "quiz" && (
        <div>
          <h2 className="text-lg font-bold">{quizName || name}さんのベストとワースト属性を当ててみて！</h2>
          <select id="best" className="block mt-2 border p-1">
            {allOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <select id="worst" className="block mt-2 border p-1">
            {allOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              const best = document.getElementById("best").value;
              const worst = document.getElementById("worst").value;
              setQuizAnswer({
                bestCorrect: best === quizBest,
                worstCorrect: worst === quizWorst
              });
            }}
          >
            回答する
          </button>
        </div>
      )}

      {quizAnswer && (
        <div className="mt-6">
          <h3 className="font-bold">クイズ結果</h3>
          <p>ベスト属性：{quizAnswer.bestCorrect ? "正解！" : `不正解（正解は ${quizBest}）`}</p>
          <p>ワースト属性：{quizAnswer.worstCorrect ? "正解！" : `不正解（正解は ${quizWorst}）`}</p>
        </div>
      )}
    </main>
  );
}
