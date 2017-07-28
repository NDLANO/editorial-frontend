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
import { TextField } from '../../../components/Fields';
import Accordion from '../../../components/Accordion';

class LearningResourceContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenContent: false,
    };
    this.toggleContent = this.toggleContent.bind(this);
  }

  toggleContent() {
    this.setState(prevState => ({
      hiddenContent: !prevState.hiddenContent,
    }));
  }

  render() {
    const { t, commonFieldProps } = this.props;

    return (
      <Accordion
        handleToggle={this.toggleContent}
        header={t('learningResourceForm.content')}
        hidden={this.state.hiddenContent}>
        <TextField
          label={t('learningResourceForm.fields.title.label')}
          name="title"
          big
          noBorder
          placeholder={t('learningResourceForm.fields.title.label')}
          {...commonFieldProps}
        />
      </Accordion>
    );
  }
}

LearningResourceContent.propTypes = {
  commonFieldProps: PropTypes.shape({
    schema: PropTypes.shape({
      fields: PropTypes.object.isRequired,
      isValid: PropTypes.bool.isRequired,
    }),
    submitted: PropTypes.bool.isRequired,
  }),
  classes: PropTypes.func.isRequired,
};

export default injectT(LearningResourceContent);
