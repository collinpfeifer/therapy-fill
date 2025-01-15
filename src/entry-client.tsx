// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import { posthog } from "posthog-js";

// Optionally, enable debugging in development
if (import.meta.env.MODE === "development") {
  posthog.init("fake token", {
    autocapture: false,
    loaded: function (ph) {
      if (process.env.ENVIRONMENT == "development") {
        ph.opt_out_capturing(); // opts a user out of event capture
        ph.set_config({ disable_session_recording: true });
      }
    },
  });
  posthog.debug();
} else if (import.meta.env.MODE === "production") {
  posthog.init("phc_gOaMhBWfJBh5kbTnpW6fnT09lVc6RJta6shkACVMQme", {
    api_host: "https://us.i.posthog.com",
    person_profiles: "always",
  });
}
mount(() => <StartClient />, document.getElementById("app")!);
