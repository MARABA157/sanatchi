import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface GenerationDisplayProps {
  loading: boolean;
  error?: string;
  output?: {
    text?: string;
    imageUrl?: string;
  };
}

export function GenerationDisplay({ loading, error, output }: GenerationDisplayProps) {
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-6">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!output) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {output.text && <p className="whitespace-pre-wrap">{output.text}</p>}
        {output.imageUrl && (
          <div className="mt-4">
            <img
              src={output.imageUrl}
              alt="Generated content"
              className="max-w-full rounded-lg"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}