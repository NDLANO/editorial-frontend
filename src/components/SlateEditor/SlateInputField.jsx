/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { isEmpty } from '../validators';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const SlateInputLabel = ({ label, focus, value }) => {
  if (!focus || isEmpty(value)) {
    return null;
  }
  return (
    <div {...classes('figure-focus-input-label')}>
      <span {...classes('figure-focus-input-text')}>
        {label}
      </span>
    </div>
  );
};

SlateInputLabel.propTypes = {
  label: PropTypes.string.isRequired,
  focus: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};

SlateInputLabel.defaultProps = {
  focus: false,
};

class SlateInputField extends React.Component {
  constructor() {
    super();
    this.onFigureInputClick = this.onFigureInputClick.bind(this);
    this.onFigureInputBlur = this.onFigureInputBlur.bind(this);
    this.state = {
      focus: false,
    };
  }

  onFigureInputClick(e) {
    e.stopPropagation();
    this.setState({ focus: true });
  }

  onFigureInputBlur() {
    this.setState({ focus: false });
  }

  render() {
    const { label, name, value, ...rest } = this.props;

    return (
      <div>
        <SlateInputLabel label={label} value={value} focus={this.state.focus} />
        <input
          id={name}
          name={name}
          value={value}
          onClick={this.onFigureInputClick}
          onBlur={this.onFigureInputBlur}
          {...rest}
        />
      </div>
    );
  }
}

SlateInputField.propTypes = {
  embedTag: PropTypes.shape({
    caption: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
  }),
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
};

SlateInputField.defaultProps = {
  value: '',
};

export default SlateInputField;
