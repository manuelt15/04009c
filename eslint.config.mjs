import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    // Código de autenticación aparcado: vuelve con better-auth, no se revisa
        "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
