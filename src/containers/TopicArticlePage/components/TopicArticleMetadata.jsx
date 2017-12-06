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
import Contributors from '../../../components/Contributors/Contributors';

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
            createOption: t('form.tags.createOption'),
            emptyFilter: t('form.tags.emptyFilter'),
            emptyList: t('form.tags.emptyList'),
          }}
          {...commonFieldProps}
        />
        <PlainTextField
          label={t('form.metaDescription.label')}
          description={t('form.metaDescription.description')}
          name="metaDescription"
          maxLength={155}
          {...commonFieldProps}>
          <RemainingCharacters
            maxLength={155}
            getRemainingLabel={(maxLength, remaining) =>
              t('form.remainingCharacters', { maxLength, remaining })}
            value={bindInput('metaDescription').value.document.text}
          />
        </PlainTextField>
        <Contributors
          name="creators"
          label={t('form.creators.label')}
          {...commonFieldProps.bindInput('creators')}
          {...commonFieldProps}
        />
        <Contributors
          name="rightsholders"
          label={t('form.rightsholders.label')}
          {...commonFieldProps.bindInput('rightsholders')}
          {...commonFieldProps}
        />
        <Contributors
          name="processors"
          label={t('form.processors.label')}
          {...commonFieldProps.bindInput('processors')}
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
