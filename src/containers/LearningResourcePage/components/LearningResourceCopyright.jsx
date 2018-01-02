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
import { SelectObjectField } from '../../../components/Fields';
import { AsyncDropDown } from '../../../components/Dropdown';
import { CommonFieldPropsShape } from '../../../shapes';
import Accordion from '../../../components/Accordion';
import Contributors from '../../../components/Contributors/Contributors';
import * as agreementApi from '../../VisualElement/visualElementApi';

class LearningResourceCopyright extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenContent: true,
    };
    this.toggleContent = this.toggleContent.bind(this);
  }

  toggleContent() {
    this.setState(prevState => ({
      hiddenContent: !prevState.hiddenContent,
    }));
  }

  searchAgreements() {

  }

  render() {
    const { t, commonFieldProps, licenses } = this.props;

    return (
      <Accordion
        handleToggle={this.toggleContent}
        header={t('form.copyrightSection')}
        hidden={this.state.hiddenContent}
        fill>
        <Contributors
          name="creators"
          label={t('form.creators.label')}
          {...commonFieldProps}
        />
        <Contributors
          name="rightsholders"
          label={t('form.rightsholders.label')}
          {...commonFieldProps}
        />
        <Contributors
          name="processors"
          label={t('form.processors.label')}
          {...commonFieldProps}
        />
        <AsyncDropDown
          valueField='id'
          textField="title"
          {...commonFieldProps.bindInput('agreementId')}
        />
        <SelectObjectField
          name="license"
          label={t('form.license.label')}
          options={licenses}
          idKey="license"
          labelKey="description"
          {...commonFieldProps}
        />
      </Accordion>
    );
  }
}

LearningResourceCopyright.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
};

export default injectT(LearningResourceCopyright);
