import { useEffect, useState } from "react";
import { LevelList } from "./components/LevelList";
import { LevelPlay } from "./components/LevelPlay";
import "./App.css";

const STORAGE_KEY = "regex-golf-scores";

function loadScores(): Record<number, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function App() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [bestScores, setBestScores] = useState<Record<number, number>>(() => loadScores());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bestScores));
  }, [bestScores]);

  const handleClear = (levelId: number, score: number) => {
    setBestScores((prev) => {
      const current = prev[levelId];
      if (current !== undefined && current <= score) return prev;
      return { ...prev, [levelId]: score };
    });
  };

  const cleared = Object.fromEntries(
    Object.keys(bestScores).map((id) => [Number(id), true])
  );

  return (
    <div className="app">
      {selectedLevel === null ? (
        <LevelList bestScores={bestScores} cleared={cleared} onSelect={setSelectedLevel} />
      ) : (
        <LevelPlay
          levelId={selectedLevel}
          bestScore={bestScores[selectedLevel] ?? null}
          onClear={handleClear}
          onBack={() => setSelectedLevel(null)}
        />
      )}
    </div>
  );
}

export default App;
