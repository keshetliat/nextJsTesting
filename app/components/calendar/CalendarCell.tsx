'use client';
import { LessonDetails } from '../../types';

interface CalendarCellProps {
  day: string;
  time: string;
  lesson: LessonDetails | undefined;
  onSelect: (lesson: LessonDetails) => void;
}

export default function CalendarCell({ day, time, lesson, onSelect }: CalendarCellProps) {
  return (
    <div
      key={`${day}-${time}`}
      className={`p-2 border rounded cursor-pointer hover:bg-gray-50 ${
        lesson ? 'bg-blue-50' : ''
      }`}
      onClick={() => lesson && onSelect(lesson)}
    >
      {lesson ? lesson.schedule.subject : ''}
    </div>
  );
} 