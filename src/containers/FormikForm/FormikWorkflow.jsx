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
import Button from '@ndla/button';
import { FieldHeader } from '@ndla/forms';
import { withRouter } from 'react-router-dom';
import * as draftApi from '../../modules/draft/draftApi';
import FormikStatusActions from './components/FormikStatusActions';
import FormikStatusColumns from './components/FormikStatusColumns';
import * as articleStatuses from '../../util/constants/ArticleStatus';
import FormikAddNotes from './FormikAddNotes';
import FormikField from '../../components/FormikField';
import { ArticleShape } from '../../shapes';
import { toEditArticle } from '../../util/routeHelpers';

class FormikWorkflow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      possibleStatuses: {},
    };
    this.onUpdateStatus = this.onUpdateStatus.bind(this);
    this.onSaveAsNew = this.onSaveAsNew.bind(this);
  }

  async componentDidMount() {
    const possibleStatuses = await draftApi.fetchStatusStateMachine();
    this.setState({ possibleStatuses });
  }

  async onUpdateStatus(status) {
    const {
      values,
      updateArticleStatus,
      getArticle,
      createMessage,
      formIsDirty,
    } = this.props;
    const { revision } = values;
    if (formIsDirty) {
      createMessage({
        translationKey: 'form.mustSaveFirst',
        severity: 'danger',
      });
    } else {
      try {
        if (
          status === articleStatuses.PUBLISHED ||
          status === articleStatuses.QUEUED_FOR_PUBLISHING
        ) {
          await draftApi.validateDraft(values.id, {
            ...getArticle(),
            revision,
          });
        }
        await updateArticleStatus(values.id, status);
      } catch (error) {
        if (error && error.json && error.json.messages) {
          createMessage(formatErrorMessage(error));
        }
      }
    }
  }

  async onSaveAsNew() {
    const {
      article,
      getArticle,
      history,
      formIsDirty,
      createMessage,
      t,
    } = this.props;
    if (formIsDirty) {
      createMessage({
        translationKey: 'form.mustSaveFirst',
        severity: 'danger',
      });
    } else {
      const newArticle = await draftApi.createDraft({
        ...getArticle(),
        title: `${article.title} (${t('form.copy')})`,
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
    const { articleStatus, article, t } = this.props;
    const { possibleStatuses } = this.state;
    return (
      <Fragment>
        <FormikField name="notes" showError={false}>
          {({ field, form: { errors, touched } }) => (
            <FormikAddNotes
              showError={touched[field.name] && !!errors[field.name]}
              labelHeading={t('form.notes.heading')}
              labelAddNote={t('form.notes.add')}
              article={article}
              labelRemoveNote={t('form.notes.remove')}
              labelWarningNote={errors[field.name]}
              {...field}
            />
          )}
        </FormikField>
        <FormikStatusColumns articleStatus={articleStatus} />
        <FormikStatusActions
          articleStatus={articleStatus}
          possibleStatuses={possibleStatuses}
          onUpdateStatus={this.onUpdateStatus}
        />
        <div>
          <FieldHeader title={t('form.workflow.saveAsNew')} />
          <Button onClick={this.onSaveAsNew} data-testid="saveAsNew">
            {t('form.workflow.saveAsNew')}
          </Button>
        </div>
      </Fragment>
    );
  }
}

FormikWorkflow.propTypes = {
  values: PropTypes.shape({
    id: PropTypes.number,
    revision: PropTypes.number,
  }),
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
  updateArticleStatus: PropTypes.func,
  createMessage: PropTypes.func.isRequired,
  getArticle: PropTypes.func.isRequired,
  article: ArticleShape,
  formIsDirty: PropTypes.bool,
  history: PropTypes.object,
};

FormikWorkflow.defaultProps = {
  articleStatus: {
    current: '',
    other: [],
  },
  article: {},
};

export default withRouter(injectT(FormikWorkflow));
