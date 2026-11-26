import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { QuizModal } from "@/components/modals/quiz-modal";
import { apiFetch, userQuery, isBrowser, type Module as ApiModule } from "@/lib/api";
import { CelebrationModal } from "@/components/aprender/celebration-modal";
import { ContinueCard } from "@/components/aprender/continue-card";
import { CoursePicker } from "@/components/aprender/course-picker";
import { LessonModal } from "@/components/aprender/lesson-modal";
import { ModuleSection } from "@/components/aprender/module-section";
import { EmptyCourses, ErrorState, LoadingState } from "@/components/aprender/page-states";
import { ProgressHud } from "@/components/aprender/progress-hud";
import type { LearningCourse, LearningLesson, LearningModule } from "@/components/aprender/types";
import "@/styles/aprender.css";

// Mantido aqui porque outros módulos importam este tipo de "@/routes/aprender".
export type { LearningLesson } from "@/components/aprender/types";

export const Route = createFileRoute("/aprender")({
  head: () => ({
    meta: [
      { title: "Aprender — Viridis" },
      { name: "description", content: "Trilha gamificada de aprendizado em sustentabilidade." },
      // página interna da plataforma (requer login): não deve ser indexada
      { name: "robots", content: "noindex" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&display=swap",
      },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const { data: user, isPending: loadingUser, error: userError } = useQuery(userQuery());
  const {
    data: apiModules,
    isPending: loadingModules,
    error: modulesError,
  } = useQuery({
    queryKey: ["modulos", user?.id],
    queryFn: async () => (await apiFetch<{ modulos: ApiModule[] }>("/modulos")).modulos,
    enabled: isBrowser && !!user,
    retry: false,
  });
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<LearningLesson | null>(null);
  const [quizLesson, setQuizLesson] = useState<LearningLesson | null>(null);
  const [celebrate, setCelebrate] = useState<number | null>(null);
  const [courseId, setCourseId] = useState<number | null>(null);
  // elemento que abriu a lição: o foco volta a ele quando o quiz é fechado sem concluir
  const opener = useRef<HTMLElement | null>(null);
  const openLesson = (lesson: LearningLesson) => {
    opener.current = document.activeElement as HTMLElement | null;
    setSelected(lesson);
  };
  const restoreFocus = () =>
    setTimeout(() => {
      const el = opener.current;
      if (el?.isConnected && (!document.activeElement || document.activeElement === document.body))
        el.focus();
    }, 80);

  const courses: LearningCourse[] = [
    ...new Map(
      (apiModules ?? []).map((module) => [
        module.curso_id,
        {
          id: module.curso_id,
          title: module.curso_titulo,
          description: module.curso_descricao,
          scope: module.escopo,
        },
      ]),
    ).values(),
  ];
  const activeCourse = courses.find((course) => course.id === courseId) ?? courses[0];

  const modules: LearningModule[] = (apiModules ?? [])
    .filter((module) => module.curso_id === activeCourse?.id)
    .map((m) => ({
      id: m.id,
      title: m.titulo,
      description: m.descricao,
      color: m.cor,
      progress: m.progresso,
      lessons: m.licoes.map((l) => ({
        id: l.id,
        title: l.titulo,
        status: l.status,
        kind: l.kind,
        xp: l.xp,
      })),
    }));
  const totalXP = user?.xp ?? 0;
  const pct = user?.xp_proximo_nivel
    ? Math.min(100, Math.round((totalXP / user.xp_proximo_nivel) * 100))
    : 0;

  if (loadingUser)
    return (
      <PageShell>
        <LoadingState label="Carregando sua trilha..." />
      </PageShell>
    );
  if (userError || modulesError || !user)
    return (
      <PageShell>
        <ErrorState
          message={userError?.message ?? modulesError?.message ?? "Faça login para continuar"}
        />
      </PageShell>
    );
  if (loadingUser || loadingModules)
    return (
      <PageShell>
        <LoadingState label="Carregando sua trilha..." />
      </PageShell>
    );

  // Próxima lição a destacar: a atual; se não houver, a primeira disponível (dados reais da API)
  const allLessons = modules.flatMap((m) => m.lessons);
  const nextLesson =
    allLessons.find((l) => l.status === "current") ??
    allLessons.find((l) => l.status === "available") ??
    null;
  const started = allLessons.some((l) => l.status === "completed");
  const allDone = allLessons.length > 0 && allLessons.every((l) => l.status === "completed");
  const mascotModuleId = modules.find((m) => m.lessons.some((l) => l.status === "current"))?.id;
  const faltamXp = user.xp_proximo_nivel ? Math.max(0, user.xp_proximo_nivel - totalXP) : 0;
  const bubble = faltamXp > 0 ? `${faltamXp} XP para o nível ${user.nivel + 1}` : undefined;

  return (
    <PageShell>
      <div className="vr">
        <div aria-hidden="true" className="vr-bg" />

        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
          {user.perfil_nome !== "aluno" && (
            <Link
              to="/cursos"
              className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-5 font-bold text-primary transition-colors hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span>Gerenciar cursos, módulos e perguntas</span>
              <BookOpen className="h-5 w-5 shrink-0" aria-hidden="true" />
            </Link>
          )}

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
            <aside className="sticky top-16 z-20 self-start lg:top-24 lg:col-start-2 lg:row-start-1">
              <ProgressHud
                nivel={user.nivel}
                xp={totalXP}
                xpProximoNivel={user.xp_proximo_nivel}
                pct={pct}
                streakDias={user.streak_dias}
                pontosTotais={user.pontos_totais}
              />
            </aside>

            <div className="min-w-0 lg:col-start-1 lg:row-start-1">
              <h1 className="vr-display text-3xl font-extrabold sm:text-4xl">Seus cursos</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Conteúdo do Viridis, da sua escola e da sua turma.
              </p>

              {courses.length === 0 ? (
                <EmptyCourses />
              ) : (
                <>
                  <div className="mt-5">
                    <ContinueCard
                      lesson={nextLesson}
                      started={started}
                      allDone={allDone}
                      onStart={openLesson}
                    />
                  </div>
                  <div className="my-6">
                    <CoursePicker
                      courses={courses}
                      activeId={activeCourse?.id}
                      onSelect={(id) => {
                        setCourseId(id);
                        setSelected(null);
                        setQuizLesson(null);
                      }}
                    />
                  </div>
                  <h2 className="vr-display mb-4 break-words text-xl font-bold">
                    {activeCourse?.title}
                  </h2>
                </>
              )}

              {modules.map((m, mi) => (
                <ModuleSection
                  key={m.id}
                  module={m}
                  index={mi}
                  onSelect={openLesson}
                  mascot={m.id === mascotModuleId ? { bubble } : null}
                />
              ))}
            </div>
          </div>
        </div>

        <LessonModal
          lesson={selected}
          onClose={() => setSelected(null)}
          onStart={() => {
            const l = selected;
            setSelected(null);
            setTimeout(() => setQuizLesson(l), 200);
          }}
        />
        <QuizModal
          lesson={quizLesson}
          onClose={() => {
            setQuizLesson(null);
            restoreFocus();
          }}
          onFinish={(xp) => {
            setQuizLesson(null);
            void queryClient.invalidateQueries({ queryKey: ["perfil"] });
            void queryClient.invalidateQueries({ queryKey: ["modulos"] });
            setTimeout(() => setCelebrate(xp), 250);
          }}
        />
        <CelebrationModal
          open={celebrate !== null}
          xp={celebrate ?? 0}
          onClose={() => setCelebrate(null)}
        />
      </div>
    </PageShell>
  );
}
