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
import MovieList from './MovieList';
import ThemeNameModal from './ThemeNameModal';
import { ContentResultShape } from '../../../shapes';
import { findName } from '../../../util/ndlaFilmHelpers';
import DropdownSearch from './DropdownSearch';

const ThemeEditor = ({
  t,
  updateMovieTheme,
  themes,
  addMovieToTheme,
  onAddTheme,
  onMoveTheme,
  onDeleteTheme,
  onSaveThemeName,
  loading,
  locale,
}) => {
  if (loading) {
    return <Spinner />;
  }

  return (
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
      {themes.map((theme, index) => (
        <StyledThemeWrapper key={findName(theme.name, 'nb')}>
          <FieldHeader
            title={findName(theme.name, 'nb')}
            subTitle={theme.name
              .filter(name => name.language !== 'nb')
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
                <button css={FieldHeaderIconStyle} tabIndex={-1}>
                  <Pencil />
                </button>
              }
              wrapperFunctionForButton={activateButton => (
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
                name: theme.name.find(name => name.language === 'nb').name,
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
                onClick={() => onMoveTheme(index, -1)}>
                <ChevronUp />
              </button>
            </Tooltip>
            <Tooltip tooltip={t('ndlaFilm.editor.moveMovieGroupDown')}>
              <button
                css={FieldHeaderIconStyle}
                tabIndex={-1}
                onClick={() => onMoveTheme(index, 1)}>
                <ChevronDown />
              </button>
            </Tooltip>
          </FieldHeader>
          <MovieList
            movies={theme.movies}
            messages={{
              dragFilm: t('ndlaFilm.editor.changeOrder'),
              removeFilm: t('ndlaFilm.editor.removeMovieFromGroup'),
            }}
            onUpdateMovies={updates => updateMovieTheme(updates, index)}
          />
          <DropdownSearch
            selectedMovies={theme.movies}
            onChange={evt => addMovieToTheme(evt, index)}
            placeholder={t('ndlaFilm.editor.addMovieToGroup', {
              name: findName(theme.name, locale),
            })}
          />
        </StyledThemeWrapper>
      ))}
    </>
  );
};

const StyledThemeWrapper = styled('div')`
  margin-bottom: ${spacing.large};
`;

ThemeEditor.propTypes = {
  themes: PropTypes.arrayOf(
    PropTypes.shape({
      movies: PropTypes.arrayOf(ContentResultShape),
      name: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          language: PropTypes.string,
        }),
      ),
    }),
  ),
  updateMovieTheme: PropTypes.func.isRequired,
  addMovieToTheme: PropTypes.func.isRequired,
  onAddTheme: PropTypes.func.isRequired,
  onMoveTheme: PropTypes.func.isRequired,
  onDeleteTheme: PropTypes.func.isRequired,
  updateThemeName: PropTypes.func.isRequired,
  onSaveThemeName: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  locale: PropTypes.string,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default injectT(connect(mapStateToProps)(ThemeEditor));
