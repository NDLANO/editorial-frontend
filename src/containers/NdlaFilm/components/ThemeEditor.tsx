/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { DeleteBinLine, PencilFill, ArrowUpShortLine, ArrowDownShortLine } from "@ndla/icons";
import { Button, Heading, IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IMovieThemeDTO } from "@ndla/types-backend/frontpage-api";
import { ThemeMovies } from "./ThemeMovies";
import ThemeNameDialog from "./ThemeNameDialog";
import { FormContent } from "../../../components/FormikForm";
import { LocaleType } from "../../../interfaces";
import { findName, convertThemeNames, changeThemeNames } from "../../../util/ndlaFilmHelpers";

const TitleActionRow = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
  },
});

const StyledButton = styled(Button, {
  base: {
    alignSelf: "flex-start",
  },
});

interface Props {
  selectedLanguage: string;
}

export type ThemeNames = Partial<Record<LocaleType, string>>;

const ThemeEditor = ({ selectedLanguage }: Props) => {
  const { t } = useTranslation();
  const [field, , helpers] = useField<IMovieThemeDTO[]>("themes");

  const onAddMovieToTheme = (movies: string[], index: number) => {
    const newThemes = field.value.map((theme, i) => (i === index ? { ...theme, movies } : theme));
    helpers.setValue(newThemes);
  };

  const onAddTheme = (theme: ThemeNames) => {
    const newTheme = { name: convertThemeNames(theme), movies: [] };
    helpers.setValue([...field.value, newTheme]);
  };

  const onDeleteTheme = (index: number) => {
    const temp = field.value.filter((_, i) => i !== index);
    helpers.setValue(temp);
  };

  const onMoveTheme = (index: number, direction: number) => {
    const desiredNewIndex = index + direction;
    if (desiredNewIndex >= 0 && field.value.length > desiredNewIndex) {
      const temp = rearrangeTheme(field.value.slice(), index, desiredNewIndex);
      helpers.setValue(temp);
    }
  };

  const rearrangeTheme = (themes: IMovieThemeDTO[], index: number, desiredNewIndex: number) => {
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
    const temp = changeThemeNames(field.value.slice(), newThemeNames, index);
    helpers.setValue(temp);
  };

  return (
    <FormContent>
      <ThemeNameDialog
        onSaveTheme={onAddTheme}
        createTheme={true}
        activateButton={<StyledButton data-testid="add-theme-dialog">{t("ndlaFilm.editor.createGroup")}</StyledButton>}
        messages={{
          save: t("ndlaFilm.editor.createThemeGroup"),
          cancel: t("ndlaFilm.editor.cancel"),
          title: t("ndlaFilm.editor.newGroupTitle"),
        }}
      />
      {field.value.map((theme, index) => (
        <div key={findName(theme.name, "nb")}>
          <TitleActionRow>
            <Heading asChild consumeCss textStyle="title.medium">
              <h3>
                {theme.name.map((name, index, arr) => {
                  const isLast = index === arr.length - 1;
                  return `${name.name} ${isLast ? "" : " | "}`;
                })}
              </h3>
            </Heading>
            <div>
              <ThemeNameDialog
                onSaveTheme={(theme) => onSaveThemeName(theme, index)}
                initialTheme={{
                  nb: findName(theme.name, "nb"),
                  nn: findName(theme.name, "nn"),
                  en: findName(theme.name, "en"),
                }}
                activateButton={
                  <IconButton
                    size="small"
                    variant="clear"
                    aria-label={t("ndlaFilm.editor.editMovieGroupName")}
                    title={t("ndlaFilm.editor.editMovieGroupName")}
                  >
                    <PencilFill />
                  </IconButton>
                }
                messages={{
                  save: t("ndlaFilm.editor.saveNameChanges"),
                  cancel: t("ndlaFilm.editor.cancel"),
                  title: t("ndlaFilm.editor.editGroupTitle"),
                }}
              />
              <IconButton
                size="small"
                variant="clear"
                aria-label={t("ndlaFilm.editor.deleteMovieGroup")}
                onClick={() => onDeleteTheme(index)}
                data-testid="deleteThemeButton"
                title={t("ndlaFilm.editor.deleteMovieGroup", {
                  name: theme.name.find((name) => name.language === selectedLanguage)?.name || "",
                })}
              >
                <DeleteBinLine />
              </IconButton>
              <IconButton
                variant="clear"
                size="small"
                aria-label={t("ndlaFilm.editor.moveMovieGroupUp")}
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  onMoveTheme(index, -1);
                  e.preventDefault();
                }}
                title={t("ndlaFilm.editor.moveMovieGroupUp")}
              >
                <ArrowUpShortLine />
              </IconButton>
              <IconButton
                size="small"
                variant="clear"
                aria-label={t("ndlaFilm.editor.moveMovieGroupDown")}
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  onMoveTheme(index, 1);
                  e.preventDefault();
                }}
                title={t("ndlaFilm.editor.moveMovieGroupDown")}
              >
                <ArrowDownShortLine />
              </IconButton>
            </div>
          </TitleActionRow>
          <ThemeMovies
            movies={theme.movies}
            onMoviesUpdated={(movies) => onAddMovieToTheme(movies, index)}
            placeholder={t("ndlaFilm.editor.addMovieToGroup", {
              name: findName(theme.name, selectedLanguage),
            })}
            comboboxLabel={t("ndlaFilm.editor.comboboxGroupLabel", {
              name: findName(theme.name, selectedLanguage),
            })}
          />
        </div>
      ))}
    </FormContent>
  );
};

export default ThemeEditor;
