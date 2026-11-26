import type { LearningCourse } from "./types";

const SCOPE_LABEL = { app: "Viridis", escola: "Sua escola", turma: "Sua turma" } as const;

export function CoursePicker({
  courses,
  activeId,
  onSelect,
}: {
  courses: LearningCourse[];
  activeId: number | undefined;
  onSelect: (id: number) => void;
}) {
  return (
    <div role="group" aria-label="Escolha o curso" className="grid gap-3 sm:grid-cols-2">
      {courses.map((course) => {
        const active = activeId === course.id;
        return (
          <button
            key={course.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(course.id)}
            data-testid={`course-picker-course-${course.id}`}
            className={`rounded-2xl border-2 p-4 text-left transition-[border-color,background-color,transform] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] ${
              active
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <span className="block text-xs font-bold text-primary">
              {SCOPE_LABEL[course.scope]}
            </span>
            <span className="mt-1 block break-words font-bold">{course.title}</span>
            <span className="mt-1 line-clamp-2 block break-words text-xs text-muted-foreground">
              {course.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
