import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  publicDir: "public",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index: "index.html",
        myobrace: "myobrace.html",
        alineadores: "alineadores.html",
        ortodoncia: "ortodoncia.html",
        turismo: "turismo.html",
        politica: "politica-de-privacidad-y-tratamiento-de-datos.html",
        terminos: "terminos-y-condiciones.html",
      },
    },
  },
});