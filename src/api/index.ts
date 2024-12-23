import { action } from "@solidjs/router";
import { addEmail as ae } from "./server";

export const addEmail = action(ae, "addEmail");
