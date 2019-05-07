/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import { Spinner } from '@ndla/editor';
import { FieldHeader, Select, FieldHeaderIconStyle } from '@ndla/forms';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import Tooltip from '@ndla/tooltip';
import { Pencil } from '@ndla/icons/action';
import { ChevronUp, ChevronDown } from '@ndla/icons/common';
import { DeleteForever } from '@ndla/icons/editor';
import MovieList from './MovieList';
import ThemeNameModal from './ThemeNameModal';

class ThemeEditor extends React.Component {
  findName = (themeNames, language) => {
    const nbName = themeNames.filter(name => name.language === language);
    if (nbName.length > 0) {
      return nbName.map(n => n.name).join();
    } else {
      return '';
    }
  };

  render() {
    const blankTheme = {
      newTheme: {
        name: {
          nb: '',
          nn: '',
          en: '',
        },
        warnings: {
          nb: false,
          nn: false,
          en: false,
        },
      },
    };

    const StyledThemeWrapper = styled('div')`
      margin-bottom: ${spacing.large};
    `;

    const {
      t,
      renderAddMovieOptions,
      updateMovieTheme,
      themes,
      addMovieToTheme,
      onAddTheme,
      onMoveTheme,
      onDeleteTheme,
      onSaveThemeName,
    } = this.props;

    if (!themes) {
      return <Spinner />;
    }

    return (
      <>
        <ThemeNameModal
          onSaveTheme={onAddTheme}
          startState={blankTheme}
          activateButton={<Button>Lag ny gruppe</Button>}
          messages={{
            save: t('ndlaFilm.editor.createThemeGroup'),
            cancel: t('ndlaFilm.editor.cancel'),
            title: t('ndlaFilm.editor.newGroupTitle'),
          }}
        />
        {themes.map((theme, index) => (
          <StyledThemeWrapper key={this.findName(theme.name, 'nb')}>
            <FieldHeader
              title={this.findName(theme.name, 'nb')}
              subTitle={theme.name
                .filter(name => name.language !== 'nb')
                .map(name => ` | ${name.name}`)}>
              <ThemeNameModal
                onSaveTheme={names => onSaveThemeName(names, index)}
                startState={{
                  newTheme: {
                    name: {
                      nb: this.findName(theme.name, 'nb'),
                      nn: this.findName(theme.name, 'nn'),
                      en: this.findName(theme.name, 'en'),
                    },
                    warnings: {
                      nb: false,
                      nn: false,
                      en: false,
                    },
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
              id={theme.id}
              onUpdateMovies={updates => updateMovieTheme(updates, index)}
            />
            <Select
              value=""
              onChange={e => addMovieToTheme(e.target.value, index)}>
              <option value="">
                {t('ndlaFilm.editor.addMovieToGroup', {
                  name: theme.name.find(name => name.language === 'nb').name,
                })}
              </option>
              {renderAddMovieOptions(theme.movies)}
            </Select>
          </StyledThemeWrapper>
        ))}
      </>
    );
  }
}

ThemeEditor.propTypes = {
  themes: PropTypes.arrayOf(PropTypes.shape),
  renderAddMovieOptions: PropTypes.func,
  updateMovieTheme: PropTypes.func,
  addMovieToTheme: PropTypes.func,
  onAddTheme: PropTypes.func,
  onMoveTheme: PropTypes.func,
  onDeleteTheme: PropTypes.func,
  updateThemeName: PropTypes.func,
  onSaveThemeName: PropTypes.func,
};

export default injectT(ThemeEditor);
