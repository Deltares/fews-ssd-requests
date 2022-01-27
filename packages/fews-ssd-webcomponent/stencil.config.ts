import { Config } from '@stencil/core';
import { angularOutputTarget as angular } from '@stencil/angular-output-target';

export const config: Config = {
  namespace: 'fews-ssd-webcomponent',
  outputTargets: [
    angular({
      componentCorePackage: `@deltares/fews-ssd-webcomponent`,
      directivesProxyFile: `../angular-workspace/projects/component-library/src/lib/stencil-generated/components.ts`
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
