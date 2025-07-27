'use client';
import { Schedule, Student, Teacher } from '../../types';
import { LessonDetails } from '../../types';

interface LessonPopupProps {
  lesson: LessonDetails;
  onClose: () => void;
}

export default function LessonPopup({ lesson, onClose }: LessonPopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">{lesson.schedule.subject}</h3>
            <p className="text-gray-600">
              {lesson.schedule.day} at {lesson.schedule.time}
            </p>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <p className="font-bold">Teacher: {lesson.teacher.name}</p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Enrolled Students:</h4>
          <div className="max-h-60 overflow-y-auto">
            {lesson.students.map(student => (
              <div key={student.id} className="p-2 hover:bg-gray-50">
                {student.name} - Grade {student.grade}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 