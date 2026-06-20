import { levels } from "../levels/levels";

type Props = {
  bestScores: Record<number, number>;
  cleared: Record<number, boolean>;
  onSelect: (id: number) => void;
};

export function LevelList({ bestScores, cleared, onSelect }: Props) {
  return (
    <div className="level-list">
      <h1>正規表現ゴルフ</h1>
      <p className="subtitle">できるだけ短い正規表現で全ての条件を満たそう</p>
      <ul>
        {levels.map((level) => (
          <li key={level.id}>
            <button onClick={() => onSelect(level.id)}>
              <span className="level-number">Lv.{level.id}</span>
              <span className="level-title">{level.title}</span>
              {cleared[level.id] && (
                <span className="level-score">クリア済み（{bestScores[level.id]}文字）</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
