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

class LearningResourceMetadata extends Component {
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
        header={t('learningResourceForm.metadata')}
        hidden={this.state.hiddenMetadata}>
        <MultiSelectField
          obligatory
          name="tags"
          data={tags}
          label={t('learningResourceForm.fields.tags.label')}
          description={t('learningResourceForm.fields.tags.description')}
          messages={{
            createNew: t('learningResourceForm.fields.tags.createNew'),
            emptyFilter: t('learningResourceForm.fields.tags.emptyFilter'),
            emptyList: t('learningResourceForm.fields.tags.emptyList'),
          }}
          {...commonFieldProps}
        />
        <PlainTextField
          label={t('learningResourceForm.fields.metaDescription.label')}
          description={t('learningResourceForm.fields.metaDescription.description')}
          name="metaDescription"
          maxLength={150}
          {...commonFieldProps}>
          <RemainingCharacters
            maxLength={150}
            getRemainingLabel={(maxLength, remaining) =>
              t('form.remainingCharacters', { maxLength, remaining })}
            value={bindInput('metaDescription').value
              .getCurrentContent()
              .getPlainText()}
          />
        </PlainTextField>
        <MultiSelectField
          name="authors"
          label={t('learningResourceForm.fields.authors.label')}
          messages={{
            createNew: t('learningResourceForm.fields.authors.createNew'),
            emptyFilter: t('learningResourceForm.fields.authors.emptyFilter'),
            emptyList: t('learningResourceForm.fields.authors.emptyList'),
          }}
          {...commonFieldProps}
        />
      </Accordion>
    );
  }
}

LearningResourceMetadata.propTypes = {
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

export default injectT(LearningResourceMetadata);
