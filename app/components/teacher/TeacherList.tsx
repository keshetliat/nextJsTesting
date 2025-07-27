'use client';
import { useState } from 'react';
import { Teacher } from '../../types';
import { teachers, students } from '../../data/schoolData';
import TeacherSchedule from './TeacherSchedule';
import TeacherListItem from './TeacherListItem';

export default function TeacherList() {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Teachers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">Teacher List</h3>
          <div className="space-y-2">
            {teachers.map(teacher => (
              <TeacherListItem 
                key={teacher.id}
                teacher={teacher}
                onSelect={setSelectedTeacher}
              />
            ))}
          </div>
        </div>
        
        {selectedTeacher && (
          <TeacherSchedule 
            teacher={selectedTeacher}
            students={students.filter(student => 
              student.subjects.includes(selectedTeacher.subject)
            )}
          />
        )}
      </div>
    </div>
  );
} 