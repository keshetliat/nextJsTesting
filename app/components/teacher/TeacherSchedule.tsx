'use client';
import { Teacher, Student } from '../../types';

interface TeacherScheduleProps {
  teacher: Teacher;
  students: Student[];
}

export default function TeacherSchedule({ teacher, students }: TeacherScheduleProps) {
  return (
    <div className="border p-4 rounded">
      <h3 className="text-xl font-semibold mb-2">{teacher.name}'s Students</h3>
      <div className="space-y-4">
        <p className="text-gray-600">Subject: {teacher.subject}</p>
        <div>
          <h4 className="font-semibold mb-2">Enrolled Students:</h4>
          <div className="space-y-2">
            {students.map(student => (
              <div key={student.id} className="p-2 bg-gray-50 rounded">
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Grade:</strong> {student.grade}</p>
                <p><strong>Schedule:</strong></p>
                {student.schedule
                  .filter(schedule => schedule.subject === teacher.subject)
                  .map((schedule, index) => (
                    <div key={index} className="ml-4 text-sm">
                      {schedule.day} at {schedule.time}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 