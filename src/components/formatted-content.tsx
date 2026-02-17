"use client";

import React from 'react';

type FormattedContentProps = {
  text: string;
};

export function FormattedContent({ text }: FormattedContentProps) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="space-y-2 list-disc pl-5 my-2">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  const renderLineWithStrong = (lineContent: string) => {
    const parts = lineContent.split(/(\*\*.*?\*\*)/g).filter(Boolean);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-primary font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) return;

    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      const content = trimmedLine.substring(2);
      currentList.push(<li key={index}>{renderLineWithStrong(content)}</li>);
    } else {
      flushList();
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        const content = trimmedLine.slice(2, -2);
        elements.push(
          <h4 key={index} className="font-headline font-bold mt-4 mb-2 text-lg">
            {content}
          </h4>
        );
      } else {
        elements.push(
          <p key={index} className="mt-2">
            {renderLineWithStrong(trimmedLine)}
          </p>
        );
      }
    }
  });

  flushList();

  return <div className="text-left space-y-2">{elements}</div>;
}
