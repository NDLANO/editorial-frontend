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
import { connect } from 'react-redux';
import { injectT } from '@ndla/i18n';
import { withRouter } from 'react-router-dom';
import { DeleteForever } from '@ndla/icons/editor';
import { deleteLanguageVersion } from '../../modules/draft/draftApi';
import { deleteLanguageVersionConcept } from '../../modules/concept/conceptApi';
import { deleteLanguageVersionImage } from '../../modules/image/imageApi';
import { deleteLanguageVersionAudio } from '../../modules/audio/audioApi';
import * as messageActions from '../../containers/Messages/messagesActions';
import { HistoryShape } from '../../shapes';
import {
  toCreateAudioFile,
  toCreateConcept,
  toCreateImage,
  toEditArticle,
  toEditAudio,
  toEditConcept,
  toEditImage,
} from '../../util/routeHelpers';
import AlertModal from '../AlertModal';
import StyledFilledButton from '../StyledFilledButton';
import { formatErrorMessage } from '../../util/apiHelpers';

const StyledWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
`;

const nonDeletableTypes = ['standard', 'topic-article', 'concept'];

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
      createMessage,
    } = this.props;
    if (id && supportedLanguages.includes(language)) {
      this.toggleShowDeleteWarning();
      const otherSupportedLanguage = supportedLanguages.find(
        lang => lang !== language,
      );

      const newAfterLanguageDeletion = supportedLanguages.length <= 1;

      try {
        switch (type) {
          case 'audio':
            await deleteLanguageVersionAudio(id, language);
            history.push(
              newAfterLanguageDeletion
                ? toCreateAudioFile()
                : toEditAudio(id, otherSupportedLanguage),
            );
            break;
          case 'image':
            await deleteLanguageVersionImage(id, language);
            history.push(
              newAfterLanguageDeletion
                ? toCreateImage()
                : toEditImage(id, otherSupportedLanguage),
            );
            break;
          case 'concept':
            await deleteLanguageVersionConcept(id, language);
            history.push(
              newAfterLanguageDeletion
                ? toCreateConcept()
                : toEditConcept(id, otherSupportedLanguage),
            );
            break;
          default:
            await deleteLanguageVersion(id, language);
            history.push(
              toEditArticle(id, articleType, otherSupportedLanguage),
            );
            break;
        }
      } catch (error) {
        createMessage(formatErrorMessage(error));
      }
    }
  }

  render() {
    const {
      values: { id, supportedLanguages, language },
      type,
      t,
    } = this.props;

    if (
      !id ||
      !supportedLanguages.includes(language) ||
      (nonDeletableTypes.includes(type) && supportedLanguages.length < 2)
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
  history: HistoryShape,
  type: PropTypes.string,
  createMessage: PropTypes.func,
};

const mapDispatchToProps = {
  createMessage: (message = {}) => messageActions.addMessage(message),
};

export default connect(
  undefined,
  mapDispatchToProps,
)(withRouter(injectT(DeleteLanguageVersion)));
