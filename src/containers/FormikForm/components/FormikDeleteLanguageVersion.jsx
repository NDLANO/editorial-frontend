/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { css } from 'react-emotion';
import darken from 'polished/lib/color/darken';
import { colors } from '@ndla/core';
import { withRouter } from 'react-router-dom';
import Button from '@ndla/button';
import { FieldHeader } from '@ndla/forms';
import { deleteLanguageVersion } from '../../../modules/draft/draftApi';
import { HistoryShape } from '../../../shapes';
import { toEditArticle } from '../../../util/routeHelpers';
import AlertModal from '../../../components/AlertModal';

const deleteButtonStyle = css`
  background-color: ${colors.support.red};
  border-color: ${colors.support.red};
  color: white;
  &:hover,
  &:focus {
    background-color: ${darken(0.2, colors.support.red)};
    border-color: ${darken(0.2, colors.support.red)};
    color: white;
  }
`;

class FormikDeleteLanguageVersion extends React.Component {
  constructor() {
    super();
    this.state = { showDeleteWarning: false };
    this.deleteLanguageVersion = this.deleteLanguageVersion.bind(this);
    this.toggleShowDeleteWarning = this.toggleShowDeleteWarning.bind(this);
  }

  toggleShowDeleteWarning() {
    this.setState(prevState => ({
      showDeleteWarning: !prevState.showDeleteWarning,
    }));
  }

  async deleteLanguageVersion() {
    const {
      model: { id, supportedLanguages, language, articleType },
      history,
    } = this.props;
    if (
      id &&
      supportedLanguages.length > 1 &&
      supportedLanguages.includes(language)
    ) {
      await deleteLanguageVersion(id, language);
      this.toggleShowDeleteWarning();
      const otherSupportedLanguage = supportedLanguages.find(
        lang => lang !== language,
      );
      history.push(toEditArticle(id, articleType, otherSupportedLanguage));
    }
  }

  render() {
    const {
      values: { id, supportedLanguages, language },
      t,
    } = this.props;
    const { showDeleteWarning } = this.state;
    if (
      !id ||
      supportedLanguages.length < 2 ||
      !supportedLanguages.includes(language)
    ) {
      return null;
    }
    return (
      <div>
        <FieldHeader title={t('form.workflow.deleteLanguageVersion.title')} />
        <Button css={deleteButtonStyle} onClick={this.toggleShowDeleteWarning}>
          {t('form.workflow.deleteLanguageVersion.button')}
        </Button>
        <AlertModal
          show={showDeleteWarning}
          text={t('form.workflow.deleteLanguageVersion.modal')}
          actions={[
            {
              text: t('form.abort'),
              onClick: this.toggleShowDeleteWarning,
            },
            {
              text: t('form.workflow.deleteLanguageVersion.button'),
              onClick: this.deleteLanguageVersion,
            },
          ]}
          onCancel={this.toggleShowDeleteWarning}
        />
      </div>
    );
  }
}

FormikDeleteLanguageVersion.propTypes = {
  values: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
    articleType: PropTypes.string,
  }),
  history: HistoryShape,
};

export default withRouter(injectT(FormikDeleteLanguageVersion));
