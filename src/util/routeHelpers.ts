/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from "query-string";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { NDLA_FILM_SUBJECT } from "../constants";

export interface NewlyCreatedLocationState {
  isNewlyCreated?: boolean;
}

export interface CreatingLanguageLocationState {
  isCreatingLanguage?: boolean;
}

const articleTypes: Record<string, string> = {
  "topic-article": "topic-article",
  standard: "learning-resource",
  "frontpage-article": "frontpage-article",
};

export const routes = {
  search: toSearch,
  editArticle: toEditArticle,
  editGenericArticle: toEditGenericArticle,
  editMarkup: toEditMarkup,
  structure: toStructure,
  programme: toProgramme,
  nodeDiff: toNodeDiff,
  learningpath: {
    create: "/learningpath/new",
    edit: toEditLearningpath,
    preview: toPreviewLearningpath,
  },
  updateCodes: "/updateCodes",
  taxonomy: {
    structure: toStructure,
    versions: "/taxonomyVersions",
  },
  notFound: "/404",
  home: "/",
  login: "/login",
  logout: {
    logout: "/logout",
    logoutSession: "/logout/session",
    logoutFederated: "/logout/federated",
  },
  h5p: {
    edit: "/h5p",
  },
  film: {
    edit: toEditNdlaFilm,
  },
  frontpage: {
    create: "/subject-matter/frontpage-article/new",
    edit: toEditFrontPageArticle,
    structure: "/frontpage",
  },
  subjectPage: {
    create: toCreateSubjectpage,
    edit: toEditSubjectpage,
  },
  learningResource: {
    create: "/subject-matter/learning-resource/new",
    edit: toEditLearningResource,
  },
  topic: {
    create: "/subject-matter/topic-article/new",
    edit: toEditTopicArticle,
  },
  gloss: {
    create: "/gloss/new",
    edit: toEditGloss,
  },
  concept: {
    create: "/concept/new",
    edit: toEditConcept,
  },
  audio: {
    create: "/media/audio-upload/new",
    edit: toEditAudio,
  },
  podcast: {
    create: "/media/podcast-upload/new",
    edit: toEditPodcast,
  },
  podcastSeries: {
    create: "/media/podcast-series/new",
    edit: toEditPodcastSeries,
  },
  image: {
    create: "/media/image-upload/new",
    edit: toEditImage,
  },
  preview: {
    draft: toPreviewDraft,
    language: toCompareLanguage,
  },
};

export function toSearch(query: object, type = "content") {
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

export function toEditTopicArticle(id: number, locale: string) {
  return `/subject-matter/topic-article/${id}/edit/${locale}`;
}

export function toEditLearningResource(id: number, locale: string) {
  return `/subject-matter/learning-resource/${id}/edit/${locale}`;
}

export function toEditGenericArticle(articleId: number | string) {
  return `/subject-matter/article/${articleId}`;
}

export function toEditLearningpath(id: number, locale: string) {
  return `/learningpath/${id}/edit/${locale}`;
}

export function toPreviewLearningpath(id: number, locale: string, stepId?: number | string) {
  return `/learningpath/${id}/preview/${locale}${stepId ? `/${stepId}` : ""}`;
}

export function toEditSubjectpage(subjectId: string, locale: string, subjectpageId?: number | string) {
  if (subjectId === NDLA_FILM_SUBJECT) {
    return toEditNdlaFilm(locale);
  }
  return `/subjectpage/${subjectId}/${subjectpageId}/edit/${locale}`;
}

export function toEditNdlaFilm(language?: string) {
  return `/film/${language ? language : "nb"}`;
}

export function toEditConcept(conceptId: number | string, locale?: string) {
  const path = `/concept/${conceptId}/edit`;
  return locale ? `${path}/${locale}` : path;
}

export function toEditGloss(glossId: number | string, locale?: string) {
  const path = `/gloss/${glossId}/edit`;
  return locale ? `${path}/${locale}` : path;
}

export function toEditMarkup(id: number | string, language: string) {
  return `/edit-markup/${id}/${language}`;
}

export function toCreateLearningResource() {
  return "/subject-matter/learning-resource/new";
}

export function toCreateTopicArticle() {
  return "/subject-matter/topic-article/new";
}

export function toCreateFrontPageArticle() {
  return "/subject-matter/frontpage-article/new";
}

export function toEditFrontPageArticle(id: number, locale: string) {
  return `/subject-matter/frontpage-article/${id}/edit/${locale}`;
}

export function toCreateSubjectpage(subjectId: string, locale: string) {
  if (subjectId === NDLA_FILM_SUBJECT) {
    return "/film";
  }
  return `/subjectpage/${subjectId}/new/${locale}`;
}

export function toCreateConcept() {
  return "/concept/new";
}

export function toCreateGloss() {
  return "/gloss/new";
}

export function toLogin() {
  return "/login";
}

export function toLogout() {
  return "/logout";
}

export function toLogoutSession() {
  return "/logout/session";
}

export function toLogoutFederated() {
  return "/logout/federated";
}

export function toCreateAudioFile() {
  return "/media/audio-upload/new";
}

export function toEditAudio(audioId: number | string, language: string) {
  return `/media/audio-upload/${audioId}/edit/${language}`;
}

export function toCreatePodcastFile() {
  return "/media/podcast-upload/new";
}

export function toCreatePodcastSeries() {
  return "/media/podcast-series/new";
}

export function toEditPodcast(audioId: number | string, language: string) {
  return `/media/podcast-upload/${audioId}/edit/${language}`;
}

export function toEditPodcastSeries(seriesId: number | string, language: string) {
  return `/media/podcast-series/${seriesId}/edit/${language}`;
}

export function toCreateImage() {
  return "/media/image-upload/new";
}

export function toEditImage(imageId: number | string, language: string) {
  return `/media/image-upload/${imageId}/edit/${language}`;
}

export function toPreviewDraft(draftId: number, language: string) {
  return `/preview/${draftId}/${language}`;
}

export function toCompareLanguage(draftId: number, language: string) {
  return `/compare/${draftId}/${language}`;
}

export function toStructure(path?: string) {
  if (!path) return "/structure";
  const urnPath = path
    .split("/")
    .slice(1)
    .map((part) => `urn:${part}`)
    .join("/");
  return `/structure/${urnPath}`;
}

export function toProgramme(urn?: string) {
  if (!urn) return "/programme";
  return `/programme/${urn}`;
}

export function toNodeDiff(nodeId: string, originalHash: string, otherHash: string) {
  return `/nodeDiff/${nodeId}?originalHash=${originalHash}&otherHash=${otherHash}`;
}

export function to404() {
  return "/404";
}

export function isLearningpath(path: string | string[]): boolean {
  if (typeof path !== "string") return false;
  return path.includes("learningpath-api");
}

export const toLearningpath = (id: number | string, locale: string) => {
  return `/learningpath/${id}/edit/${locale}`;
};

export const removeLastItemFromUrl = (url: string) =>
  url
    .split("/")
    .splice(0, url.split("/").length - 1)
    .join("/");

export const getPathsFromUrl = (url: string) => {
  return url
    .split("/")
    .filter((item) => item.includes("urn:"))
    .reduce((acc: string[], curr) => [...acc, acc.slice(-1).concat(curr).join("/")], []);
};

export const usePreviousLocation = () => {
  const location = useLocation();
  const locationRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    locationRef.current = location.pathname;
  }, [location]);
  return locationRef.current;
};
