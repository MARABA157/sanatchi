import React from 'react';
import { PromptTemplate } from '../../types/prompt';
import { Trash2, Tag, Calendar } from 'lucide-react';

interface PromptTemplateListProps {
  templates: PromptTemplate[];
  onDelete: (id: string) => void;
}

export default function PromptTemplateList({ templates, onDelete }: PromptTemplateListProps) {
  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <div key={template.id} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">{template.name}</h3>
            <button
              onClick={() => onDelete(template.id)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <p className="text-gray-600 text-sm mb-3">{template.content}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Tag size={14} />
              <span>{template.tags.join(', ')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{template.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}