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
import Tooltip from '@ndla/tooltip';
import RichTextEditor from './RichTextEditor';
import StyledFormContainer from './common/StyledFormContainer';
import { PluginShape } from '../../shapes';
import CrossButton from '../CrossButton';

class RichBlockTextEditor extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.removeSection = this.removeSection.bind(this);
  }

  onChange(evt, index) {
    const { onChange, value } = this.props;
    const newValue = [].concat(value);
    newValue[index] = { value: evt.target.value, index };
    onChange(newValue);
  }

  removeSection(index) {
    const { onChange, value } = this.props;
    if (value.length > 1) {
      const newValue = [].concat(value);
      newValue.splice(index, 1);
      onChange(newValue);
    }
  }

  render() {
    const { schema, children, value, name } = this.props;
    return (
      <article>
        {value.map((blockValue, index) => (
          <StyledFormContainer
            key={`editor_${index}`} // eslint-disable-line react/no-array-index-key
          >
            {value.length > 1 ? (
              <Tooltip
                tooltip="Ta bort seksjon"
                tooltipContainerClass="tooltipContainerClass">
                <CrossButton
                  stripped
                  onClick={() => this.removeSection(index)}
                />
              </Tooltip>
            ) : null}
            <RichTextEditor
              name={name}
              schema={schema}
              onChange={this.onChange}
              value={blockValue.value}
              index={index}
              removeSection={this.removeSection}
            />
            {children}
          </StyledFormContainer>
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
