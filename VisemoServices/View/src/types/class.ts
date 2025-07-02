export interface Activity {
    id: string;
    title: string;
    timeAndDate: string;
    description?: string;
  }
  
  export interface ClassData {
    className: string;
    teacherName: string;
    activities: Activity[];
  }