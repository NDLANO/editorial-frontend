/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { css } from 'react-emotion';
import RichTextEditor from './RichTextEditor';
import { PluginShape } from '../../shapes';
import { formClasses } from '../../containers/Form';
import CrossButton from '../CrossButton';

const removeSectionButtonStyle = css`
  display: none;
`;

const removeSectionButtonHoverStyle = css`
  color: red;
  display: block;
  float: right;
`;

class RichBlockTextEditor extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.removeSection = this.removeSection.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);

    this.state = {
      hover: -1,
    };
  }

  onChange(change, index) {
    const { onChange, value, name } = this.props;
    const newValue = [].concat(value);
    newValue[index] = { value: change.value, index };
    const changedValue = {
      target: {
        value: newValue,
        name,
      },
    };
    onChange(changedValue);
  }


  onMouseOver(index) {
    this.setState({ hover: index });
  }

  onMouseOut() {
    this.setState({ hover: -1 });
  }

  removeSection(index) {
    const { name, onChange, value } = this.props;
    if (value.length > 1) {
      const newValue = [].concat(value);
      newValue.splice(index, 1);
      const changedValue = {
        target: {
          value: newValue,
          name,
          type: 'SlateEditorValue',
        },
      };
      onChange(changedValue);
    }
  }

  render() {
    const {
      schema,
      children,
      className,
      value,
      name,
      onChange,
      ...rest
    } = this.props;
    return (
      <article>
        {value.map((val, index) => (
          <div
            key={`editor_${index}`} // eslint-disable-line react/no-array-index-key
            onMouseOver={() => this.onMouseOver(index)}
            onMouseOut={this.onMouseOut}
            {...formClasses('container')}>
            {value.length > 1 ? (
              <CrossButton
                stripped
                onClick={() => this.removeSection(index)}
                css={
                  this.state.hover === index
                    ? removeSectionButtonHoverStyle
                    : removeSectionButtonStyle
                }
              />
            ) : null}
            <RichTextEditor
              name={name}
              schema={schema}
              onChange={change => this.onChange(change, index)}
              value={val.value}
              {...rest}
              index={index}
              removeSection={this.removeSection}
            />
            {children}
          </div>
        ))}
      </article>
    );
  }
}

RichBlockTextEditor.propTypes = {
  schema: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  plugins: PropTypes.arrayOf(PluginShape).isRequired,
};

export default RichBlockTextEditor;
