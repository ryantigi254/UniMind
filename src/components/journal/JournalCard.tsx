import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Image } from '@nextui-org/react';

// Define the structure of a journal entry
export type JournalEntry = {
  id: string;
  title: string;
  date: string; // Consider using Date object or a more specific date format
  imageUrl?: string; // Optional image URL
  snippet: string; // Short preview text
  content: string; // Full content
};

type JournalCardProps = {
  entry: JournalEntry;
  onClick: () => void;
};

const JournalCard: React.FC<JournalCardProps> = ({ entry, onClick }) => {
  return (
    <Card isPressable onPress={onClick} className="w-full h-[300px] col-span-12 sm:col-span-6 md:col-span-4 bg-neutral-100 dark:bg-neutral-900 border-none" shadow="sm">
      {/* Use CardHeader if you want a title/subtitle separate from the image */}
      {/* <CardHeader className="absolute z-10 top-1 flex-col items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">{entry.date}</p>
        <h4 className="text-white/90 font-medium text-xl">{entry.title}</h4>
      </CardHeader> */}
      <CardBody className="overflow-hidden p-0">
        {entry.imageUrl ? (
          <Image
            removeWrapper
            alt={entry.title || 'Journal image'}
            className="z-0 w-full h-full object-cover"
            src={entry.imageUrl}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-200 via-teal-200 to-blue-300 dark:from-green-800 dark:via-teal-800 dark:to-blue-900 flex items-center justify-center">
            {/* Placeholder if no image */}
          </div>
        )}
      </CardBody>
      <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
        <div className="flex flex-col items-start w-full">
          <p className="text-tiny text-white/80 uppercase font-semibold">{entry.date}</p>
          <h4 className="text-white font-medium text-lg truncate">{entry.title}</h4>
          <p className="text-tiny text-white/70 mt-1 truncate">{entry.snippet}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JournalCard; 