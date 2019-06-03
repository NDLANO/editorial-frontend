/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import BEMHelper from 'react-bem-helper';
import { FieldHeader } from '@ndla/forms';
import VisualElementSelectField from '../../VisualElement/VisualElementSelectField';
import VisualElementMenu from '../../VisualElement/VisualElementMenu';
import VisualElement from '../../VisualElement/VisualElement';
import FormikField from '../../../components/FormikField';

export const visualElementClasses = new BEMHelper({
  name: 'visual-element',
  prefix: 'c-',
});

class TopicArticleVisualElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedResource: undefined,
    };
  }

  resetSelectedResource = () => {
    this.setState({ selectedResource: undefined });
  };

  handleSelectResource = selectedResource => {
    this.setState({ selectedResource });
  };

  render() {
    const { t } = this.props;
    const { selectedResource } = this.state;
    return (
      <FormikField name="visualElement">
        {({ field }) => (
          <div>
            <FieldHeader title={t('form.visualElement.title')} />
            {!field.value.resource && (
              <VisualElementMenu onSelect={this.handleSelectResource} />
            )}
            <>
              <VisualElement
                label={t('form.visualElement.label')}
                changeVisualElement={this.handleSelectResource}
                resetSelectedResource={this.resetSelectedResource}
                {...field}
              />
              <VisualElementSelectField
                selectedResource={selectedResource}
                resetSelectedResource={this.resetSelectedResource}
                {...field}
              />
            </>
          </div>
        )}
      </FormikField>
    );
  }
}

TopicArticleVisualElement.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.shape({
      visualElement: PropTypes.shape({
        caption: PropTypes.string,
        alt: PropTypes.string,
        id: PropTypes.string,
        resource: PropTypes.string,
      }),
    }),
  }),
};

export default injectT(TopicArticleVisualElement);
