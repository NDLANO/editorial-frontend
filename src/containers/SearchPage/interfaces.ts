export const SearchTypeValues = ['content', 'audio', 'image', 'concept', 'podcast-series'] as const;
export type SearchType = typeof SearchTypeValues[number];
