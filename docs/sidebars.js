/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'introduction',
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/tech-stack',
        'architecture/data-flow',
      ],
    },
    {
      type: 'category',
      label: 'Authentication',
      items: [
        'authentication/setup',
        'authentication/user-management',
        'authentication/authorization',
      ],
    },
    {
      type: 'category',
      label: 'Legal',
      items: [
        'legal/privacy-policy',
      ],
    },
  ],
};

export default sidebars;