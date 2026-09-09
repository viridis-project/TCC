import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/quiz")({
  beforeLoad: () => { throw redirect({ to: "/cursos" }); },
});
