import { defineConfig } from "vite";

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
});
