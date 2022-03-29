import { Config } from '@stencil/core';
import typescript from 'rollup-plugin-typescript';

export const config: Config = {
  namespace: 'fews-ssd-webcomponent',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  rollupPlugins: {
    before: [
      typescript()
    ]
  }
};
