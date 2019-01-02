/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button'; //checked
import { css } from 'react-emotion';
import { Cross } from '@ndla/icons/action';
import RichTextEditor from './RichTextEditor';
import { PluginShape } from '../../shapes';
import { formClasses } from '../../containers/Form';

const removeSectionButtonStyle = css`
  display: none;
`;

const removeSectionButtonHoverStyle = css`
  color: red;
  display: block;
  float: right;
`;

class RichBlockTextEditor extends Component {
  constructor(props) {
    super(props);
    this.onContentChange = this.onContentChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.removeSection = this.removeSection.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);

    this.state = {
      hover: -1,
    };
  }

  onChange(indexValue, index) {
    const { name, onChange, value } = this.props;
    const newValue = [].concat(value);
    newValue[index] = { value: indexValue, index };
    const changedValue = {
      target: {
        value: newValue,
        name,
        type: 'SlateEditorValue',
      },
    };

    onChange(changedValue);
  }

  onContentChange(e, index) {
    this.onChange(e.target.value, index);
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
      onFocus,
      onBlur,
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
              <Button
                stripped
                onClick={() => this.removeSection(index)}
                css={
                  this.state.hover === index
                    ? removeSectionButtonHoverStyle
                    : removeSectionButtonStyle
                }>
                <Cross />
              </Button>
            ) : null}
            <RichTextEditor
              name={name}
              schema={schema}
              onChange={e => this.onContentChange(e, index)}
              onFocus={() => onFocus({ target: { name }, type: 'focus' })}
              onBlur={() => onBlur({ target: { name }, type: 'blur' })}
              isBlock
              {...rest}
              value={val.value}
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
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  submitted: PropTypes.bool.isRequired,
  plugins: PropTypes.arrayOf(PluginShape).isRequired,
};

export default RichBlockTextEditor;
