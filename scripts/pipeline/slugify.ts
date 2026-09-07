export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(new RegExp('[̀-ͯ]', 'g'), '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/** Generates a unique id, appending -2, -3, ... on collision. */
export function uniqueId(base: string, existingIds: Set<string>): string {
  if (!existingIds.has(base)) return base
  let counter = 2
  while (existingIds.has(`${base}-${counter}`)) counter++
  return `${base}-${counter}`
}
