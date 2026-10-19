import { createFileRoute } from "@tanstack/react-router";
import { KanaPalace } from "@/components/KanaPalace";

export const Route = createFileRoute("/journey/kana-palace/")({
  component: KanaPalace,
});
