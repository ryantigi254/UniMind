import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'UniMind Documentation',
  tagline: 'Technical documentation and architecture guide for the UniMind mental health platform',
  favicon: 'img/favicon.ico',
  url: 'https://your-org.github.io',
  baseUrl: '/unimind-docs/',
  organizationName: 'your-org',
  projectName: 'unimind-docs',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/your-org/unimind-docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  themeConfig: {
    image: 'img/unimind-social-card.jpg',
    navbar: {
      title: 'UniMind Docs',
      logo: {
        alt: 'UniMind Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/legal/privacy-policy',
          label: 'Privacy Policy',
          position: 'right',
        },
        {
          href: 'https://github.com/your-org/unimind',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/introduction',
            },
            {
              label: 'Privacy Policy',
              to: '/legal/privacy-policy',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Issues',
              href: 'https://github.com/your-org/unimind/issues',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} UniMind. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;