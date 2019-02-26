/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '@ndla/button';
import { FormHeader } from '@ndla/forms';
import { actions as draftActions } from '../../modules/draft/draft';
import * as draftApi from '../../modules/draft/draftApi';
import { FormAddNotes } from '.';
import { CommonFieldPropsShape, NewArticleShape } from '../../shapes';
import FormStatusActions from './components/FormStatusActions';
import FormStatusColumns from './components/FormStatusColumns';
import FormQualityAssurance from './components/FormQualityAssurance';
import FormDeleteLanguageVersion from './components/FormDeleteLanguageVersion';
import * as articleStatuses from '../../util/constants/ArticleStatus';
import { toEditArticle } from '../../util/routeHelpers';

export const formatErrorMessage = error => ({
  message: error.json.messages
    .map(message => `${message.field}: ${message.message}`)
    .join(', '),
  severity: 'danger',
  timeToLive: 0,
});

class FormWorkflow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      possibleStatuses: {},
    };
    this.onValidateClick = this.onValidateClick.bind(this);
    this.onUpdateStatus = this.onUpdateStatus.bind(this);
    this.onSaveAsNew = this.onSaveAsNew.bind(this);
  }

  async componentDidMount() {
    const possibleStatuses = await draftApi.fetchStatusStateMachine();
    this.setState({ possibleStatuses });
  }

  async onUpdateStatus(status) {
    const {
      model: { id },
      updateStatusDraft,
      getArticle,
      createMessage,
      revision,
    } = this.props;

    try {
      if (
        status === articleStatuses.PUBLISHED ||
        status === articleStatuses.QUEUED_FOR_PUBLISHING
      ) {
        await draftApi.validateDraft(id, {
          ...getArticle(),
          revision,
        });
      }
      updateStatusDraft({ id, status });
    } catch (error) {
      if (error && error.json && error.json.messages) {
        createMessage(formatErrorMessage(error));
      }
    }
  }

  async onValidateClick() {
    const {
      model: { id },
      createMessage,
      getArticle,
      revision,
    } = this.props;

    try {
      await draftApi.validateDraft(id, { ...getArticle(), revision });
      createMessage({
        translationKey: 'form.validationOk',
        severity: 'success',
      });
    } catch (error) {
      if (error && error.json && error.json.messages) {
        createMessage(formatErrorMessage(error));
      } else {
        createMessage(error);
      }
    }
  }

  async onSaveAsNew() {
    const { article, history, formIsDirty, createMessage, t } = this.props;
    if (formIsDirty) {
      createMessage({
        translationKey: 'form.mustSaveFirst',
        severity: 'danger',
      });
    } else {
      const newArticle = await draftApi.createDraft({
        ...article,
        title: article.title.concat(t('form.titleCopy')),
      });
      createMessage({
        translationKey: t('form.saveAsCopySuccess'),
        severity: 'success',
      });
      history.push(
        toEditArticle(newArticle.id, newArticle.articleType, article.language),
      );
    }
  }

  render() {
    const {
      t,
      model,
      articleStatus,
      commonFieldProps,
      getArticle,
      article,
    } = this.props;
    const { possibleStatuses } = this.state;

    return (
      <Fragment>
        <FormAddNotes
          name="notes"
          labelHeading={t('form.notes.heading')}
          labelAddNote={t('form.notes.add')}
          article={article}
          labelRemoveNote={t('form.notes.remove')}
          labelWarningNote={t('form.notes.warning')}
          {...commonFieldProps}
          {...commonFieldProps.bindInput('notes')}
        />
        <FormStatusColumns articleStatus={articleStatus} />
        <FormStatusActions
          articleStatus={articleStatus}
          possibleStatuses={possibleStatuses}
          onUpdateStatus={this.onUpdateStatus}
        />
        <FormDeleteLanguageVersion model={model} />
        <div>
          <FormHeader title={t('form.workflow.saveAsNew')} />
          <Button onClick={this.onSaveAsNew}>
            {t('form.workflow.saveAsNew')}
          </Button>
        </div>
        <FormQualityAssurance
          getArticle={getArticle}
          model={model}
          onValidateClick={this.onValidateClick}
        />
      </Fragment>
    );
  }
}

FormWorkflow.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
  }),
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
  createMessage: PropTypes.func.isRequired,
  updateStatusDraft: PropTypes.func.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
  getArticle: PropTypes.func.isRequired,
  article: NewArticleShape,
};

FormWorkflow.defaultProps = {
  articleStatus: {
    current: '',
    other: [],
  },
  article: {},
};

const mapDispatchToProps = {
  updateStatusDraft: draftActions.updateStatusDraft,
};

export default withRouter(
  connect(
    undefined,
    mapDispatchToProps,
  )(injectT(FormWorkflow)),
);
