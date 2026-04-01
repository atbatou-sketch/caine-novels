const fs = require('fs');

const sitemapCode = `import { MetadataRoute } from 'next';
import { sampleNovels } from '@/data/sampleNovels';

export default function sitemap(): MetadataRoute.Sitemap {
  const novelsEntries = sampleNovels.map((novel) => ({
    url: \`https://caine-novels.vercel.app/novel/\${novel.id}\`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://caine-novels.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...novelsEntries,
  ];
}`;

fs.writeFileSync('src/app/sitemap.ts', sitemapCode, 'utf8');

const robotsCode = `import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://caine-novels.vercel.app/sitemap.xml',
  };
}`;

fs.writeFileSync('src/app/robots.ts', robotsCode, 'utf8');

console.log("SEO generators created.");
