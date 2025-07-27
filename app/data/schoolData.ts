import { Teacher, Student, Schedule } from '../types';

export const subjects = [
  'Mathematics',
  'English',
  'Science',
  'History',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Literature'
];

export const teachers: Teacher[] = [
  { id: 1, name: 'John Smith', subject: 'Mathematics' },
  { id: 2, name: 'Sarah Johnson', subject: 'English' },
  { id: 3, name: 'Michael Brown', subject: 'Science' },
  { id: 4, name: 'Emily Davis', subject: 'History' },
  { id: 5, name: 'David Wilson', subject: 'Geography' },
  { id: 6, name: 'Lisa Anderson', subject: 'Physics' },
  { id: 7, name: 'Robert Taylor', subject: 'Chemistry' },
  { id: 8, name: 'Jennifer Martinez', subject: 'Biology' },
  { id: 9, name: 'William Thomas', subject: 'Computer Science' },
  { id: 10, name: 'Elizabeth White', subject: 'Literature' }
];

// Generate 40 students with fixed data
export const students: Student[] = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: `Student ${i + 1}`,
  grade: Math.floor(i / 13) + 9, // Distribute students across grades 9-11
  subjects: getSubjectsForStudent(i),
  schedule: generateScheduleForStudent(i)
}));

function getSubjectsForStudent(index: number): string[] {
  // Ensure each student gets 4-6 subjects
  const numSubjects = 4 + (index % 3); // 4-6 subjects
  const startIndex = index % subjects.length;
  const studentSubjects = [];
  
  for (let i = 0; i < numSubjects; i++) {
    const subjectIndex = (startIndex + i) % subjects.length;
    studentSubjects.push(subjects[subjectIndex]);
  }
  
  return studentSubjects;
}

function generateScheduleForStudent(index: number): Schedule[] {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'];
  const studentSubjects = getSubjectsForStudent(index);
  const schedule: Schedule[] = [];
  
  // Generate 3 consecutive lessons per day for each student
  days.forEach(day => {
    // Start at a random time slot, but ensure we have 3 consecutive slots
    const startTimeIndex = Math.floor(Math.random() * 3); // 0, 1, or 2
    const dayTimes = times.slice(startTimeIndex, startTimeIndex + 3);
    
    // Assign subjects to these consecutive times
    dayTimes.forEach((time, timeIndex) => {
      const subjectIndex = (index + timeIndex) % studentSubjects.length;
      const subject = studentSubjects[subjectIndex];
      const teacher = teachers.find(t => t.subject === subject)?.name || '';
      
      schedule.push({
        day,
        time,
        subject,
        teacher
      });
    });
  });
  
  return schedule;
} 