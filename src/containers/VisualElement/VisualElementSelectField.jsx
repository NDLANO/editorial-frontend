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
import { Field, FieldErrorMessages, classes } from '../../components/Fields';
import VisualElementSearch from './VisualElementSearch';
import VisualElementInformation from './VisualElementInformation';
import { getLocale } from '../../modules/locale/locale';
import { alttextsI18N, captionsI18N } from '../../util/i18nFieldFinder';

class VisualElementSelectField extends Component {
  constructor(props) {
    super(props);
    this.handleVisualElementChange = this.handleVisualElementChange.bind(this);
    this.removeVisualElement = this.removeVisualElement.bind(this);
    this.onImageLightboxClose = this.onImageLightboxClose.bind(this);
  }

  componentWillMount() {
    const { value } = this.props;
    if (value.id && value.resource !== 'h5p') {
      api
        .fetchVisualElement(value)
        .then(visualElementMetaData =>
          this.setState({ visualElementMetaData }),
        );
    }
  }

  onImageLightboxClose() {
    const { toggleShowVisualElement } = this.props;
    toggleShowVisualElement();
  }

  handleVisualElementChange(visualElement) {
    const {
      name,
      onChange,
      selectedResource,
      toggleShowVisualElement,
      locale,
    } = this.props;

    const alt = alttextsI18N(visualElement, locale, true);
    const caption = captionsI18N(visualElement, locale, true);

    onChange({
      target: {
        name,
        value: {
          ...visualElement,
          resource: selectedResource,
          alt,
          caption,
        },
      },
    });

    toggleShowVisualElement();
  }

  removeVisualElement() {
    const { onChange, onRemoveVisualElement } = this.props;

    this.setState({ visualElementMetaData: undefined });
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
      showVisualElement,
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
                visualElement={this.state.visualElementMetaData}
                embedTag={value}
                locale={locale}
              />
              <Button onClick={this.removeVisualElement}>Fjern element</Button>
            </div>
          </div>
        </Field>
      );
    }

    if (!showVisualElement) {
      return null;
    }

    return (
      <Field>
        <Lightbox
          display={showVisualElement}
          big
          onClose={this.onImageLightboxClose}>
          <VisualElementSearch
            selectedResource={selectedResource}
            embedTag={value}
            handleVisualElementChange={this.handleVisualElementChange}
          />
        </Lightbox>
        <FieldErrorMessages
          label={label}
          field={schema.fields[name]}
          submitted={submitted}
        />
      </Field>
    );
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
  showVisualElement: PropTypes.bool.isRequired,
  toggleShowVisualElement: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(VisualElementSelectField);
