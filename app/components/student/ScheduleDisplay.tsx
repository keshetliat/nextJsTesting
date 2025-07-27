'use client';
import { Schedule } from '../../types';

interface ScheduleDisplayProps {
  schedule: Schedule[];
  studentName: string;
}

export default function ScheduleDisplay({ schedule, studentName }: ScheduleDisplayProps) {
  return (
    <div className="border p-4 rounded">
      <h3 className="text-xl font-semibold mb-2">{studentName}'s Schedule</h3>
      <div className="space-y-2">
        {schedule.map((schedule, index) => (
          <div key={index} className="p-2 bg-gray-50 rounded">
            <p><strong>Day:</strong> {schedule.day}</p>
            <p><strong>Time:</strong> {schedule.time}</p>
            <p><strong>Subject:</strong> {schedule.subject}</p>
            <p><strong>Teacher:</strong> {schedule.teacher}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 