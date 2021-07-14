/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { SubjectpageType } from '../../interfaces';

export interface SubjectpageApiType extends SubjectpageType {
  about: {
    visualElement: {
      type: string;
      url: string;
      alt: string;
      caption: string;
      resource_id: string;
    };
    title: string;
    description: string;
  };
  banner: {
    mobileUrl: string;
    mobileId: number;
    desktopUrl: string;
    desktopId: number;
  };
  editorsChoices: string[];
}

export interface FilmVisualElementType {
  type: string;
  url?: string;
  id?: string;
  alt?: string;
}

export interface FilmFrontpageApiType {
  name: string;
  about: FilmFrontpageAbout[];
  movieThemes: MovieTheme[];
  slideShow: string[];
}

export interface FilmFrontpageAbout {
  title: string;
  description: string;
  visualElement: FilmVisualElementType;
  language: string;
}

export interface MovieTheme {
  name: {
    name: string;
    language: string;
  }[];
  movies: string[];
}

export interface SubjectPagePostDto {
  name: string;
  filters?: string[];
  externalId?: string;
  layout: string;
  twitter?: string;
  facebook?: string;
  banner: {
    mobileImageId?: number;
    desktopImageId: number;
  };
  about: {
    title: string;
    description: string;
    language: string;
    visualElement: {
      type: string;
      id: string;
      alt?: string;
    };
  }[];
  metaDescription: {
    metaDescription: string;
    language: string;
  }[];
  topical?: string;
  mostRead?: string[];
  editorsChoices?: string[];
  latestContent?: string[];
  goTo?: string[];
}

export type SubjectPagePatchDto = Partial<SubjectPagePostDto>;

export interface SubjectPagePatchApiType {
  topical?: string;
  name?: string;
  metaDescription?: {
    metaDescription: string;
    language: string;
  }[];
  mostRead?: string[];
  banner?: {
    mobileImageId?: number;
    desktopImageId: number;
  };
  facebook?: string;
  goTo?: string[];
  twitter?: string;
  layout?: string;
  about?: {
    title: string;
    description: string;
    language: string;
    visualElement: FilmVisualElementType;
  }[];
  latestContent?: string[];
  filters?: string[];
  editorsChoices?: string[];
}
