import { createProvider } from "@builderbot/bot"
import { BaileysProvider as provider } from "@builderbot/provider-baileys"

export const adapterProvider = createProvider(provider)