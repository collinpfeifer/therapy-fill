import { Router, useLocation } from "@solidjs/router";
import { ColorModeProvider, ColorModeScript } from "@kobalte/core";
import { MetaProvider } from "@solidjs/meta";
import { ToastRegion, ToastList } from "~/components/ui/toast";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createEffect } from "solid-js";
import type {} from "solid-styled-jsx";
import posthog from "posthog-js";
import "./app.css";

export default function App() {
  const location = useLocation();
  createEffect(() => {
    const { pathname } = location;
    posthog.capture("$pageview", { pathname });
  });
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Suspense>
            <ColorModeScript />
            <ColorModeProvider>
              {props.children}
              <ToastRegion>
                <ToastList />
              </ToastRegion>
            </ColorModeProvider>
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
