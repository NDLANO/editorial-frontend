import queryString from 'query-string';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import config from '../config';
import { NDLA_FILM_SUBJECT } from '../constants';

const articleTypes: Record<string, string> = {
  'topic-article': 'topic-article',
  standard: 'learning-resource',
};

export function toSearch(query: object, type = 'content') {
  if (query) {
    return `/search/${type}?${queryString.stringify(query)}`;
  }
  return `/search/${type}`;
}

export function toEditArticle(articleId: number | string, articleType: string, locale?: string) {
  const url = articleTypes[articleType] || articleTypes.standard;
  const path = `/subject-matter/${url}/${articleId}/edit`;
  return locale ? `${path}/${locale}` : path;
}

export function toEditSubjectpage(
  subjectId: string,
  locale: string,
  subjectpageId?: number | string,
) {
  if (subjectId === NDLA_FILM_SUBJECT) {
    return toEditNdlaFilm(locale);
  }
  return `/subjectpage/${subjectId}/${subjectpageId}/edit/${locale}`;
}

export function toEditNdlaFilm(language?: string) {
  return `/film/${language ? language : 'nb'}`;
}

export function toEditConcept(conceptId: number, locale: string) {
  return `/concept/${conceptId}/edit/${locale}`;
}

export function toEditMarkup(id: number | string, language: string) {
  return `/edit-markup/${id}/${language}`;
}

export function toCreateLearningResource() {
  return '/subject-matter/learning-resource/new';
}

export function toCreateTopicArticle() {
  return '/subject-matter/topic-article/new';
}

export function toCreateSubjectpage(subjectId: string, locale: string) {
  if (subjectId === NDLA_FILM_SUBJECT) {
    return '/film';
  }
  return `/subjectpage/${subjectId}/new/${locale}`;
}

export function toCreateConcept() {
  return '/concept/new';
}

export function toLogin() {
  return '/login';
}

export function toLogout() {
  return '/logout';
}

export function toLogoutSession() {
  return '/logout/session';
}

export function toLogoutFederated() {
  return '/logout/federated';
}

export function toCreateAudioFile() {
  return '/media/audio-upload/new';
}

export function toEditAudio(audioId: number, language: string) {
  return `/media/audio-upload/${audioId}/edit/${language}`;
}

export function toCreatePodcastFile() {
  return '/media/podcast-upload/new';
}

export function toCreatePodcastSeries() {
  return '/media/podcast-series/new';
}

export function toEditPodcast(audioId: number, language: string) {
  return `/media/podcast-upload/${audioId}/edit/${language}`;
}

export function toEditPodcastSeries(seriesId: number, language: string) {
  return `/media/podcast-series/${seriesId}/edit/${language}`;
}

export function toCreateImage() {
  return '/media/image-upload/new';
}

export function toEditImage(imageId: number | string, language: string) {
  return `/media/image-upload/${imageId}/edit/${language}`;
}

export function toCreateAgreement() {
  return '/agreement/new';
}

export function toEditAgreement(agreementId: number) {
  return `/agreement/${agreementId}/edit`;
}

export function toPreviewDraft(draftId: number, language: string) {
  return `/preview/${draftId}/${language}`;
}

export function toStructure(path: string) {
  const urnPath = path
    .split('/')
    .slice(1)
    .map(part => `urn:${part}`)
    .join('/');
  return `/structure/${urnPath}`;
}

export function to404() {
  return '/404';
}

export function isLearningpath(path: string | string[]): boolean {
  if (typeof path !== 'string') return false;
  return path.includes('learningpath-api');
}

export function getResourceIdFromPath(path?: string): string | undefined {
  if (typeof path !== 'string') return undefined;
  const learningPath = path.match(/learningpaths\/(\d+)/);
  if (learningPath && learningPath[1]) return learningPath[1];
  const resource = path.match(/(resource:[:\da-fA-F-]+)\/?$/);
  return resource ? `urn:${resource[1]}` : '';
}

export function toLearningpathFull(id: number | string, locale: string) {
  return `${config.learningpathFrontendDomain}/${locale}/learningpaths/${id}/first-step`;
}

export const removeLastItemFromUrl = (url: string) =>
  url
    .split('/')
    .splice(0, url.split('/').length - 1)
    .join('/');

export const getPathsFromUrl = (url: string) => {
  return url
    .split('/')
    .filter(item => item.includes('urn:'))
    .reduce(
      (acc: string[], curr) => [
        ...acc,
        acc
          .slice(-1)
          .concat(curr)
          .join('/'),
      ],
      [],
    );
};

export const usePreviousLocation = () => {
  const location = useLocation();
  const locationRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    locationRef.current = location.pathname;
  }, [location]);
  return locationRef.current;
};
