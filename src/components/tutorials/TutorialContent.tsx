import React from 'react';
import { Tutorial } from '../../types/tutorial';
import { Clock, Calendar } from 'lucide-react';
import Markdown from 'react-markdown';

interface TutorialContentProps {
  tutorial: Tutorial;
}

export default function TutorialContent({ tutorial }: TutorialContentProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold">{tutorial.title}</h1>
        <span className={`px-3 py-1 rounded-full text-sm ${
          tutorial.level === 'Başlangıç' ? 'bg-green-100 text-green-700' :
          tutorial.level === 'Orta Seviye' ? 'bg-blue-100 text-blue-700' :
          'bg-purple-100 text-purple-700'
        }`}>
          {tutorial.level}
        </span>
      </div>

      <div className="flex items-center space-x-4 text-gray-600 mb-8">
        <div className="flex items-center space-x-1">
          <Clock size={16} />
          <span>{tutorial.duration} dakika</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar size={16} />
          <span>{tutorial.createdAt.toLocaleDateString()}</span>
        </div>
      </div>

      <div className="prose max-w-none">
        <Markdown>{tutorial.content}</Markdown>
      </div>
    </div>
  );
}