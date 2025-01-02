import { Router } from "@solidjs/router";
import { ColorModeProvider, ColorModeScript } from "@kobalte/core";
import { MetaProvider } from "@solidjs/meta";
import { ToastRegion, ToastList } from "~/components/ui/toast";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import type {} from "solid-styled-jsx";
import "./app.css";

export default function App() {
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
