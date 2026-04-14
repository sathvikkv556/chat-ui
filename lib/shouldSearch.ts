export function shouldUseSearch(query: string) {
  const keywords = [
    "latest",
    "today",
    "news",
    "current",
    "now",
    "recent",
    "2025",
    "2026",
  ];

  return keywords.some((word) =>
    query.toLowerCase().includes(word)
  );
}