/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { editorValueToPlainText, plainTextToEditorValue } from './articleContentConverter';
import { LOCALE_VALUES } from '../constants';
import {
  ContentResultType,
  LocaleType,
  NdlaFilmApiType,
  NdlaFilmVisualElement,
} from '../interfaces';
import { NdlaFilmThemesEditType } from '../interfaces';
import { NdlaFilmFormikType } from '../containers/NdlaFilm/components/NdlaFilmForm';
import { ThemeNames } from '../containers/NdlaFilm/components/ThemeEditor';
import { NewOrUpdatedFilmFrontPageData } from '../modules/frontpage/frontpageApiInterfaces';

export const getInitialValues = (
  filmFrontpage: NdlaFilmApiType,
  slideshowMovies: ContentResultType[],
  themes: NdlaFilmThemesEditType[],
  language: string,
): NdlaFilmFormikType => {
  const supportedLanguages = filmFrontpage.about.map(about => about.language);
  let selectedLanguage = language;
  if (!supportedLanguages.find(lan => lan === language)) {
    selectedLanguage = supportedLanguages[0];
  }
  const aboutInSelectedLanguage = filmFrontpage.about.find(
    about => about.language === selectedLanguage,
  );
  const visualElement =
    aboutInSelectedLanguage?.visualElement &&
    convertVisualElement(aboutInSelectedLanguage?.visualElement);

  return {
    articleType: 'subjectpage',
    name: filmFrontpage.name,
    title: aboutInSelectedLanguage?.title,
    description: plainTextToEditorValue(aboutInSelectedLanguage?.description || ''),
    visualElementObject: visualElement,
    language: language,
    supportedLanguages: supportedLanguages,
    slideShow: slideshowMovies,
    themes: themes,
  };
};

export interface ConvertedNdlaFilmVisualElement {
  account?: string;
  alt?: string;
  caption?: string;
  metaData: { id: string };
  player?: string;
  resource: string;
  resource_id: string;
  url: string;
  videoid?: string;
}

const convertVisualElement = (
  visualElement: NdlaFilmVisualElement,
): ConvertedNdlaFilmVisualElement => {
  const id = getVisualElementId(visualElement);
  if (visualElement.type !== 'brightcove') {
    return {
      url: visualElement.url,
      resource: visualElement.type,
      resource_id: id,
      alt: visualElement.alt,
      metaData: {
        id: id,
      },
    };
  }

  const splittedUrl = visualElement.url.split('/');
  const account = splittedUrl[3];
  const player = splittedUrl[4].split('_')[0];
  return {
    url: visualElement.url,
    resource: visualElement.type,
    resource_id: id,
    caption: visualElement.alt,
    metaData: {
      id: id,
    },
    videoid: id,
    account: account,
    player: player,
  };
};

const getVisualElementId = (visualElement: NdlaFilmVisualElement): string => {
  const splitter = visualElement.type === 'brightcove' ? '=' : '/';
  const splittedUrl = visualElement.url.split(splitter);
  const id = splittedUrl.pop() ?? '';
  return id;
};

export const getNdlaFilmFromSlate = (
  oldFilmFrontpage: NdlaFilmApiType,
  newFilmFrontpage: NdlaFilmFormikType,
  selectedLanguage: string,
): NewOrUpdatedFilmFrontPageData => {
  const editedAbout = {
    description: editorValueToPlainText(newFilmFrontpage.description),
    language: selectedLanguage,
    title: newFilmFrontpage.title ?? '',
    visualElement: {
      alt:
        newFilmFrontpage.visualElementObject?.alt || newFilmFrontpage.visualElementObject?.caption,
      id: newFilmFrontpage.visualElementObject?.metaData.id ?? '',
      type: newFilmFrontpage.visualElementObject?.resource ?? '',
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
      movies: theme.movies.map((movie: ContentResultType) => getUrnFromId(movie.id)),
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

export const addMovieToTheme = (
  themes: NdlaFilmThemesEditType[],
  index: number,
  newMovie: ContentResultType,
) => {
  return themes.map((theme, i) =>
    i === index ? { ...theme, movies: [...theme.movies, newMovie] } : theme,
  );
};

export const changeMoviesInTheme = (
  themes: NdlaFilmThemesEditType[],
  index: number,
  movies: any,
) => {
  return themes.map((theme, i) => (i === index ? { ...theme, movies } : theme));
};

export const changeThemeNames = (
  themes: NdlaFilmThemesEditType[],
  names: ConvertedThemeName[],
  index: number,
) => {
  return themes.map((theme, i) => (i === index ? { ...theme, name: names } : theme));
};

export const findName = (
  themeNames: {
    name: string;
    language: string;
  }[],
  language: string,
) => {
  const filteredName = themeNames.filter(name => name.language === language);
  return filteredName.length > 0 ? filteredName.map(name => name.name).join() : '';
};

export interface ConvertedThemeName {
  language: LocaleType;
  name: string;
}

export const convertThemeNames = (names: ThemeNames): ConvertedThemeName[] => {
  return LOCALE_VALUES.map(lang => ({
    language: lang,
    name: names.name[lang],
  }));
};
