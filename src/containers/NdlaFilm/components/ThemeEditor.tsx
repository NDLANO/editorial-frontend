/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField, useFormikContext } from "formik";
import { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2, IconButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { FieldHeader } from "@ndla/forms";
import { Pencil } from "@ndla/icons/action";
import { ChevronUp, ChevronDown } from "@ndla/icons/common";
import { DeleteForever } from "@ndla/icons/editor";
import { IMovieTheme } from "@ndla/types-backend/frontpage-api";
import { ThemeMovies } from "./ThemeMovies";
import ThemeNameModal from "./ThemeNameModal";
import { LocaleType } from "../../../interfaces";
import { findName, convertThemeNames, changeThemeNames } from "../../../util/ndlaFilmHelpers";

interface Props {
  onUpdateMovieTheme: Function;
  selectedLanguage: string;
}

export type ThemeNames = Partial<Record<LocaleType, string>>;

const ThemeEditor = ({ onUpdateMovieTheme, selectedLanguage }: Props) => {
  const { t } = useTranslation();
  const form = useFormikContext();
  const [field] = useField<IMovieTheme[]>("themes");
  const themes = field.value;

  const onAddMovieToTheme = (movies: string[], index: number) => {
    const newThemes = themes.map((theme, i) => (i === index ? { ...theme, movies } : theme));
    onUpdateMovieTheme(field, form, newThemes);
  };

  const onAddTheme = (theme: ThemeNames) => {
    const newTheme = { name: convertThemeNames(theme), movies: [] };
    onUpdateMovieTheme(field, form, [...themes, newTheme]);
  };

  const onDeleteTheme = (index: number) => {
    const temp = themes.filter((_, i) => i !== index);
    onUpdateMovieTheme(field, form, temp);
  };

  const onMoveTheme = (index: number, direction: number) => {
    const desiredNewIndex = index + direction;
    if (desiredNewIndex >= 0 && themes.length > desiredNewIndex) {
      const temp = rearrangeTheme(themes.slice(), index, desiredNewIndex);
      onUpdateMovieTheme(field, form, temp);
    }
  };

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

  const onSaveThemeName = (newNames: ThemeNames, index: number) => {
    const newThemeNames = convertThemeNames(newNames);
    const temp = changeThemeNames(themes.slice(), newThemeNames, index);
    onUpdateMovieTheme(field, form, temp);
  };

  return (
    <>
      <ThemeNameModal
        onSaveTheme={onAddTheme}
        createTheme={true}
        activateButton={<ButtonV2 data-testid="add-theme-modal">Lag ny gruppe</ButtonV2>}
        messages={{
          save: t("ndlaFilm.editor.createThemeGroup"),
          cancel: t("ndlaFilm.editor.cancel"),
          title: t("ndlaFilm.editor.newGroupTitle"),
        }}
      />
      {themes.map((theme, index) => {
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
                onSaveTheme={(theme) => onSaveThemeName(theme, index)}
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
                onClick={() => onDeleteTheme(index)}
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
                  onMoveTheme(index, -1);
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
                  onMoveTheme(index, 1);
                  e.preventDefault();
                }}
                title={t("ndlaFilm.editor.moveMovieGroupDown")}
              >
                <ChevronDown />
              </IconButtonV2>
            </FieldHeader>
            <ThemeMovies
              movies={theme.movies}
              onMoviesUpdated={(movies) => onAddMovieToTheme(movies, index)}
              placeholder={t("ndlaFilm.editor.addMovieToGroup", {
                name: findName(theme.name, selectedLanguage),
              })}
            />
          </StyledThemeWrapper>
        );
      })}
    </>
  );
};

const StyledThemeWrapper = styled("div")`
  margin-bottom: ${spacing.large};
`;

export default ThemeEditor;
