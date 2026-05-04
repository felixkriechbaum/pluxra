import { z } from 'zod'

const querySchema = z.object({
  url: z.string().url(),
  max: z.coerce.number().int().min(1).max(20).default(5),
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse)
  const xml = await $fetch<string>(query.url, { responseType: 'text' })

  const items: { title: string; link: string }[] = []
  const itemRegex = /<item[\s\S]*?<\/item>/g
  const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/
  const linkRegex = /<link>(.*?)<\/link>/

  let match: RegExpExecArray | null
  while ((match = itemRegex.exec(xml)) !== null && items.length < query.max) {
    const titleMatch = titleRegex.exec(match[0])
    const linkMatch = linkRegex.exec(match[0])
    if (titleMatch && linkMatch) {
      items.push({
        title: (titleMatch[1] ?? titleMatch[2] ?? '').trim(),
        link: linkMatch[1].trim(),
      })
    }
  }

  return items
})
