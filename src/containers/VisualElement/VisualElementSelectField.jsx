/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import Lightbox from '../../components/Lightbox';
import DisplayEmbedTag from '../../components/DisplayEmbedTag/DisplayEmbedTag';
import MetaInformation from '../../components/MetaInformation';
import { getVisualElementInformation } from '../../util/visualElementHelper';
import * as api from './visualElementApi';
import {
  Field,
  FieldErrorMessages,
  classes,
  getField,
} from '../../components/Fields';
import VisualElementSearch from './VisualElementSearch';

class VisualElementSelectField extends Component {
  constructor(props) {
    super(props);
    this.handleVisualElementChange = this.handleVisualElementChange.bind(this);
    this.removeVisualElement = this.removeVisualElement.bind(this);
    this.onImageLightboxClose = this.onImageLightboxClose.bind(this);
  }

  componentWillMount() {
    const { value, name, onChange } = this.props;

    if (value.resource && value.resource !== 'h5p') {
      api.fetchVisualElement(value).then(metaData => {
        onChange({
          target: {
            name,
            value: { ...value, metaData },
          },
        });
      });
    }
  }

  onImageLightboxClose() {
    this.props.resetSelectedResource();
  }

  handleVisualElementChange(visualElement) {
    const { name, onChange, resetSelectedResource } = this.props;

    onChange({
      target: {
        name,
        value: visualElement,
      },
    });

    resetSelectedResource();
  }

  removeVisualElement() {
    const { onChange, name, resetSelectedResource } = this.props;

    onChange({ target: { name, value: {} } });
    resetSelectedResource();
  }

  render() {
    const {
      name,
      label,
      schema,
      submitted,
      value,
      selectedResource,
      t,
    } = this.props;

    if (value.resource) {
      const visualElementAction = (
        <Button onClick={this.removeVisualElement}>
          {t('topicArticleForm.removeVisualElement')}
        </Button>
      );
      const metaTranslations = {
        title: t(`topicArticleForm.visualElementTitle.${value.resource}`),
        copyright: t('topicArticleForm.visualElementCopyright'),
      };
      const element = getVisualElementInformation(
        value.metaData,
        value.resource,
      );

      return (
        <Field>
          <div {...classes('visual-element-container')}>
            <div {...classes('visual-element', 'left')}>
              <DisplayEmbedTag
                embedTag={value}
                {...classes('visual-element', value.resource)}
              />
            </div>
            <MetaInformation
              {...element}
              action={visualElementAction}
              translations={metaTranslations}
            />
          </div>
        </Field>
      );
    }

    if (selectedResource) {
      return (
        <Lightbox
          display
          big
          fullscreen={selectedResource === 'h5p'}
          onClose={this.onImageLightboxClose}>
          <VisualElementSearch
            selectedResource={selectedResource}
            embedTag={value}
            handleVisualElementChange={this.handleVisualElementChange}
          />
        </Lightbox>
      );
    }

    return (
      <Field>
        <FieldErrorMessages
          label={label}
          field={getField(name, schema)}
          submitted={submitted}
        />
      </Field>
    );
  }
}

VisualElementSelectField.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  selectedResource: PropTypes.string,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
  value: PropTypes.shape({
    resource: PropTypes.string,
    metaData: PropTypes.object,
  }).isRequired,
  resetSelectedResource: PropTypes.func.isRequired,
};

export default injectT(VisualElementSelectField);
