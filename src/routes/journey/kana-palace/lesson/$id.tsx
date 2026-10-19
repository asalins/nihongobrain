import { createFileRoute } from "@tanstack/react-router";
import { KanaLesson } from "@/components/KanaLesson";

export const Route = createFileRoute("/journey/kana-palace/lesson/$id")({
  component: LessonRoute,
});

function LessonRoute() {
  const { id } = Route.useParams();
  return <KanaLesson id={id} />;
}
