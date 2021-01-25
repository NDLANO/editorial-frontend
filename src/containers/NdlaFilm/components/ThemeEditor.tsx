/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC } from 'react';
import { injectT, tType } from '@ndla/i18n';
import Button from '@ndla/button';
import { Spinner } from '@ndla/editor';
import { FieldHeader, FieldHeaderIconStyle } from '@ndla/forms';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import Tooltip from '@ndla/tooltip';
import { Pencil } from '@ndla/icons/action';
import { ChevronUp, ChevronDown } from '@ndla/icons/common';
import { DeleteForever } from '@ndla/icons/editor';
import { FieldProps, FormikHelpers, FormikValues } from 'formik';
import ElementList from '../../FormikForm/components/ElementList';
import ThemeNameModal from './ThemeNameModal';
import {
  findName,
  addMovieToTheme,
  changeMoviesInTheme,
  convertThemeNames,
  changeThemeNames,
} from '../../../util/ndlaFilmHelpers';
import DropdownSearch from './DropdownSearch';
import { ContentResultType, NdlaFilmThemesEditType } from '../../../interfaces';
import config from '../../../config';

interface Props {
  allMovies: ContentResultType[];
  field: FieldProps<NdlaFilmThemesEditType[]>['field'];
  form: FormikHelpers<FormikValues>;
  onUpdateMovieTheme: Function;
  loading: boolean;
  selectedLanguage: string;
}

interface ThemeNames {
  name: {
    nb: string;
    nn: string;
    en: string;
  };
  warnings: {
    nb: boolean;
    nn: boolean;
    en: boolean;
  };
}

const ThemeEditor: FC<Props & tType> = ({
  t,
  allMovies,
  field,
  form,
  onUpdateMovieTheme,
  loading,
  selectedLanguage,
}) => {
  if (loading) {
    return <Spinner />;
  }

  const themes = field.value;
  const onAddMovieToTheme = (newMovie: ContentResultType, index: number) => {
    const movie = allMovies.find(movie => movie.id === newMovie.id);
    if (movie) {
      const temp = addMovieToTheme(themes.slice(), index, movie);
      onUpdateMovieTheme(field, form, temp);
    }
  };

  const onAddTheme = (theme: ThemeNames) => {
    const newTheme = { name: convertThemeNames(theme), movies: [] };
    const temp = themes.slice();
    temp.push(newTheme);
    onUpdateMovieTheme(field, form, temp);
  };

  const onDeleteTheme = (index: number) => {
    const temp = themes.filter((theme, i) => i !== index);
    onUpdateMovieTheme(field, form, temp);
  };

  const onMoveTheme = (index: number, direction: number) => {
    const desiredNewIndex = index + direction;
    if (desiredNewIndex >= 0 && themes.length > desiredNewIndex) {
      const temp = rearrangeTheme(themes.slice(), index, desiredNewIndex);
      onUpdateMovieTheme(field, form, temp);
    }
  };

  const rearrangeTheme = (
    themes: NdlaFilmThemesEditType[],
    index: number,
    desiredNewIndex: number,
  ) => {
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
                onSaveTheme={(names: any) => onSaveThemeName(names, index)}
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
                wrapperFunctionForButton={(activateButton: Object) => (
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
            <ElementList
              elements={theme.movies}
              messages={{
                dragElement: t('ndlaFilm.editor.changeOrder'),
                removeElement: t('ndlaFilm.editor.removeMovieFromGroup'),
              }}
              onUpdateElements={(updates: any) =>
                onUpdateMovieTheme(field, form, changeMoviesInTheme(themes, index, updates))
              }
            />
            <DropdownSearch
              selectedElements={theme.movies}
              onChange={(movie: ContentResultType) => onAddMovieToTheme(movie, index)}
              subjectId={'urn:subject:20'}
              contextTypes={config.ndlaFilmArticleType}
              placeholder={t('ndlaFilm.editor.addMovieToGroup', {
                name: findName(theme.name, selectedLanguage),
              })}
              clearInputField
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

export default injectT(ThemeEditor);
