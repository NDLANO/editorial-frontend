/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FastField, FieldProps, useField } from "formik";
import { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2, IconButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { Pencil } from "@ndla/icons/action";
import { ChevronUp, ChevronDown } from "@ndla/icons/common";
import { DeleteForever } from "@ndla/icons/editor";
import { IMovieTheme } from "@ndla/types-backend/frontpage-api";
import { ThemeMovies } from "./ThemeMovies";
import ThemeNameModal from "./ThemeNameModal";
import FieldHeader from "../../../components/Field/FieldHeader";
import { LocaleType } from "../../../interfaces";
import { findName, convertThemeNames, changeThemeNames } from "../../../util/ndlaFilmHelpers";

interface Props {
  selectedLanguage: string;
}

export type ThemeNames = Partial<Record<LocaleType, string>>;

const rearrangeTheme = (themes: IMovieTheme[], index: number, desiredNewIndex: number) => {
  return themes.map((theme, i) => {
    if (i === index) {
      return themes[desiredNewIndex];
    } else if (i === desiredNewIndex) {
      return themes[index];
    }
    return theme;
  });
};

const ThemeEditorField = ({ selectedLanguage }: Props) => {
  const { t } = useTranslation();
  const [field] = useField<IMovieTheme[]>("themes");
  const themes = field.value;

  return (
    <FastField name="themes">
      {({ field, form }: FieldProps<IMovieTheme[]>) => (
        <>
          <ThemeNameModal
            onSaveTheme={(theme: ThemeNames) => {
              const newTheme = { name: convertThemeNames(theme), movies: [] };
              form.setFieldValue(field.name, [...field.value, newTheme]);
            }}
            createTheme={true}
            activateButton={<ButtonV2 data-testid="add-theme-modal">{t("ndlaFilm.editor.createGroup")}</ButtonV2>}
            messages={{
              save: t("ndlaFilm.editor.createThemeGroup"),
              cancel: t("ndlaFilm.editor.cancel"),
              title: t("ndlaFilm.editor.newGroupTitle"),
            }}
          />
          {field.value.map((theme, index) => {
            return (
              <StyledThemeWrapper key={findName(theme.name, "nb")}>
                <FieldHeader
                  title={findName(theme.name, selectedLanguage)}
                  subTitle={theme.name
                    .filter((name) => name.language !== selectedLanguage)
                    .map((name) => ` | ${name.name}`)
                    .join("")}
                >
                  <ThemeNameModal
                    onSaveTheme={(theme: ThemeNames) => {
                      const newThemeNames = convertThemeNames(theme);
                      const temp = changeThemeNames(themes.slice(), newThemeNames, index);
                      form.setFieldValue(field.name, temp);
                    }}
                    initialTheme={{
                      nb: findName(theme.name, "nb"),
                      nn: findName(theme.name, "nn"),
                      en: findName(theme.name, "en"),
                    }}
                    activateButton={
                      <IconButtonV2
                        aria-label={t("ndlaFilm.editor.editMovieGroupName")}
                        title={t("ndlaFilm.editor.editMovieGroupName")}
                        variant="ghost"
                        colorTheme="lighter"
                      >
                        <Pencil />
                      </IconButtonV2>
                    }
                    messages={{
                      save: t("ndlaFilm.editor.saveNameChanges"),
                      cancel: t("ndlaFilm.editor.cancel"),
                      title: t("ndlaFilm.editor.editGroupTitle"),
                    }}
                  />
                  <IconButtonV2
                    aria-label={t("ndlaFilm.editor.deleteMovieGroup")}
                    variant="ghost"
                    colorTheme="danger"
                    onClick={() => {
                      const filtered = themes.filter((_, i) => i !== index);
                      form.setFieldValue(field.name, filtered);
                    }}
                    data-testid={"deleteThemeButton"}
                    title={t("ndlaFilm.editor.deleteMovieGroup", {
                      name: theme.name.find((name) => name.language === selectedLanguage)?.name || "",
                    })}
                  >
                    <DeleteForever />
                  </IconButtonV2>
                  <IconButtonV2
                    aria-label={t("ndlaFilm.editor.moveMovieGroupUp")}
                    variant="ghost"
                    colorTheme="lighter"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      const desiredNewIndex = index - 1;
                      if (desiredNewIndex >= 0 && field.value.length > desiredNewIndex) {
                        const temp = rearrangeTheme(field.value.slice(), index, desiredNewIndex);
                        form.setFieldValue(field.name, temp);
                      }
                      e.preventDefault();
                    }}
                    title={t("ndlaFilm.editor.moveMovieGroupUp")}
                  >
                    <ChevronUp />
                  </IconButtonV2>
                  <IconButtonV2
                    aria-label={t("ndlaFilm.editor.moveMovieGroupDown")}
                    variant="ghost"
                    colorTheme="lighter"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      const desiredNewIndex = index + 1;
                      if (desiredNewIndex >= 0 && field.value.length > desiredNewIndex) {
                        const temp = rearrangeTheme(field.value.slice(), index, desiredNewIndex);
                        form.setFieldValue(field.name, temp);
                      }
                      e.preventDefault();
                    }}
                    title={t("ndlaFilm.editor.moveMovieGroupDown")}
                  >
                    <ChevronDown />
                  </IconButtonV2>
                </FieldHeader>
                <ThemeMovies
                  movies={theme.movies}
                  onMoviesUpdated={(movies) => {
                    const newThemes = themes.map((theme, i) => (i === index ? { ...theme, movies } : theme));
                    form.setFieldValue(field.name, newThemes);
                  }}
                  placeholder={t("ndlaFilm.editor.addMovieToGroup", {
                    name: findName(theme.name, selectedLanguage),
                  })}
                />
              </StyledThemeWrapper>
            );
          })}
        </>
      )}
    </FastField>
  );
};

const StyledThemeWrapper = styled("div")`
  margin-bottom: ${spacing.large};
`;

export default ThemeEditorField;
