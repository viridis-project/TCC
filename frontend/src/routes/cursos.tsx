import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { CourseManagement } from "@/components/course-management";
import { userQuery } from "@/lib/api";

export const Route = createFileRoute("/cursos")({
  head: () => ({ meta: [{ title: "Gestão de cursos — Viridis" }] }),
  component: CoursesPage,
});

function CoursesPage() {
  const { data: user, isPending, error } = useQuery(userQuery());
  if (isPending)
    return (
      <PageShell>
        <p role="status" className="p-16 text-center">
          Verificando acesso...
        </p>
      </PageShell>
    );
  if (error || !user)
    return (
      <PageShell>
        <div className="space-y-4 p-16 text-center">
          <p role="alert">{error?.message ?? "Entre para continuar."}</p>
          <Link to="/login" className="text-primary underline">
            Entrar
          </Link>
        </div>
      </PageShell>
    );
  if (user.perfil_nome === "aluno")
    return (
      <PageShell>
        <div className="space-y-4 p-16 text-center">
          <h1 className="text-xl font-bold">Área de gestão de conteúdo</h1>
          <Link to="/aprender" className="text-primary underline">
            Acessar meus cursos
          </Link>
        </div>
      </PageShell>
    );
  return (
    <PageShell>
      <CourseManagement key={`${user.id}-${user.perfil_nome}-${user.instituicao_id}`} user={user} />
    </PageShell>
  );
}
