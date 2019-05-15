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
  const splittedUrl = visualElement.url.split('/');
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
