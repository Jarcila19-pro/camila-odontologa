import { defineConfig } from "vite";

export default defineConfig({
  base: "/odontologia-medellin/",
  publicDir: "public",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index: "index.html",
        myobrace: "src/pages/myobrace.html",
        alineadores: "src/pages/alineadores.html",
        ortodoncia: "src/pages/ortodoncia.html",
        turismo: "src/pages/turismo.html",
      },
    },
  },
});
