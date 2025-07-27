'use client';
import { Teacher } from '../../types';

interface TeacherListItemProps {
  teacher: Teacher;
  onSelect: (teacher: Teacher) => void;
}

export default function TeacherListItem({ teacher, onSelect }: TeacherListItemProps) {
  return (
    <div
      className="p-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => onSelect(teacher)}
    >
      {teacher.name} - {teacher.subject}
    </div>
  );
} 