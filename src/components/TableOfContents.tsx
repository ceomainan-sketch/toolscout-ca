function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function TableOfContents({
  sections,
}: {
  sections: { heading: string }[];
}) {
  return (
    <nav className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-3">📖 In This Guide</h2>
      <ol className="space-y-2">
        {sections.map((section, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-gray-400 text-sm font-medium mt-0.5">
              {i + 1}.
            </span>
            <a
              href={`#${slugify(section.heading)}`}
              className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
            >
              {section.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export { slugify };
