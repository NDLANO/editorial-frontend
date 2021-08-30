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

interface NewOrUpdatedMovieTheme {
  name: { name: string; language: string }[];
  movies: string[];
}

interface NewOrUpdatedAboutSubject {
  title: string;
  description: string;
  language: string;
  visualElement: NewOrUpdatedVisualElement;
}

export interface NewOrUpdatedFilmFrontPageData {
  name: string;
  about: NewOrUpdatedAboutSubject[];
  movieThemes: NewOrUpdatedMovieTheme[];
  slideShow: string[];
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

export type UpdatedSubjectFrontPageData = Partial<NewSubjectFrontPageData>;
