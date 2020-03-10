/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import { Node } from 'slate';
import { RenderElementProps, RenderLeafProps } from 'slate-react';
import Tooltip from '@ndla/tooltip';
import RichTextEditor from './RichTextEditor';
import StyledFormContainer from './common/StyledFormContainer';
import CrossButton from '../CrossButton';

interface Props {
  onChange: Function;
  submitted: boolean;
  value: [Node[]];
  name: string;
  removeSection: Function;
  plugins: Array<Object>;
  children: any;
  renderElement: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
  onBlur: () => void;
  'data-cy': string;
  setFieldValue: Function;
  placeholder: string;
}

const RichBlockTextEditor = (props: Props) => {
  const {
    submitted,
    value,
    name,
    plugins,
    children,
    renderElement,
    renderLeaf,
    onBlur,
    setFieldValue,
    placeholder
  } = props;

  const onChange = (evt: any, index: number) => {
    const newValue = value ;
    newValue[index] = evt.target.value;
    props.onChange({
      target: {
        value: newValue,
        name,
      },
    });
  }

  const removeSection = (index: number) => {
    if (value.length > 1) {
      const newValue = value;
      newValue.splice(index, 1);
      setFieldValue(name, newValue)
    }
  }

  return (
    <article>
      {value.map((blockValue, index) => (
        <StyledFormContainer
          key={`editor_${index}`} // eslint-disable-line react/no-array-index-key
        >
          {value.length > 1 ? (
            <Tooltip
              // FIXME: Should be coming from i18n / translatefunc
              tooltip="Ta bort seksjon"
              tooltipContainerClass="tooltipContainerClass">
              <CrossButton
                stripped
                onClick={() => removeSection(index)}
              />
            </Tooltip>
          ) : null}
          <RichTextEditor
            data-cy={props['data-cy']}
            placeholder={placeholder}
            plugins={plugins}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            submitted={submitted}
            onChange={onChange}
            value={blockValue}
            removeSection={removeSection}
            onBlur={onBlur}
          />
          {children}
        </StyledFormContainer>
      ))}
    </article>
  );
}

export default RichBlockTextEditor;
