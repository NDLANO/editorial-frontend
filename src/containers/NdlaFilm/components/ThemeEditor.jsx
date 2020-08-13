/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import { Spinner } from '@ndla/editor';
import { FieldHeader, FieldHeaderIconStyle } from '@ndla/forms';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import Tooltip from '@ndla/tooltip';
import { Pencil } from '@ndla/icons/action';
import { ChevronUp, ChevronDown } from '@ndla/icons/common';
import { DeleteForever } from '@ndla/icons/editor';
import { getLocale } from '../../../modules/locale/locale';
import ElementList from './ElementList';
import ThemeNameModal from './ThemeNameModal';
import { ContentResultShape } from '../../../shapes';
import {
  findName,
  addMovieToTheme,
  changeMoviesInTheme,
  convertThemeNames,
  changeThemeNames,
} from '../../../util/ndlaFilmHelpers';
import DropdownSearch from './DropdownSearch';
import FormikField from '../../../components/FormikField';

const ThemeEditor = ({
  t,
  allMovies,
  field,
  form,
  onUpdateMovieTheme,
  loading,
  locale,
  selectedLanguage,
}) => {
  if (loading) {
    return <Spinner />;
  }

  const themes = field.value;
  const onAddMovieToTheme = (newMovie, index) => {
    const movie = allMovies.find(movie => movie.id === newMovie.id);
    if (movie) {
      const temp = addMovieToTheme(themes.slice(), index, movie);
      onUpdateMovieTheme(field, form, temp);
    }
  };

  const onAddTheme = theme => {
    const newTheme = { name: convertThemeNames(theme), movies: [] };
    const temp = themes.slice();
    temp.push(newTheme);
    onUpdateMovieTheme(field, form, temp);
  };

  const onDeleteTheme = index => {
    const temp = themes.filter((theme, i) => i !== index);
    onUpdateMovieTheme(field, form, temp);
  };

  const onMoveTheme = (index, direction) => {
    const desiredNewIndex = index + direction;
    if (desiredNewIndex >= 0 && themes.length > desiredNewIndex) {
      const temp = rearrangeTheme(themes.slice(), index, desiredNewIndex);
      onUpdateMovieTheme(field, form, temp);
    }
  };

  const rearrangeTheme = (themes, index, desiredNewIndex) => {
    return themes.map((theme, i) => {
      if (i === index) {
        return themes[desiredNewIndex];
      } else if (i === desiredNewIndex) {
        return themes[index];
      }
      return theme;
    });
  };

  const onSaveThemeName = (newNames, index) => {
    const newThemeNames = convertThemeNames(newNames);
    const temp = changeThemeNames(themes.slice(), newThemeNames, index);
    onUpdateMovieTheme(field, form, temp);
  };

  return (
    <FormikField name={'themes'}>
      {({ field, form }) => (
        <>
          <ThemeNameModal
            onSaveTheme={onAddTheme}
            createTheme={true}
            activateButton={
              <Button data-cy="add-theme-modal">Lag ny gruppe</Button>
            }
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
                    onSaveTheme={names => onSaveThemeName(names, index)}
                    initialTheme={{
                      name: {
                        nb: findName(theme.name, 'nb'),
                        nn: findName(theme.name, 'nn'),
                        en: findName(theme.name, 'en'),
                      },
                    }}
                    activateButton={
                      <button
                        css={FieldHeaderIconStyle}
                        tabIndex={-1}
                        onClick={e => e.preventDefault()}>
                        <Pencil />
                      </button>
                    }
                    wrapperFunctionForButton={activateButton => (
                      <Tooltip
                        tooltip={t('ndlaFilm.editor.editMovieGroupName')}>
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
                      name: theme.name.find(name => name.language === 'nb')
                        .name,
                    })}>
                    <button
                      css={FieldHeaderIconStyle}
                      tabIndex={-1}
                      onClick={() => onDeleteTheme(index)}>
                      <DeleteForever />
                    </button>
                  </Tooltip>
                  <Tooltip tooltip={t('ndlaFilm.editor.moveMovieGroupUp')}>
                    <button
                      css={FieldHeaderIconStyle}
                      tabIndex={-1}
                      onClick={e => {
                        onMoveTheme(index, -1);
                        e.preventDefault();
                      }}>
                      <ChevronUp />
                    </button>
                  </Tooltip>
                  <Tooltip tooltip={t('ndlaFilm.editor.moveMovieGroupDown')}>
                    <button
                      css={FieldHeaderIconStyle}
                      tabIndex={-1}
                      onClick={e => {
                        onMoveTheme(index, 1);
                        e.preventDefault();
                      }}>
                      <ChevronDown />
                    </button>
                  </Tooltip>
                </FieldHeader>
                <ElementList
                  elements={theme.movies}
                  messages={{
                    dragElement: t('ndlaFilm.editor.changeOrder'),
                    removeElement: t('ndlaFilm.editor.removeMovieFromGroup'),
                  }}
                  onUpdateElements={updates =>
                    onUpdateMovieTheme(
                      field,
                      form,
                      changeMoviesInTheme(themes, index, updates),
                    )
                  }
                />
                <DropdownSearch
                  selectedElements={theme.movies}
                  onChange={movie => onAddMovieToTheme(movie, index)}
                  placeholder={t('ndlaFilm.editor.addMovieToGroup', {
                    name: findName(theme.name, locale),
                  })}
                />
              </StyledThemeWrapper>
            );
          })}
        </>
      )}
    </FormikField>
  );
};

const StyledThemeWrapper = styled('div')`
  margin-bottom: ${spacing.large};
`;

ThemeEditor.propTypes = {
  onUpdateMovieTheme: PropTypes.func.isRequired,
  addMovieToList: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  locale: PropTypes.string,
  allMovies: PropTypes.arrayOf(ContentResultShape),
  field: PropTypes.object,
  form: PropTypes.object,
  selectedLanguage: PropTypes.string,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default injectT(connect(mapStateToProps)(ThemeEditor));
