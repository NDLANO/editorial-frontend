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
import Lightbox from './Lightbox';
import DisplayEmbedTag from './DisplayEmbedTag';
import * as actions from '../containers/ImageSearch/imageActions';
import { Field, FieldErrorMessages, classes } from './Fields';
import VisualElementSearch from './VisualElementSearch';

class VisualElementSelectField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.handleVisualElementChange = this.handleVisualElementChange.bind(this);
    this.removeVisualElement = this.removeVisualElement.bind(this);
    this.onImageLightboxClose = this.onImageLightboxClose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isOpen !== nextProps.showVisualElement) {
      this.setState({isOpen: nextProps.showVisualElement});
      if (nextProps.showVisualElement) {
        this.props.searchImages();
      }
    }
  }

  onImageLightboxClose() {
    const { onChange, toggleShowVisualElement } = this.props;
    onChange({
      target: {
        name: 'visualElementType',
        value: '',
      }
    });
    toggleShowVisualElement()
    this.setState(() => ({ isOpen: false }));
  }

  handleVisualElementChange(visualElement) {
    const { name, onChange, toggleShowVisualElement } = this.props;
    onChange({
      target: {
        name,
        value: visualElement.id,
      },
    });
    toggleShowVisualElement();
    this.setState(() => ({ isOpen: false }));
  }

  removeVisualElement() {
    const { onChange } = this.props;
    ['visualElementId', 'visualElementCaption', 'visualElementAlt', 'visualElementType'].forEach((name) => {
      onChange({
        target: {
          name,
          value: '',
        },
      });
    });
  }

  render() {
    const { name, label, schema, submitted, value, embedTag } = this.props;
    if (value) {
      return (
        <Field>
          <div {...classes('visual-element-container')} >
            <DisplayEmbedTag embedTag={embedTag} {...classes('visual-element')}/>
            <Button onClick={this.removeVisualElement}>Fjern element</Button>
          </div>
        </Field>
      )
    }

    return (
      <Field>
        <Lightbox
          display={this.state.isOpen}
          big
          onClose={this.onImageLightboxClose}>
          <VisualElementSearch embedTag={embedTag} handleVisualElementChange={this.handleVisualElementChange} />
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
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  searchImages: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
  embedTag: PropTypes.shape({
    caption: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
  }),
  showVisualElement: PropTypes.bool.isRequired,
  toggleShowVisualElement: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  searchImages: actions.searchImages,
};

export default connect(undefined, mapDispatchToProps)(VisualElementSelectField);
