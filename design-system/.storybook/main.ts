import type { StorybookConfig } from '@storybook/react-vite';

function pagesBase(raw: string | undefined): string {
  if (!raw || raw === '/') {
    return '/';
  }

  return raw.endsWith('/') ? raw : `${raw}/`;
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: '@storybook/react-vite',
  // Private Pages uses a unique host (base `/`). A public project site uses `/repo/`.
  async viteFinal(config) {
    config.base = pagesBase(process.env.STORYBOOK_BASE_PATH);
    return config;
  },
};

export default config;
