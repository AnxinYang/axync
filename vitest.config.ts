import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true, // You can enable this to use global test functions without imports
    include: ['src/**/*.spec.{js,ts}'], // Adjust the pattern to match your files
    coverage: {
      provider: "istanbul", // or 'v8' or any other provider
      reporter: ["text"],
      all: true, // Include all files, even if not tested
      include: ['src/**/*.{js,ts}'], // Adjust this pattern as necessary
      exclude: ['**/node_modules/**', '**/dist/**', '**/test/**','**/play.ts'],
    },
  },
  resolve: {
    alias: {
     
    },
  },
});
