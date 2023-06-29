import { importMapsPlugin } from '@web/dev-server-import-maps';

export default {
  rootDir: '.',
  files: ['./tests/**/*.test.{js,html}'],
  nodeResolve: {exportConditions: ['development']},
  preserveSymlinks: true,
  plugins: [
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            '/src/notification.css': '/tests/__mocks__/stylesheet.js',
            '/package.json': '/tests/__mocks__/placeholder.js',
          },
        },
      },
    }),
  ],
};
