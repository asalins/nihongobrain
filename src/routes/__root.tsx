import { createRootRoute, Outlet } from "@tanstack/react-router";

const APP_NAME = "NihongoBrain";

// Document <head> (title, meta, fonts, manifest) now lives in index.html.
// The Grok-only AuthProvider and PreviewHostBridge wrappers were removed in M0.
export const Route = createRootRoute({
  component: () => <Outlet />,
});

export { APP_NAME };
