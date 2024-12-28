import { action } from "@solidjs/router";
import { addEmail as ae } from "./actions.server";

export const addemail = action(ae, "addEmail");
