import { createFileRoute } from "@tanstack/react-router";
import { KanaPractice } from "@/components/KanaPractice";

export const Route = createFileRoute("/journey/kana-palace/practice/$id")({
  component: PracticeRoute,
});

function PracticeRoute() {
  const { id } = Route.useParams();
  return <KanaPractice id={id} />;
}
