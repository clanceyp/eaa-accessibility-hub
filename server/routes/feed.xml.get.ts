import newsData from '../../data/news.json'
import timelineData from '../../data/timeline.json'
import { SITE_NAME, SITE_URL } from '../../shared/site'

interface FeedItem {
  title: string
  link: string
  guid: string
  pubDate: string
  description: string
  category: string
}

// Imported (not read from disk at runtime) — see server/api/news.get.ts
// for why: this is what makes the update-news/update-timeline pipelines
// "just work" for this feed too. Both only ever change data/news.json /
// data/timeline.json via a reviewed PR merge, which triggers a fresh
// Vercel build, and that build re-imports these files and inlines the
// result into the compiled function — exactly like /api/news, /api/timeline
// and sitemap.xml already do. No pipeline code needs to know this feed
// exists.
const newsItems: FeedItem[] = (newsData as { id: string; title: string; summary: string; category: string; date: string; sourceUrl: string }[]).map((entry) => ({
  title: entry.title,
  link: entry.sourceUrl,
  guid: entry.id,
  pubDate: entry.date,
  description: entry.summary,
  category: entry.category
}))

const timelineItems: FeedItem[] = (timelineData as { id: string; title: string; detail: string; date: string; sourceUrl: string }[]).map((entry) => ({
  title: entry.title,
  link: entry.sourceUrl,
  guid: entry.id,
  pubDate: entry.date,
  description: entry.detail,
  category: 'Timeline'
}))

const items = [...newsItems, ...timelineItems].sort((a, b) => b.pubDate.localeCompare(a.pubDate))

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toItemXml(item: FeedItem): string {
  return `<item>` +
    `<title>${escapeXml(item.title)}</title>` +
    `<link>${escapeXml(item.link)}</link>` +
    `<guid isPermaLink="false">${escapeXml(item.guid)}</guid>` +
    `<pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>` +
    `<description>${escapeXml(item.description)}</description>` +
    `<category>${escapeXml(item.category)}</category>` +
    `</item>`
}

export default defineEventHandler((event) => {
  const lastBuildDate = new Date(useRuntimeConfig(event).public.buildTime).toUTCString()

  const itemsXml = items.map(toItemXml).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">` +
    `<channel>` +
    `<title>${escapeXml(SITE_NAME)}</title>` +
    `<link>${SITE_URL}/</link>` +
    `<description>${escapeXml('Legal and regulatory EN 301 549 / European Accessibility Act news and timeline updates.')}</description>` +
    `<language>en-gb</language>` +
    `<lastBuildDate>${lastBuildDate}</lastBuildDate>` +
    `<atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />` +
    itemsXml +
    `</channel>` +
    `</rss>`

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return xml
})
