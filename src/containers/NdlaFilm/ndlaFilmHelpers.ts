/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FilmFrontPageDTO, MovieThemeDTO, NewOrUpdatedFilmFrontPageDTO } from "@ndla/types-backend/frontpage-api";
import { LocaleType } from "../../interfaces";
import { FilmFormikType, ThemeNames } from "./types";
import { convertVisualElement, getVisualElementId } from "../../util/convertVisualElement";
import { editorValueToPlainText, plainTextToEditorValue } from "../../util/articleContentConverter";
import { isVisualElementSlateElement } from "../../components/SlateEditor/helpers";
import { LOCALE_VALUES } from "../../constants";

export const getInitialValues = (filmFrontpage: FilmFrontPageDTO, selectedLanguage: string): FilmFormikType => {
  const supportedLanguages = filmFrontpage.about.map((about) => about.language);
  const languageAbout = filmFrontpage.about.find((about) => about.language === selectedLanguage);
  const about = languageAbout ?? filmFrontpage.about?.[0];

  const visualElement = about?.visualElement && convertVisualElement(about?.visualElement);

  return {
    name: filmFrontpage.name,
    title: plainTextToEditorValue(about?.title ?? ""),
    description: plainTextToEditorValue(about?.description ?? ""),
    visualElement: visualElement ?? [],
    language: selectedLanguage,
    supportedLanguages,
    slideShow: filmFrontpage.slideShow,
    themes: filmFrontpage.movieThemes,
    article: filmFrontpage.article,
  };
};

export const getNdlaFilmFromSlate = (
  initialFrontpage: FilmFrontPageDTO,
  newFrontpage: FilmFormikType,
  selectedLanguage: string,
): NewOrUpdatedFilmFrontPageDTO => {
  const slateVisualElement = newFrontpage.visualElement?.[0];
  const data = isVisualElementSlateElement(slateVisualElement) ? slateVisualElement.data : undefined;

  const editedAbout = {
    description: editorValueToPlainText(newFrontpage.description),
    language: selectedLanguage,
    title: editorValueToPlainText(newFrontpage.title),
    visualElement: {
      alt: (data && "alt" in data && data.alt) || (data && "caption" in data && data.caption) || "",
      id: (data && "metaData" in data && data.metaData.id) || "",
      type: (data && "resource" in data && data.resource) || "",
    },
  };

  let newLanguage = true;

  const newAbout = initialFrontpage.about.map((about) => {
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
  const newThemes = newFrontpage.themes.map((theme) => {
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
    article: newFrontpage.article,
  };
};

export const getIdFromUrn = (urnId: string) => {
  return parseInt(urnId.replace("urn:article:", ""));
};

export const getUrnFromId = (id: string | number) => {
  return `urn:article:${id}`;
};

export const changeThemeNames = (themes: MovieThemeDTO[], names: ConvertedThemeName[], index: number) => {
  return themes.map((theme, i) => (i === index ? { ...theme, name: names } : theme));
};

export const findName = (
  themeNames: {
    name: string;
    language: string;
  }[],
  language: string,
) => {
  const filteredName = themeNames.filter((name) => name.language === language);
  return filteredName.length > 0 ? filteredName.map((name) => name.name).join() : "";
};

export interface ConvertedThemeName {
  language: LocaleType;
  name: string;
}

export const convertThemeNames = (names: ThemeNames): ConvertedThemeName[] => {
  return LOCALE_VALUES.map((lang) => {
    if (!names[lang]) return null;
    return {
      language: lang,
      name: names[lang],
    };
  }).filter((val) => !!val?.name?.length) as ConvertedThemeName[];
};
