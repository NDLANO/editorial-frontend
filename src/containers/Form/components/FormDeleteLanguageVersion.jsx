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
import { withRouter } from 'react-router-dom';
import { cx } from 'react-emotion';
import { DeleteForever } from '@ndla/icons/editor';
import { deleteLanguageVersion } from '../../../modules/draft/draftApi';
import { HistoryShape } from '../../../shapes';
import { toEditArticle } from '../../../util/routeHelpers';
import AlertModal from '../../../components/AlertModal';
import { linkFillButtonCSS, linkFillButtonDeleteCSS } from '../../../style';

class FormDeleteLanguageVersion extends React.Component {
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
      model: { id, supportedLanguages, language },
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
        <button
          type="button"
          className={cx(linkFillButtonCSS, linkFillButtonDeleteCSS)}
          onClick={this.toggleShowDeleteWarning}>
          <DeleteForever />
          {t('form.workflow.deleteLanguageVersion.button', {
            languageVersion: t(`language.${language}`).toLowerCase(),
          })}
        </button>
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

FormDeleteLanguageVersion.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
    articleType: PropTypes.string,
  }),
  history: HistoryShape,
};

export default withRouter(injectT(FormDeleteLanguageVersion));
