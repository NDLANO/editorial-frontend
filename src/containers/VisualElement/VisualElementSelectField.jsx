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
import DisplayEmbedTag from '../../components/DisplayEmbedTag';
import * as api from './visualElementApi';
import { Field, FieldErrorMessages, classes } from '../../components/Fields';
import VisualElementSearch from './VisualElementSearch';
import VisualElementInformation from './VisualElementInformation';
import { getLocale } from '../../modules/locale/locale';
import { alttextsI18N, captionsI18N } from '../../util/i18nFieldFinder';

class VisualElementSelectField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      visualElement: undefined,
    };
    this.handleVisualElementChange = this.handleVisualElementChange.bind(this);
    this.removeVisualElement = this.removeVisualElement.bind(this);
    this.onImageLightboxClose = this.onImageLightboxClose.bind(this);
  }
  componentWillMount() {
    const { embedTag } = this.props;
    if (embedTag.id){
      api
        .fetchVisualElement(embedTag)
        .then(visualElement => this.setState({ visualElement }));
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.isOpen !== nextProps.showVisualElement) {
      this.setState({ isOpen: nextProps.showVisualElement });
    }
  }

  onImageLightboxClose() {
    const { onChange, toggleShowVisualElement } = this.props;
    onChange({
      target: {
        name: 'visualElementType',
        value: '',
      },
    });
    toggleShowVisualElement();
    this.setState(() => ({ isOpen: false }));
  }

  handleVisualElementChange(visualElement) {
    const { name, onChange, toggleShowVisualElement, locale } = this.props;
    onChange({
      target: {
        name,
        value: visualElement.id,
      },
    });

    const altText = alttextsI18N(visualElement, locale, true);
    const caption = captionsI18N(visualElement, locale, true);
    const visualElementTexts = [
      { name: 'visualElementAlt', value: altText || '' },
      { name: 'visualElementCaption', value: caption || '' },
    ];

    visualElementTexts.forEach(text =>
      onChange({ target: { name: text.name, value: text.value } }),
    );

    toggleShowVisualElement();
    this.setState(() => ({ isOpen: false, visualElement }));
  }

  removeVisualElement() {
    const { onChange } = this.props;

    this.setState({ visualElement: undefined });
    [
      'visualElementId',
      'visualElementCaption',
      'visualElementAlt',
      'visualElementType',
    ].forEach(name => {
      onChange({
        target: {
          name,
          value: '',
        },
      });
    });
  }

  render() {
    const {
      name,
      label,
      schema,
      submitted,
      value,
      embedTag,
      locale,
    } = this.props;
    if (value) {
      return (
        <Field>
          <div {...classes('visual-element-container')}>
            <div {...classes('visual-element', 'left')}>
              <DisplayEmbedTag
                embedTag={embedTag}
                {...classes('visual-element')}
              />
            </div>
            <div {...classes('visual-element', 'right')}>
              <VisualElementInformation
                visualElement={this.state.visualElement}
                embedTag={embedTag}
                locale={locale}
              />
              <Button onClick={this.removeVisualElement}>Fjern element</Button>
            </div>
          </div>
        </Field>
      );
    }

    return (
      <Field>
        <Lightbox
          display={this.state.isOpen}
          big
          onClose={this.onImageLightboxClose}>
          <VisualElementSearch
            embedTag={embedTag}
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
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
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
  locale: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(VisualElementSelectField);
