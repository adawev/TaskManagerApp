import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    restoreMocks: true,
    coverage: {
      reporter: ['text', 'json'],
      include: ['src/controllers/**', 'src/services/**']
    }
  }
});
