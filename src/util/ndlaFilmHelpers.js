/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { editorValueToPlainText, plainTextToEditorValue } from './articleContentConverter';
import { LOCALE_VALUES } from '../constants';

export const getInitialValues = (filmFrontpage, slideshowMovies, themes, language) => {
  const supportedLanguages = filmFrontpage.about.map(about => about.language);
  let selectedLanguage = language;
  if (!supportedLanguages.find(lan => lan === language)) {
    selectedLanguage = supportedLanguages[0];
  }
  const aboutInSelectedLanguage = filmFrontpage.about.find(
    about => about.language === selectedLanguage,
  );
  const visualElement = convertVisualElement(aboutInSelectedLanguage.visualElement);
  return {
    articleType: 'subjectpage',
    name: filmFrontpage.name,
    title: aboutInSelectedLanguage.title,
    description: plainTextToEditorValue(aboutInSelectedLanguage.description),
    visualElement: visualElement,
    language: language,
    supportedLanguages: supportedLanguages,
    slideShow: slideshowMovies,
    themes: themes,
  };
};

const convertVisualElement = visualElement => {
  const id = getVisualElementId(visualElement);
  let newVisualElement = {
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
  if (visualElement.type === 'brightcove') {
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

const getVisualElementId = visualElement => {
  const splitter = visualElement.type === 'brightcove' ? '=' : '/';
  const splittedUrl = visualElement.url.split(splitter);
  return splittedUrl.pop();
};

export const getNdlaFilmFromSlate = (oldFilmFrontpage, newFilmFrontpage, selectedLanguage) => {
  const editedAbout = {
    description: editorValueToPlainText(newFilmFrontpage.description),
    language: selectedLanguage,
    title: newFilmFrontpage.title,
    visualElement: {
      alt: newFilmFrontpage.visualElement.alt || newFilmFrontpage.visualElement.caption,
      id: newFilmFrontpage.visualElement.metaData.id,
      type: newFilmFrontpage.visualElement.resource,
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
        alt: about.visualElement.alt || about.visualElement.caption,
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

export const getIdFromUrn = urnId => {
  return parseInt(urnId.replace('urn:article:', ''));
};

export const getUrnFromId = id => {
  return `urn:article:${id}`;
};

export const addMovieToTheme = (themes, index, newMovie) => {
  return themes.map((theme, i) =>
    i === index ? { ...theme, movies: [...theme.movies, newMovie] } : theme,
  );
};

export const changeMoviesInTheme = (themes, index, movies) => {
  return themes.map((theme, i) => (i === index ? { ...theme, movies } : theme));
};

export const changeThemeNames = (themes, names, index) => {
  return themes.map((theme, i) => (i === index ? { ...theme, name: names } : theme));
};

export const findName = (themeNames, language) => {
  const filteredName = themeNames.filter(name => name.language === language);
  return filteredName.length > 0 ? filteredName.map(name => name.name).join() : '';
};

export const convertThemeNames = names => {
  return LOCALE_VALUES.map(lang => ({
    language: lang,
    name: names.name[lang],
  }));
};
