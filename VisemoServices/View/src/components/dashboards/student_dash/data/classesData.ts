// src/data/classesData.ts
import { ClassData } from "../../../../types/class";

export const classesData: Record<string, ClassData> = {
  "1": {
    className: "C# Programming",    
    teacherName: "John Smith",
    activities: [
      { 
        id: '1', 
        title: 'Title Activity', 
        timeAndDate: 'Feb 20, 2024 10:00 AM',
        description: 'Activity description goes here...'
      },
      { 
        id: '2', 
        title: 'Title Activity', 
        timeAndDate: 'Feb 22, 2024 2:30 PM',
        description: 'Activity description goes here...'
      },
      { 
        id: '3', 
        title: 'Title Activity', 
        timeAndDate: 'Feb 25, 2024 9:00 AM',
        description: 'Activity description goes here...'
      },
      { 
        id: '4', 
        title: 'Title Activity', 
        timeAndDate: 'Feb 28, 2024 1:00 PM',
        description: 'Activity description goes here...'
      },
    ]
  },
  "2": {
    className: "Web Development",
    teacherName: "Jane Doe",
    activities: [
      { 
        id: '1', 
        title: 'HTML Basics', 
        timeAndDate: 'Feb 21, 2024 11:00 AM',
        description: 'Introduction to HTML fundamentals'
      },
      { 
        id: '2', 
        title: 'CSS Styling', 
        timeAndDate: 'Feb 23, 2024 1:30 PM',
        description: 'Learn CSS styling techniques'
      },
    ]
  },
  // Add more classes as needed
};