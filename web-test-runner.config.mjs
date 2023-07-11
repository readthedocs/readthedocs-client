import { importMapsPlugin } from '@web/dev-server-import-maps';
import { fromRollup } from '@web/dev-server-rollup';
import rollupCommonjs from '@rollup/plugin-commonjs';

const pluginCommonjs = fromRollup(rollupCommonjs);

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
            // These files are imported through Webpack, but don't resolve the
            // same way when using Rollup, which is used by WTR in testing. We
            // don't need to test these files, so just mock the output files.
            '/src/images/logo-wordmark-dark.svg': '/tests/__mocks__/stylesheet.js',
            '/src/notification.css': '/tests/__mocks__/stylesheet.js',
            '/src/search.css': '/tests/__mocks__/stylesheet.js',
            '/package.json': '/tests/__mocks__/placeholder.js',
          },
        },
      },
    }),
    pluginCommonjs({
      include: [],
    }),
  ],
};
