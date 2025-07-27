'use client';
import { useState } from 'react';
import { Student } from '../../types';
import { students } from '../../data/schoolData';
import ScheduleDisplay from './ScheduleDisplay';
import StudentListItem from './StudentListItem';

export default function StudentList() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Students</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">Student List</h3>
          <div className="space-y-2">
            {students.map(student => (
              <StudentListItem 
                key={student.id}
                student={student}
                onSelect={setSelectedStudent}
              />
            ))}
          </div>
        </div>
        
        {selectedStudent && (
          <ScheduleDisplay 
            schedule={selectedStudent.schedule} 
            studentName={selectedStudent.name} 
          />
        )}
      </div>
    </div>
  );
} 