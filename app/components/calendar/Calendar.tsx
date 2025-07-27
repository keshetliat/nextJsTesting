'use client';
import { useState } from 'react';
import { LessonDetails } from '../../types';
import { students, teachers } from '../../data/schoolData';
import LessonPopup from './LessonPopup';
import CalendarCell from './CalendarCell';
import React from 'react';




export default function Calendar() {
  const [selectedLesson, setSelectedLesson] = useState<LessonDetails | null>(null);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'];

  // Get all unique lessons from students' schedules
  const lessons = students.reduce((acc: LessonDetails[], student) => {
    student.schedule.forEach(schedule => {
      const teacher = teachers.find(t => t.subject === schedule.subject);
      if (teacher) {
        const existingLesson = acc.find(
          l => l.schedule.day === schedule.day && 
               l.schedule.time === schedule.time && 
               l.schedule.subject === schedule.subject
        );
        
        if (existingLesson) {
          if (!existingLesson.students.find(s => s.id === student.id)) {
            existingLesson.students.push(student);
          }
        } else {
          acc.push({
            schedule,
            teacher,
            students: [student]
          });
        }
      }
    });
    return acc;
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">School Calendar</h2>
      <div className="grid grid-cols-6 gap-2">
        <div className="font-bold p-2">Time</div>
        {days.map(day => (
          <div key={day} className="font-bold p-2">{day}</div>
        ))}
        
        {times.map(time => (
          <React.Fragment key={time}>
            <div className="font-semibold p-2">{time}</div>
            {days.map(day => {
              const lesson = lessons.find(
                l => l.schedule.day === day && l.schedule.time === time
              );
              return (
                <CalendarCell
                  key={`${day}-${time}`}
                  day={day}
                  time={time}
                  lesson={lesson}
                  onSelect={setSelectedLesson}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {selectedLesson && (
        <LessonPopup 
          lesson={selectedLesson} 
          onClose={() => setSelectedLesson(null)} 
        />
      )}
    </div>
  );
} 