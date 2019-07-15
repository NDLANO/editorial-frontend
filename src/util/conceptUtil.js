import defined from 'defined';
import formatDate from './formatDate';
import { convertFieldWithFallback } from './convertFieldWithFallback';

export const transformConceptFromApiVersion = (concept, locale) => ({
  ...concept,
  title: convertFieldWithFallback(concept, 'title', ''),
  content: convertFieldWithFallback(concept, 'content', ''),
  ...(locale ? { language: locale } : {}),
});
