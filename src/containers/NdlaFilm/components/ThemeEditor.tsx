/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { IMovieTheme } from '@ndla/types-backend/frontpage-api';
import { ButtonV2, IconButtonV2 } from '@ndla/button';
import { FieldHeader } from '@ndla/forms';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import Tooltip from '@ndla/tooltip';
import { Pencil } from '@ndla/icons/action';
import { ChevronUp, ChevronDown } from '@ndla/icons/common';
import { DeleteForever } from '@ndla/icons/editor';
import { useField, useFormikContext } from 'formik';
import ThemeNameModal from './ThemeNameModal';
import { findName, convertThemeNames, changeThemeNames } from '../../../util/ndlaFilmHelpers';
import { ThemeMovies } from './ThemeMovies';
import { LocaleType } from '../../../interfaces';

interface Props {
  onUpdateMovieTheme: Function;
  selectedLanguage: string;
}

export interface ThemeNames {
  name: Record<LocaleType, string>;
  warnings: Record<LocaleType, boolean>;
}

const ThemeEditor = ({ onUpdateMovieTheme, selectedLanguage }: Props) => {
  const { t } = useTranslation();
  const form = useFormikContext();
  const [field] = useField<IMovieTheme[]>('themes');
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
        activateButton={<ButtonV2 data-cy="add-theme-modal">Lag ny gruppe</ButtonV2>}
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
                .filter((name) => name.language !== selectedLanguage)
                .map((name) => ` | ${name.name}`)
                .join('')}
            >
              <ThemeNameModal
                onSaveTheme={(theme) => onSaveThemeName(theme, index)}
                initialTheme={{
                  name: {
                    nb: findName(theme.name, 'nb'),
                    nn: findName(theme.name, 'nn'),
                    en: findName(theme.name, 'en'),
                    se: findName(theme.name, 'se'),
                    sma: findName(theme.name, 'sma'),
                  },
                }}
                activateButton={
                  <IconButtonV2
                    aria-label={t('ndlaFilm.editor.editMovieGroupName')}
                    title={t('ndlaFilm.editor.editMovieGroupName')}
                    variant="ghost"
                    colorTheme="lighter"
                  >
                    <Pencil />
                  </IconButtonV2>
                }
                messages={{
                  save: t('ndlaFilm.editor.saveNameChanges'),
                  cancel: t('ndlaFilm.editor.cancel'),
                  title: t('ndlaFilm.editor.editGroupTitle'),
                }}
              />
              <Tooltip
                tooltip={t('ndlaFilm.editor.deleteMovieGroup', {
                  name: theme.name.find((name) => name.language === selectedLanguage)?.name || '',
                })}
              >
                <IconButtonV2
                  aria-label={t('ndlaFilm.editor.deleteMovieGroup')}
                  variant="ghost"
                  colorTheme="danger"
                  onClick={() => onDeleteTheme(index)}
                >
                  <DeleteForever />
                </IconButtonV2>
              </Tooltip>
              <Tooltip tooltip={t('ndlaFilm.editor.moveMovieGroupUp')}>
                <IconButtonV2
                  aria-label={t('ndlaFilm.editor.moveMovieGroupUp')}
                  variant="ghost"
                  colorTheme="lighter"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    onMoveTheme(index, -1);
                    e.preventDefault();
                  }}
                >
                  <ChevronUp />
                </IconButtonV2>
              </Tooltip>
              <Tooltip tooltip={t('ndlaFilm.editor.moveMovieGroupDown')}>
                <IconButtonV2
                  aria-label={t('ndlaFilm.editor.moveMovieGroupDown')}
                  variant="ghost"
                  colorTheme="lighter"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    onMoveTheme(index, 1);
                    e.preventDefault();
                  }}
                >
                  <ChevronDown />
                </IconButtonV2>
              </Tooltip>
            </FieldHeader>
            <ThemeMovies
              movies={theme.movies}
              onMoviesUpdated={(movies) => onAddMovieToTheme(movies, index)}
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
