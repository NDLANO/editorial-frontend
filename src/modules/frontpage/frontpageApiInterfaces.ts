/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
interface NewOrUpdatedVisualElement {
  type: string;
  id: string;
  alt?: string;
}

export interface FilmFrontpageApiType {
  name: string;
  about: AboutFilmApiType[];
  movieThemes: MovieThemeApiType[];
  slideShow: string[];
}

export interface MovieThemeApiType {
  name: {
    name: string;
    language: string;
  }[];
  movies: string[];
}

export interface FilmFrontpagePostPatchType extends Omit<FilmFrontpageApiType, 'about'> {
  about: AboutFilmPostPatchType[];
}

interface AboutFilmPostPatchType extends Omit<AboutFilmApiType, 'visualElement'> {
  visualElement: FilmVisualElementPostPatchType;
}

export interface AboutFilmApiType {
  title: string;
  description: string;
  visualElement: FilmVisualElementApiType;
  language: string;
}

interface FilmVisualElementPostPatchType extends Omit<FilmVisualElementApiType, 'url'> {
  id: string;
}

export interface FilmVisualElementApiType {
  type: string;
  alt: string;
  url: string;
}

interface NewOrUpdatedAboutSubject {
  title: string;
  description: string;
  language: string;
  visualElement: NewOrUpdatedVisualElement;
}

interface NewOrUpdatedMetaDescription {
  metaDescription: String;
  language: String;
}

interface NewOrUpdatedBannerImage {
  mobileImageId?: number;
  desktopImageId?: number;
}

export interface NewSubjectFrontPageData {
  name: string;
  filters?: string[];
  externalId?: string;
  layout: string;
  twitter?: string;
  facebook?: string;
  banner: NewOrUpdatedBannerImage;
  about: NewOrUpdatedAboutSubject[];
  metaDescription: NewOrUpdatedMetaDescription[];
  topical?: string;
  mostRead?: string[];
  editorsChoices?: string[];
  latestContent?: string[];
  goTo?: string[];
}

export interface SubjectpageApiType {
  id: number;
  name: string;
  layout: string;
  twitter?: string;
  facebook?: string;
  banner: {
    mobileUrl?: string;
    mobileId?: number;
    desktopUrl: string;
    desktopId: number;
  };
  about?: {
    title: string;
    description: string;
    visualElement: {
      type: string;
      url: string;
      alt?: string;
    };
  };
  metaDescription?: string;
  topical?: string;
  mostRead: string[];
  editorsChoices: string[];
  latestContent?: string[];
  goTo: string[];
  supportedLanguages: string[];
}

export type UpdatedSubjectFrontPageData = Partial<NewSubjectFrontPageData> & {
  id: string | number;
};
