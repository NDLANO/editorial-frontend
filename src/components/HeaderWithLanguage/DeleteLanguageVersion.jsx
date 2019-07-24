/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { injectT } from '@ndla/i18n';
import { withRouter } from 'react-router-dom';
import { DeleteForever } from '@ndla/icons/editor';
import { deleteLanguageVersion } from '../../modules/draft/draftApi';
import { deleteLanguageVersionConcept } from '../../modules/concept/conceptApi';
import { HistoryShape } from '../../shapes';
import { toEditArticle, toEditConcept } from '../../util/routeHelpers';
import AlertModal from '../AlertModal';
import StyledFilledButton from '../StyledFilledButton';

const StyledWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
`;

class DeleteLanguageVersion extends React.Component {
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
      values: { id, supportedLanguages, language, articleType },
      history,
      type,
    } = this.props;
    if (
      id &&
      supportedLanguages.length > 1 &&
      supportedLanguages.includes(language)
    ) {
      if (type === 'concept') {
        await deleteLanguageVersionConcept(id, language);
        this.toggleShowDeleteWarning();
        const otherSupportedLanguage = supportedLanguages.find(
          lang => lang !== language,
        );
        history.push(toEditConcept(id, otherSupportedLanguage));
      } else {
        await deleteLanguageVersion(id, language);
        this.toggleShowDeleteWarning();
        const otherSupportedLanguage = supportedLanguages.find(
          lang => lang !== language,
        );
        history.push(toEditArticle(id, articleType, otherSupportedLanguage));
      }
    }
  }

  render() {
    const {
      values: { id, supportedLanguages, language },
      showDeleteButton,
      t,
    } = this.props;

    if (
      !showDeleteButton ||
      !id ||
      supportedLanguages.length < 2 ||
      !supportedLanguages.includes(language)
    ) {
      return null;
    }
    const { showDeleteWarning } = this.state;

    return (
      <StyledWrapper>
        <StyledFilledButton
          type="button"
          deletable
          onClick={this.toggleShowDeleteWarning}>
          <DeleteForever />
          {t('form.workflow.deleteLanguageVersion.button', {
            languageVersion: t(`language.${language}`).toLowerCase(),
          })}
        </StyledFilledButton>
        <AlertModal
          show={showDeleteWarning}
          text={t('form.workflow.deleteLanguageVersion.modal')}
          actions={[
            {
              text: t('form.abort'),
              onClick: this.toggleShowDeleteWarning,
            },
            {
              text: t('form.workflow.deleteLanguageVersion.button', {
                languageVersion: t(`language.${language}`).toLowerCase(),
              }),
              onClick: this.deleteLanguageVersion,
            },
          ]}
          onCancel={this.toggleShowDeleteWarning}
        />
      </StyledWrapper>
    );
  }
}

DeleteLanguageVersion.propTypes = {
  values: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
    articleType: PropTypes.string,
  }),
  showDeleteButton: PropTypes.bool.isRequired,
  history: HistoryShape,
  type: PropTypes.string,
};

export default withRouter(injectT(DeleteLanguageVersion));
