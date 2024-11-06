import { createFlow } from "@builderbot/bot";
import initFlow from "./initFlow";
import requiscionesFlow from "~/flow/requiscionesFlow";
import validacionFlow from "~/flow/ValidacionFlow";

export const adapterFlow = createFlow([
        initFlow,
        requiscionesFlow,
        validacionFlow
    ])