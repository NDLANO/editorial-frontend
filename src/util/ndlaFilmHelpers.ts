/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Element } from 'slate';
import { jsx } from 'slate-hyperscript';
import {
  IFilmFrontPageData,
  IMovieTheme,
  INewOrUpdatedFilmFrontPageData,
  IVisualElement,
} from '@ndla/types-frontpage-api';
import { editorValueToPlainText, plainTextToEditorValue } from './articleContentConverter';
import { LOCALE_VALUES } from '../constants';
import { ContentResultType, LocaleType } from '../interfaces';
import { FilmFormikType } from '../containers/NdlaFilm/components/NdlaFilmForm';
import { ThemeNames } from '../containers/NdlaFilm/components/ThemeEditor';
import { TYPE_EMBED } from '../components/SlateEditor/plugins/embed';

export const getInitialValues = (
  filmFrontpage: IFilmFrontPageData,
  selectedLanguage: string,
): FilmFormikType => {
  const supportedLanguages = filmFrontpage.about.map(about => about.language);
  const languageAbout = filmFrontpage.about.find(about => about.language === selectedLanguage);
  const about = languageAbout ?? filmFrontpage.about?.[0];

  const visualElement = about?.visualElement && convertVisualElement(about?.visualElement);
  return {
    articleType: 'subjectpage',
    name: filmFrontpage.name,
    title: about?.title,
    description: plainTextToEditorValue(about?.description ?? ''),
    visualElement: visualElement ?? [],
    language: selectedLanguage,
    supportedLanguages,
    slideShow: filmFrontpage.slideShow,
    themes: filmFrontpage.movieThemes,
  };
};

export const convertVisualElement = (visualElement: IVisualElement): Descendant[] => {
  const id = getVisualElementId(visualElement);
  if (visualElement.type !== 'brightcove') {
    return [
      jsx(
        'element',
        {
          type: TYPE_EMBED,
          data: {
            url: visualElement.url,
            resource: visualElement.type,
            resource_id: id,
            alt: visualElement.alt,
            metaData: {
              id: id,
            },
          },
        },
        { text: '' },
      ),
    ];
  }

  const splittedUrl = visualElement.url.split('/');
  const account = splittedUrl[3];
  const player = splittedUrl[4].split('_')[0];

  return [
    jsx(
      'element',
      {
        type: TYPE_EMBED,
        data: {
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
        },
      },
      { text: '' },
    ),
  ];
};

const getVisualElementId = (visualElement: IVisualElement): string => {
  const splitter = visualElement.type === 'brightcove' ? '=' : '/';
  const splittedUrl = visualElement.url.split(splitter);
  const id = splittedUrl.pop() ?? '';
  return id;
};

export const getNdlaFilmFromSlate = (
  initialFrontpage: IFilmFrontPageData,
  newFrontpage: FilmFormikType,
  selectedLanguage: string,
): INewOrUpdatedFilmFrontPageData => {
  const slateVisualElement = newFrontpage.visualElement?.[0];
  const data =
    Element.isElement(slateVisualElement) && slateVisualElement.type === TYPE_EMBED
      ? slateVisualElement.data
      : undefined;

  const editedAbout = {
    description: editorValueToPlainText(newFrontpage.description),
    language: selectedLanguage,
    title: newFrontpage.title ?? '',
    visualElement: {
      alt: (data && 'alt' in data && data.alt) || (data && 'caption' in data && data.caption) || '',
      id: (data && 'metaData' in data && data.metaData.id) || '',
      type: (data && 'resource' in data && data.resource) || '',
    },
  };

  let newLanguage = true;

  const newAbout = initialFrontpage.about.map(about => {
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
  const newSlideShow = newFrontpage.slideShow;
  const newThemes = newFrontpage.themes.map(theme => {
    return {
      name: theme.name,
      movies: theme.movies,
    };
  });
  return {
    name: newFrontpage.name,
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
  themes: IMovieTheme[],
  index: number,
  newMovie: ContentResultType,
) => {
  return themes.map((theme, i) =>
    i === index ? { ...theme, movies: [...theme.movies, newMovie] } : theme,
  );
};

export const changeThemeNames = (
  themes: IMovieTheme[],
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
