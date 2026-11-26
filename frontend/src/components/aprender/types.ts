export type LessonStatus = "completed" | "current" | "available" | "locked";
export type LessonKind = "lesson" | "challenge" | "exam" | "certificate" | "trophy";

export type LearningLesson = {
  id: number;
  title: string;
  status: LessonStatus;
  kind: LessonKind;
  xp: number;
};

export type LearningModule = {
  id: number;
  title: string;
  description: string;
  color: string;
  progress: number;
  lessons: LearningLesson[];
};

export type LearningCourse = {
  id: number;
  title: string;
  description: string;
  scope: "app" | "escola" | "turma";
};
