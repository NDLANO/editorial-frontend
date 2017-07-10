/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import { Button } from 'ndla-ui';
import Lightbox from './Lightbox';
import DisplayEmbedTag from './DisplayEmbedTag';
import { Field, FieldErrorMessages, classes } from './Fields';
import { resolveJsonOrRejectWithError } from '../util/apiHelpers';

class H5PSelectField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: undefined,
      isOpen: false,
    };
    this.handleH5PChange = this.handleH5PChange.bind(this);
    this.onLightboxOpen = this.onLightboxOpen.bind(this);
    this.onLightboxClose = this.onLightboxClose.bind(this);
  }

  componentDidMount() {
    window.addEventListener('message', this.handleH5PChange);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleH5PChange);
  }

  onLightboxOpen() {
    fetch('https://h5p-test.ndla.no/select', {
      method: 'POST',
      headers: { Authorization: `Bearer JWT-token` },
    })
      .then(resolveJsonOrRejectWithError)
      .then(data => {
        this.setState(() => ({ url: data.url }));
      });

    this.setState(() => ({ isOpen: true }));
  }

  onLightboxClose() {
    this.setState(() => ({ isOpen: false }));
  }

  handleH5PChange(event) {
    const { name, onChange } = this.props;
    if (event.data.type !== 'h5p') {
      return;
    }

    onChange({
      target: {
        name,
        value: event.target.oembed_url,
      },
    });
    this.setState(() => ({ isOpen: false }));
  }

  render() {
    const { name, label, schema, submitted, value, embedTag } = this.props;

    return (
      <Field>
        {value
          ? <Button stripped onClick={this.onLightboxOpen}>
              <DisplayEmbedTag embedTag={embedTag} />
            </Button>
          : <Button
              outline
              {...classes('add-visual-element')}
              onClick={this.onLightboxOpen}>
              Legg til H5P
            </Button>}
        <Lightbox
          display={this.state.isOpen}
          big
          onClose={this.onLightboxClose}>
          <h2>H5P</h2>
          {this.state.url
            ? <iframe
                src={this.state.url}
                title="H5P"
                frameBorder="0"
                height="900"
              />
            : null}
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

H5PSelectField.propTypes = {
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
};

export default H5PSelectField;
