'use client';
import { Student } from '../../types';

interface StudentListItemProps {
  student: Student;
  onSelect: (student: Student) => void;
}

export default function StudentListItem({ student, onSelect }: StudentListItemProps) {
  return (
    <div
      className="p-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => onSelect(student)}
    >
      {student.name} - Grade {student.grade}
    </div>
  );
} 