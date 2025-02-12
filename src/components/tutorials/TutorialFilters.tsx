import React from 'react';
import { TutorialLevel } from '../../types/tutorial';

interface TutorialFiltersProps {
  onLevelChange: (level: TutorialLevel | null) => void;
}

export default function TutorialFilters({ onLevelChange }: TutorialFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => onLevelChange(null)}
        className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
      >
        Tümü
      </button>
      {Object.values(TutorialLevel).map((level) => (
        <button
          key={level}
          onClick={() => onLevelChange(level)}
          className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
        >
          {level}
        </button>
      ))}
    </div>
  );
}