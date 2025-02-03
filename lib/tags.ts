// lib/tags.ts
export function extractTagsFromTripData(tags: string | string[] | undefined): string[] {
  let allTags: string[] = [];
  if (typeof tags === 'string') {
      allTags = tags.split(' ').map(tag => tag.trim());
  } else if (Array.isArray(tags)) {
      allTags = tags;
  }
  return uniqueStrings(allTags);
}

function uniqueStrings(arr: string[]): string[] {
  return [...new Set(arr.filter(str => str.trim().length > 0))];
}