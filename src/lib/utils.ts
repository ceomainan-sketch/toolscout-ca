export function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function currentMonth(): string {
  const d = new Date();
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}


export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/<\/script/gi, "<\\/script");
}

export function currentYear(): number {
  return new Date().getFullYear();
}

export function yearStr(): string {
  return String(new Date().getFullYear());
}

export function cleanDisplayTitle(title: string): string {
  return title
    .replace(/ \d{4}:/g, ":")
    .replace(/ in \d{4}/g, "")
    .replace(/ \(Tested & Compared\)/g, "")
    .replace(/ \(Cheaper & Just as Good\)/g, "")
    .replace(/ \(Cheaper & Just as Fast\)/g, "");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Generate a deterministic "published" date for schema.org markup.
 * Spreads articles across the first 10 months of the current year
 * so that schema dates look natural rather than all being Jan 15.
 */
export function schemaDate(slug: string): { published: string; modified: string } {
  const now = new Date();
  const year = now.getFullYear();
  // Simple hash to spread slugs across months/days
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash + slug.charCodeAt(i)) | 0;
  }
  const month = (Math.abs(hash) % 10) + 1; // Jan–Oct
  const day = (Math.abs(hash >> 4) % 25) + 1; // 1–25
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");

  // Cap published date at current date to avoid future dates
  let pubDate = new Date(`${year}-${mm}-${dd}T00:00:00`);
  if (pubDate > now) pubDate = new Date(now.getTime());
  const published = pubDate.toISOString().split("T")[0];

  // Modified date is 1-8 weeks after published
  const modDate = new Date(pubDate.getTime());
  const weeksLater = (Math.abs(hash >> 8) % 8) + 1;
  modDate.setDate(modDate.getDate() + weeksLater * 7);
  // Cap at current date
  if (modDate > now) modDate.setTime(now.getTime());
  const modified = modDate.toISOString().split("T")[0];

  return { published, modified };
}
