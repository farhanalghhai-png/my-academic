import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite"; // <-- Tambahkan baris ini

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // --- Tambahkan blok vite di bawah ini ---
  vite: {
    plugins: [
      nitro({
        preset: "vercel",
      }),
    ],
  },
});