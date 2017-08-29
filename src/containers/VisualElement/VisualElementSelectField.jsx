/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'ndla-ui';
import Lightbox from '../../components/Lightbox';
import DisplayEmbedTag from '../../components/DisplayEmbedTag/DisplayEmbedTag';
import * as api from './visualElementApi';
import {
  Field,
  FieldErrorMessages,
  classes,
  getField,
} from '../../components/Fields';
import VisualElementSearch from './VisualElementSearch';
import VisualElementInformation from './VisualElementInformation';
import { getLocale } from '../../modules/locale/locale';

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
    const { resetSelectedResource } = this.props;
    resetSelectedResource();
  }

  handleVisualElementChange(visualElement) {
    const {
      name,
      onChange,
      selectedResource,
      resetSelectedResource,
    } = this.props;

    onChange({
      target: {
        name,
        value: {
          ...visualElement,
          resource: selectedResource,
        },
      },
    });

    resetSelectedResource();
  }

  removeVisualElement() {
    const { onChange, onRemoveVisualElement } = this.props;

    onChange({ target: { name: 'visualElement', value: {} } });
    onRemoveVisualElement();
  }

  render() {
    const {
      name,
      label,
      schema,
      submitted,
      value,
      locale,
      selectedResource,
    } = this.props;

    if (value.resource) {
      return (
        <Field>
          <div {...classes('visual-element-container')}>
            <div {...classes('visual-element', 'left')}>
              <DisplayEmbedTag
                embedTag={value}
                {...classes('visual-element', value.resource)}
              />
            </div>
            <div {...classes('visual-element', 'right')}>
              <VisualElementInformation
                visualElement={value.metaData}
                embedTag={value}
                locale={locale}
              />
              <Button onClick={this.removeVisualElement}>Fjern element</Button>
            </div>
          </div>
        </Field>
      );
    }

    if (selectedResource) {
      return (
        <Field>
          <Lightbox display big onClose={this.onImageLightboxClose}>
            <VisualElementSearch
              selectedResource={selectedResource}
              embedTag={value}
              handleVisualElementChange={this.handleVisualElementChange}
            />
          </Lightbox>
          <FieldErrorMessages
            label={label}
            field={getField(schema, name)}
            submitted={submitted}
          />
        </Field>
      );
    }
    return null;
  }
}

VisualElementSelectField.propTypes = {
  onChange: PropTypes.func.isRequired,
  onRemoveVisualElement: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  selectedResource: PropTypes.string,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
  value: PropTypes.shape({
    caption: PropTypes.string,
    alt: PropTypes.string,
    id: PropTypes.string,
    resource: PropTypes.string,
  }).isRequired,
  resetSelectedResource: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(VisualElementSelectField);
