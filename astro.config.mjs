import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
    title: 'The BETH Stack',
    social: {
      github: 'https://github.com/ethanniser/the-beth-stack'
    },
    sidebar: [{
      label: 'Start Here',
      autogenerate: {
        directory: 'start_here'
      }
    }, {
      label: 'Guides',
      items: [
      // Each item here is one entry in the navigation menu.
      {
        label: 'Example Guide',
        link: '/guides/example/'
      }]
    }, {
      label: 'Reference',
      autogenerate: {
        directory: 'reference'
      }
    }]
  })],
});
