import { useEffect, useMemo, useState } from "react";
import { levels } from "../levels/levels";

type Props = {
  levelId: number;
  bestScore: number | null;
  onClear: (levelId: number, score: number) => void;
  onBack: () => void;
};

type CompileResult =
  | { ok: true; regex: RegExp }
  | { ok: false; error: string };

function compilePattern(pattern: string): CompileResult {
  try {
    return { ok: true, regex: new RegExp(pattern) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "invalid pattern" };
  }
}

export function LevelPlay({ levelId, bestScore, onClear, onBack }: Props) {
  const level = levels.find((l) => l.id === levelId);
  const [draft, setDraft] = useState("");
  const [pattern, setPattern] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    setDraft("");
    setPattern("");
    setShowHint(false);
    setShowSolution(false);
  }, [levelId]);

  if (!level) {
    return <p>レベルが見つかりません。</p>;
  }

  const compiled = useMemo(() => compilePattern(pattern), [pattern]);

  const results = useMemo(() => {
    if (!compiled.ok) return null;
    const regex = compiled.regex;
    const matchResults = level.match.map((s) => ({ str: s, expected: true, actual: regex.test(s) }));
    const notMatchResults = level.notMatch.map((s) => ({ str: s, expected: false, actual: regex.test(s) }));
    return [...matchResults, ...notMatchResults];
  }, [compiled, level]);

  const allPass = results !== null && results.every((r) => r.actual === r.expected);

  const handleClear = () => {
    if (allPass) {
      onClear(levelId, pattern.length);
    }
  };

  return (
    <div className="level-play">
      <button className="back-button" onClick={onBack}>
        ← レベル一覧
      </button>
      <h2>
        Lv.{level.id} {level.title}
      </h2>
      <p className="description">{level.description}</p>

      <input
        className="pattern-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setPattern(draft);
        }}
        placeholder="正規表現を入力してEnterで判定"
        autoFocus
      />
      <div className="meta-row">
        <span>文字数: {pattern.length}</span>
        {bestScore !== null && <span>ベスト記録: {bestScore}文字</span>}
        {!compiled.ok && <span className="error">構文エラー: {compiled.error}</span>}
      </div>

      <div className="help-row">
        <button onClick={() => setShowHint((v) => !v)}>
          {showHint ? "ヒントを隠す" : "ヒントを見る"}
        </button>
        <button onClick={() => setShowSolution((v) => !v)}>
          {showSolution ? "解答を隠す" : "解答を見る"}
        </button>
      </div>
      {showHint && <p className="hint">ヒント: {level.hint}</p>}
      {showSolution && (
        <p className="solution">
          解答例: <code>{level.solution}</code>（{level.solution.length}文字）
        </p>
      )}

      <div className="test-columns">
        <div>
          <h3>マッチすべき文字列</h3>
          <ul>
            {level.match.map((s) => {
              const r = results?.find((res) => res.str === s && res.expected);
              return (
                <li key={`m-${s}`} className={r ? (r.actual ? "pass" : "fail") : ""}>
                  <code>{s === "" ? "(空文字)" : s}</code>
                  {r && <span>{r.actual ? "○" : "×"}</span>}
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h3>マッチしてはいけない文字列</h3>
          <ul>
            {level.notMatch.map((s) => {
              const r = results?.find((res) => res.str === s && !res.expected);
              return (
                <li key={`n-${s}`} className={r ? (!r.actual ? "pass" : "fail") : ""}>
                  <code>{s === "" ? "(空文字)" : s}</code>
                  {r && <span>{r.actual ? "×" : "○"}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {allPass && (
        <div className="clear-banner">
          <p>クリア！（{pattern.length}文字）</p>
          <button onClick={handleClear}>記録する</button>
          <p className="explanation-text">{level.explanation}</p>
        </div>
      )}
    </div>
  );
}
