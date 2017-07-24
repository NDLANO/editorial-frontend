/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Arrow } from 'ndla-ui/icons';
import { injectT } from 'ndla-i18n';
import {
  TextAreaField,
  MultiSelectField,
  RemainingCharacters,
} from '../../../components/Fields';

class TopicArticleMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenMetadata: true,
    };
    this.toggleMetadata = this.toggleMetadata.bind(this);
  }

  toggleMetadata() {
    this.setState(prevState => ({
      hiddenMetadata: !prevState.hiddenMetadata,
    }));
  }

  render() {
    const { t, bindInput, commonFieldProps, tags, classes } = this.props;
    const metdataClasses = this.state.hiddenMetadata
      ? classes('metadata', 'hidden')
      : classes('metadata');
    return (
      <div>
        <Button
          {...classes('metadata-button')}
          stripped
          onClick={this.toggleMetadata}>
          <span {...classes('metadata-header')}>
            {t('topicArticleForm.metadata')}
          </span>
          <Arrow direction={`${this.state.hiddenMetadata ? 'down' : 'up'}`} />
        </Button>
        <div {...metdataClasses}>
          <MultiSelectField
            name="tags"
            data={tags}
            label={t('topicArticleForm.fields.tags.label')}
            description={t('topicArticleForm.fields.tags.description')}
            messages={{
              createNew: t('topicArticleForm.fields.tags.createNew'),
              emptyFilter: t('topicArticleForm.fields.tags.emptyFilter'),
              emptyList: t('topicArticleForm.fields.tags.emptyList'),
            }}
            {...commonFieldProps}
          />
          <TextAreaField
            label={t('topicArticleForm.fields.metaDescription.label')}
            description={t(
              'topicArticleForm.fields.metaDescription.description',
            )}
            name="metaDescription"
            maxLength={150}
            {...commonFieldProps}>
            <RemainingCharacters
              maxLength={150}
              getRemainingLabel={(maxLength, remaining) =>
                t('form.remainingCharacters', { maxLength, remaining })}
              value={bindInput('metaDescription').value}
            />
          </TextAreaField>
          <MultiSelectField
            name="authors"
            label={t('topicArticleForm.fields.authors.label')}
            messages={{
              createNew: t('topicArticleForm.fields.authors.createNew'),
              emptyFilter: t('topicArticleForm.fields.authors.emptyFilter'),
              emptyList: t('topicArticleForm.fields.authors.emptyList'),
            }}
            {...commonFieldProps}
          />
        </div>
      </div>
    );
  }
}

TopicArticleMetadata.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  bindInput: PropTypes.func.isRequired,
  commonFieldProps: PropTypes.shape({
    schema: PropTypes.shape({
      fields: PropTypes.object.isRequired,
      isValid: PropTypes.bool.isRequired,
    }),
    submitted: PropTypes.bool.isRequired,
    bindInput: PropTypes.func.isRequired,
  }),
  classes: PropTypes.func.isRequired,
};

export default injectT(TopicArticleMetadata);
