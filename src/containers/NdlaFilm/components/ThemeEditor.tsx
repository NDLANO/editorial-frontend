/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@ndla/button';
import { FieldHeader, FieldHeaderIconStyle } from '@ndla/forms';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import Tooltip from '@ndla/tooltip';
import { Pencil } from '@ndla/icons/action';
import { ChevronUp, ChevronDown } from '@ndla/icons/common';
import { DeleteForever } from '@ndla/icons/editor';
import { FieldProps, FormikHelpers, FormikValues } from 'formik';
import ThemeNameModal from './ThemeNameModal';
import { findName, convertThemeNames, changeThemeNames } from '../../../util/ndlaFilmHelpers';
import { ThemeMovies } from './ThemeMovies';
import { MovieThemeApiType } from '../../../modules/frontpage/frontpageApiInterfaces';
import { LocaleType } from '../../../interfaces';

interface Props {
  field: FieldProps<MovieThemeApiType[]>['field'];
  form: FormikHelpers<FormikValues>;
  onUpdateMovieTheme: Function;
  selectedLanguage: string;
}

export interface ThemeNames {
  name: Record<LocaleType, string>;
  warnings: Record<LocaleType, boolean>;
}

const ThemeEditor = ({ field, form, onUpdateMovieTheme, selectedLanguage }: Props) => {
  const { t } = useTranslation();

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

  const rearrangeTheme = (themes: MovieThemeApiType[], index: number, desiredNewIndex: number) => {
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
        activateButton={<Button data-cy="add-theme-modal">Lag ny gruppe</Button>}
        messages={{
          save: t('ndlaFilm.editor.createThemeGroup'),
          cancel: t('ndlaFilm.editor.cancel'),
          title: t('ndlaFilm.editor.newGroupTitle'),
        }}
      />
      {themes.map((theme, index) => {
        return (
          <StyledThemeWrapper key={findName(theme.name, 'nb')}>
            <FieldHeader
              title={findName(theme.name, selectedLanguage)}
              subTitle={theme.name
                .filter(name => name.language !== selectedLanguage)
                .map(name => ` | ${name.name}`)
                .join('')}>
              <ThemeNameModal
                onSaveTheme={theme => onSaveThemeName(theme, index)}
                initialTheme={{
                  name: {
                    nb: findName(theme.name, 'nb'),
                    nn: findName(theme.name, 'nn'),
                    en: findName(theme.name, 'en'),
                  },
                }}
                activateButton={
                  <Button
                    stripped
                    css={FieldHeaderIconStyle}
                    tabIndex={-1}
                    onClick={(e: Event) => e.preventDefault()}>
                    <Pencil />
                  </Button>
                }
                wrapperFunctionForButton={(activateButton: ReactNode) => (
                  <Tooltip tooltip={t('ndlaFilm.editor.editMovieGroupName')}>
                    {activateButton}
                  </Tooltip>
                )}
                messages={{
                  save: t('ndlaFilm.editor.saveNameChanges'),
                  cancel: t('ndlaFilm.editor.cancel'),
                  title: t('ndlaFilm.editor.editGroupTitle'),
                }}
              />
              <Tooltip
                tooltip={t('ndlaFilm.editor.deleteMovieGroup', {
                  name: theme.name.find(name => name.language === selectedLanguage)?.name || '',
                })}>
                <Button
                  stripped
                  css={FieldHeaderIconStyle}
                  tabIndex={-1}
                  onClick={() => onDeleteTheme(index)}>
                  <DeleteForever />
                </Button>
              </Tooltip>
              <Tooltip tooltip={t('ndlaFilm.editor.moveMovieGroupUp')}>
                <Button
                  stripped
                  css={FieldHeaderIconStyle}
                  tabIndex={-1}
                  onClick={(e: Event) => {
                    onMoveTheme(index, -1);
                    e.preventDefault();
                  }}>
                  <ChevronUp />
                </Button>
              </Tooltip>
              <Tooltip tooltip={t('ndlaFilm.editor.moveMovieGroupDown')}>
                <Button
                  stripped
                  css={FieldHeaderIconStyle}
                  tabIndex={-1}
                  onClick={(e: Event) => {
                    onMoveTheme(index, 1);
                    e.preventDefault();
                  }}>
                  <ChevronDown />
                </Button>
              </Tooltip>
            </FieldHeader>
            <ThemeMovies
              movies={theme.movies}
              onMoviesUpdated={movies => onAddMovieToTheme(movies, index)}
              placeholder={t('ndlaFilm.editor.addMovieToGroup', {
                name: findName(theme.name, selectedLanguage),
              })}
            />
          </StyledThemeWrapper>
        );
      })}
    </>
  );
};

const StyledThemeWrapper = styled('div')`
  margin-bottom: ${spacing.large};
`;

export default ThemeEditor;
