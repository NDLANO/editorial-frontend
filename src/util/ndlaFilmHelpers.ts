/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Value } from 'slate';
import { editorValueToPlainText, plainTextToEditorValue } from './articleContentConverter';
import { LOCALE_VALUES } from '../constants';
import {
  FilmFrontpageAbout,
  FilmFrontpageApiType,
  FilmVisualElementType,
} from '../modules/frontpage/frontpageApiInterfaces';
import { MovieTheme } from '../modules/frontpage/frontpageApiInterfaces';
import { BaseMovie, NdlaEditMovieThemeType } from '../containers/NdlaFilm/NdlaFilmEditor';
import { VisualElement } from '../interfaces';

export interface ThemeNames {
  name: {
    nb: string;
    nn: string;
    en: string;
  };
  warnings: {
    nb: boolean;
    nn: boolean;
    en: boolean;
  };
}

export interface FilmFrontpageFormikType {
  articleType: string;
  name: string;
  title: string;
  description: Value;
  visualElementObject?: FilmVisualElement;
  language: string;
  supportedLanguages: string[];
  slideShow: BaseMovie[];
  themes: NdlaEditMovieThemeType[];
}

export interface FilmVisualElement extends Omit<VisualElement, 'metaData'> {
  metaData: {
    id: string;
  };
}

export const getInitialValues = (
  filmFrontpage: FilmFrontpageApiType,
  slideshowMovies: BaseMovie[],
  themes: NdlaEditMovieThemeType[],
  language: string,
): FilmFrontpageFormikType => {
  const supportedLanguages = filmFrontpage.about.map(about => about.language);
  let selectedLanguage = language;
  if (!supportedLanguages.find(lan => lan === language)) {
    selectedLanguage = supportedLanguages[0];
  }
  const aboutInSelectedLanguage = filmFrontpage.about.find(
    about => about.language === selectedLanguage,
  );
  const visualElement = aboutInSelectedLanguage
    ? convertVisualElement(aboutInSelectedLanguage.visualElement)
    : undefined;
  return {
    articleType: 'subjectpage',
    name: filmFrontpage.name,
    title: aboutInSelectedLanguage?.title!,
    description: aboutInSelectedLanguage
      ? plainTextToEditorValue(aboutInSelectedLanguage.description!)
      : '',
    visualElementObject: visualElement,
    language: language,
    supportedLanguages: supportedLanguages,
    slideShow: slideshowMovies,
    themes: themes,
  };
};

const convertVisualElement = (visualElement: FilmVisualElementType) => {
  const id = getVisualElementId(visualElement);
  let newVisualElement: FilmVisualElement = {
    url: visualElement.url,
    resource: visualElement.type,
    resource_id: id,
    ...(visualElement.type === 'brightcove'
      ? { caption: visualElement.alt }
      : { alt: visualElement.alt }),
    metaData: {
      id: id,
    },
  };
  if (visualElement.type === 'brightcove' && visualElement.url) {
    const splittedUrl = visualElement.url.split('/');
    const account = splittedUrl[3];
    const player = splittedUrl[4].split('_')[0];
    newVisualElement = {
      ...newVisualElement,
      videoid: id,
      account: account,
      player: player,
    };
  }
  return newVisualElement;
};

const getVisualElementId = (visualElement: FilmVisualElementType) => {
  const splitter = visualElement.type === 'brightcove' ? '=' : '/';
  const splittedUrl = visualElement.url!.split(splitter);
  return splittedUrl.pop()!;
};

export const getNdlaFilmFromSlate = (
  oldFilmFrontpage: FilmFrontpageApiType,
  newFilmFrontpage: FilmFrontpageFormikType,
  selectedLanguage: string,
): FilmFrontpageApiType => {
  const editedAbout: FilmFrontpageAbout = {
    description: editorValueToPlainText(newFilmFrontpage.description),
    language: selectedLanguage,
    title: newFilmFrontpage.title ?? '',
    visualElement: {
      alt: newFilmFrontpage?.visualElementObject?.caption,
      id: newFilmFrontpage?.visualElementObject?.metaData.id,
      type: newFilmFrontpage!.visualElementObject!.resource,
    },
  };
  let newLanguage = true;
  const newAbout = oldFilmFrontpage.about.map(about => {
    if (about.language === selectedLanguage) {
      newLanguage = false;
      return editedAbout;
    }
    return {
      ...about,
      visualElement: {
        alt: about.visualElement.alt,
        type: about.visualElement.type,
        id: getVisualElementId(about.visualElement),
      },
    };
  });
  if (newLanguage) {
    newAbout.push(editedAbout);
  }
  const newSlideShow = newFilmFrontpage.slideShow.map(movie => getUrnFromId(movie.id));
  const newThemes = newFilmFrontpage.themes.map(theme => {
    return {
      name: theme.name,
      movies: theme.movies.map(movie => getUrnFromId(movie.id)),
    };
  });
  return {
    name: newFilmFrontpage.name,
    about: newAbout,
    movieThemes: newThemes,
    slideShow: newSlideShow,
  };
};

export const getIdFromUrn = (urnId: string) => {
  return parseInt(urnId.replace('urn:article:', ''));
};

export const getUrnFromId = (id: string | number) => {
  return `urn:article:${id}`;
};

export const addMovieToTheme = (themes: MovieTheme[], index: number, newMovie: BaseMovie) => {
  return themes.map((theme, i) =>
    i === index ? { ...theme, movies: [...theme.movies, newMovie] } : theme,
  );
};

export const changeMoviesInTheme = (themes: MovieTheme[], index: number, movies: string[]) => {
  return themes.map((theme, i) => (i === index ? { ...theme, movies } : theme));
};

export const changeThemeNames = (
  themes: MovieTheme[],
  names: { name: string; language: string }[],
  index: number,
) => {
  return themes.map((theme, i) => (i === index ? { ...theme, name: names } : theme));
};

export const findName = (themeNames: { name: string; language: string }[], language: string) => {
  const filteredName = themeNames.filter(name => name.language === language);
  return filteredName.length > 0 ? filteredName.map(name => name.name).join() : '';
};

export const convertThemeNames = (names: ThemeNames) => {
  return LOCALE_VALUES.map(lang => ({
    language: lang,
    name: names.name[lang],
  }));
};
