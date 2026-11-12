import { createFileRoute } from "@tanstack/react-router";
import { OperationalPage } from "@/routes/admin";

export const Route = createFileRoute("/professor")({
  head: () => ({ meta: [{ title: "Painel do Professor — Viridis" }] }),
  component: ProfessorPage,
});

function ProfessorPage() {
  return <OperationalPage panel="professor" />;
}
