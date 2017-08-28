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

import { TextField, classes } from '../../../components/Fields';
import VisualElementSelectField from '../../VisualElement/VisualElementSelectField';
import VisualElementTypeSelect from '../../VisualElement/VisualElementTypeSelect';

class TopicArticleVisualElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showVisualElement: false,
      selectedResource: undefined,
    };
    this.toggleShowVisualElement = this.toggleShowVisualElement.bind(this);
  }

  toggleShowVisualElement() {
    this.setState(prevState => ({
      showVisualElement: !prevState.showVisualElement,
    }));
  }

  render() {
    const { t, bindInput, commonFieldProps } = this.props;
    const { schema, submitted } = commonFieldProps;

    const { value: visualElement } = bindInput('visualElement');

    return (
      <div>
        <div {...classes('add-visual-element-title')}>
          <span>
            {t('topicArticleForm.fields.visualElement.title')}
            <div {...classes('add-visual-element-title', 'border')} />
          </span>
        </div>
        <VisualElementTypeSelect
          schema={schema}
          submitted={submitted}
          toggleShowVisualElement={this.toggleShowVisualElement}
          value={this.state.selectedResource}
          onSelect={resource => this.setState({ selectedResource: resource })}
        />
        <VisualElementSelectField
          label={t('topicArticleForm.fields.visualElement.label')}
          schema={schema}
          submitted={submitted}
          visualElement={visualElement}
          selectedResource={this.state.selectedResource}
          onRemoveVisualElement={() =>
            this.setState({ selectedResource: undefined })}
          {...bindInput('visualElement')}
          showVisualElement={this.state.showVisualElement}
          toggleShowVisualElement={this.toggleShowVisualElement}
        />
        {visualElement.id && visualElement.resource !== 'h5p'
          ? <div>
              <TextField
                placeholder={t(
                  `topicArticleForm.fields.caption.placeholder.${visualElement.resource}`,
                )}
                label={t(
                  `topicArticleForm.fields.caption.label.${visualElement.resource}`,
                )}
                name="visualElement.caption"
                {...commonFieldProps}
                noBorder
                maxLength={300}
              />
              <TextField
                placeholder={t('topicArticleForm.fields.alt.placeholder')}
                label={t('topicArticleForm.fields.alt.label')}
                name="visualElement.alt"
                {...commonFieldProps}
                noBorder
                maxLength={300}
              />
            </div>
          : ''}
      </div>
    );
  }
}

TopicArticleVisualElement.propTypes = {
  bindInput: PropTypes.func.isRequired,
  commonFieldProps: PropTypes.shape({
    schema: PropTypes.shape({
      fields: PropTypes.object.isRequired,
      isValid: PropTypes.bool.isRequired,
    }),
    submitted: PropTypes.bool.isRequired,
    bindInput: PropTypes.func.isRequired,
  }),
  visualElement: PropTypes.shape({
    caption: PropTypes.string,
    alt: PropTypes.string,
    id: PropTypes.string,
    resource: PropTypes.string,
  }),
};

export default injectT(TopicArticleVisualElement);
