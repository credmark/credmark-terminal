/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.host || 'https://app.credmark.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};
