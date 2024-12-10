/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import {
  IFilmFrontPageDataDTO,
  IMovieThemeDTO,
  INewOrUpdatedFilmFrontPageDataDTO,
  IVisualElementDTO,
} from "@ndla/types-backend/frontpage-api";
import { editorValueToPlainText, plainTextToEditorValue } from "./articleContentConverter";
import { defineTypeOfEmbed, isSlateEmbed } from "../components/SlateEditor/plugins/embed/utils";
import { TYPE_EMBED_BRIGHTCOVE } from "../components/SlateEditor/plugins/video/types";
import { LOCALE_VALUES } from "../constants";
import { FilmFormikType } from "../containers/NdlaFilm/components/NdlaFilmForm";
import { ThemeNames } from "../containers/NdlaFilm/components/ThemeEditor";
import { LocaleType } from "../interfaces";

export const getInitialValues = (filmFrontpage: IFilmFrontPageDataDTO, selectedLanguage: string): FilmFormikType => {
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

export const convertVisualElement = (visualElement: IVisualElementDTO): Descendant[] => {
  const id = getVisualElementId(visualElement);
  if (visualElement.type !== "brightcove") {
    return [
      slatejsx(
        "element",
        {
          type: defineTypeOfEmbed(visualElement.type),
          data: {
            url: visualElement.url,
            resource: visualElement.type,
            resourceId: id,
            alt: visualElement.alt,
            metaData: {
              id: id,
            },
          },
        },
        { text: "" },
      ),
    ];
  }

  const splittedUrl = visualElement.url.split("/");
  const account = splittedUrl[3];
  const player = splittedUrl[4].split("_")[0];

  return [
    slatejsx(
      "element",
      {
        type: TYPE_EMBED_BRIGHTCOVE,
        data: {
          url: visualElement.url,
          resource: visualElement.type,
          resourceId: id,
          caption: visualElement.alt,
          metaData: {
            id: id,
          },
          videoid: id,
          account: account,
          player: player,
        },
      },
      { text: "" },
    ),
  ];
};

const getVisualElementId = (visualElement: IVisualElementDTO): string => {
  const splitter = visualElement.type === "brightcove" ? "=" : "/";
  const splittedUrl = visualElement.url.split(splitter);
  const id = splittedUrl.pop() ?? "";
  return id;
};

export const getNdlaFilmFromSlate = (
  initialFrontpage: IFilmFrontPageDataDTO,
  newFrontpage: FilmFormikType,
  selectedLanguage: string,
): INewOrUpdatedFilmFrontPageDataDTO => {
  const slateVisualElement = newFrontpage.visualElement?.[0];
  const data = isSlateEmbed(slateVisualElement) ? slateVisualElement.data : undefined;

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

export const changeThemeNames = (themes: IMovieThemeDTO[], names: ConvertedThemeName[], index: number) => {
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
