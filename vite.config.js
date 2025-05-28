import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
    build: {
        lib: {
            entry: "./src/main.js",
            name: "LiteGraph", // 사용자가 import LiteGraph from ... 할 때 네임스페이스
            formats: ["es"],
            fileName: "litegraph-bundle",
        },
        rollupOptions: {
            external: [], // 외부 라이브러리(gl-matrix 등)는 여기 지정
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
