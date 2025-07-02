import { JSX } from "react/jsx-runtime";

export interface Classroom {
  map(arg0: (classroom: any) => JSX.Element): import("react").ReactNode;
  id: number | string;
  className: string;
  teacherName: string;
  activities?: string[];
}