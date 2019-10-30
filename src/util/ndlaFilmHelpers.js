/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const restructureFilmFrontpage = filmFrontpage => {
  const newAbout = filmFrontpage.about.map(about =>
    convertVisualElement(about),
  );
  return { ...filmFrontpage, about: newAbout };
};

const convertVisualElement = about => {
  const { visualElement } = about;
  const splitter = visualElement.type === 'brightcove' ? '=' : '/';
  const splittedUrl = visualElement.url.split(splitter);
  const lastElement = splittedUrl.pop();
  const newVisualElement = {
    alt: visualElement.alt,
    type: visualElement.type,
    id: lastElement,
  };

  return { ...about, visualElement: newVisualElement };
};

export const getIdFromUrn = urnId => {
  return urnId.replace('urn:article:', '');
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
  return themes.map((theme, i) =>
    i === index ? { ...theme, name: names } : theme,
  );
};

export const findName = (themeNames, language) => {
  const filteredName = themeNames.filter(name => name.language === language);
  return filteredName.length > 0
    ? filteredName.map(name => name.name).join()
    : '';
};

export const convertThemeNames = names => {
  return ['nb', 'nn', 'en'].map(lang => ({
    language: lang,
    name: names.name[lang],
  }));
};
