import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
    build: {
        rollupOptions: {
            input: "./src/main.js",
            output: {
                format: "iife",
                name: "App", // 또는 LiteGraph 등
                entryFileNames: "bundle.js",
            },
        },
        outDir: "dist",
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        hmr: true,
        host: "localhost",
        port: 8084,
    },
});
