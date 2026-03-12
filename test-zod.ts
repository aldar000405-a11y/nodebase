import { z } from "zod";

enum CredentialType {
  OPENAI = "OPENAI",
  ANTHROPIC = "ANTHROPIC",
  GEMINI = "GEMINI",
}

try {
  z.enum(CredentialType as any);
  console.log("z.enum works");
} catch (e: any) {
  console.log("z.enum fails:", e.message);
}

try {
  z.nativeEnum(CredentialType);
  console.log("z.nativeEnum works");
} catch (e: any) {
  console.log("z.nativeEnum fails:", e.message);
}
