'use client';
import { useState } from 'react';
import StudentList from './student/StudentList';
import TeacherList from './teacher/TeacherList';
import Calendar from './calendar/Calendar';


export default function Tabs() {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'calendar'>('students');

  return (
    <div>
      <div className="border-b mb-4">
        <nav className="flex space-x-4">
          <button
            className={`py-2 px-4 ${
              activeTab === 'students'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 'teachers'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('teachers')}
          >
            Teachers
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 'calendar'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('calendar')}
          >
            Calendar
          </button>
         
        </nav>
      </div>
      
      {activeTab === 'students' ? (
        <StudentList />
      ) : activeTab === 'teachers' ? (
        <TeacherList />
      ) : activeTab === 'calendar' ? (
        <Calendar />
      ) : null}
    </div>
  );
} 