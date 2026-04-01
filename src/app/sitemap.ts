import { MetadataRoute } from 'next';
import { novelsList } from '@/data/novels';

export default function sitemap(): MetadataRoute.Sitemap {
  const novelsEntries = novelsList.map((novel) => ({
    url: `https://caine-novels.vercel.app/novel/${novel.id}`,
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
}