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
import Button from 'ndla-button';
import { Cross } from 'ndla-icons/action';
import RichTextEditor from './RichTextEditor';
import { PluginShape } from '../../shapes';
import { formClasses } from '../../containers/Form';

class RichBlockTextEditor extends Component {
  constructor(props) {
    super(props);
    this.onContentChange = this.onContentChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.removeSection = this.removeSection.bind(this);
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
            {...formClasses('container')}>
            {value.length > 1 ? (
              <Button
                stripped
                onClick={() => this.removeSection(index)}
                {...formClasses('remove-section-button')}>
                <Cross />
              </Button>
            ) : null}
            <RichTextEditor
              name={name}
              schema={schema}
              onChange={e => this.onContentChange(e, index)}
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
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  submitted: PropTypes.bool.isRequired,
  plugins: PropTypes.arrayOf(PluginShape).isRequired,
};

export default RichBlockTextEditor;
