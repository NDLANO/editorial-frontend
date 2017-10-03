/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import {
  PlainTextField,
  MultiSelectField,
  RemainingCharacters,
} from '../../../components/Fields';
import Accordion from '../../../components/Accordion';
import { CommonFieldPropsShape } from '../../../shapes';

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
    const { t, bindInput, commonFieldProps, tags } = this.props;
    return (
      <Accordion
        fill
        handleToggle={this.toggleMetadata}
        header={t('form.metadataSection')}
        hidden={this.state.hiddenMetadata}>
        <MultiSelectField
          obligatory
          name="tags"
          data={tags}
          label={t('form.tags.label')}
          description={t('form.tags.description')}
          messages={{
            createNew: t('form.tags.createNew'),
            emptyFilter: t('form.tags.emptyFilter'),
            emptyList: t('form.tags.emptyList'),
          }}
          {...commonFieldProps}
        />
        <PlainTextField
          label={t('form.metaDescription.label')}
          description={t('form.metaDescription.description')}
          name="metaDescription"
          maxLength={150}
          {...commonFieldProps}>
          <RemainingCharacters
            maxLength={150}
            getRemainingLabel={(maxLength, remaining) =>
              t('form.remainingCharacters', { maxLength, remaining })}
            value={bindInput('metaDescription').value.document.text}
          />
        </PlainTextField>
        <MultiSelectField
          name="authors"
          label={t('form.authors.label')}
          messages={{
            createNew: t('form.authors.createNew'),
            emptyFilter: t('form.authors.emptyFilter'),
            emptyList: t('form.authors.emptyList'),
          }}
          {...commonFieldProps}
        />
      </Accordion>
    );
  }
}

TopicArticleMetadata.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  bindInput: PropTypes.func.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
  classes: PropTypes.func.isRequired,
};

export default injectT(TopicArticleMetadata);
