/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { FormikHandlers } from 'formik';
import { Plugin, Value, DocumentJSON } from 'slate';
import { Editor } from 'slate-react';

import createSlateStore from './createSlateStore';
import { renderBlock } from './slateRendering';
import { VisualElement } from '../../interfaces';

interface Props {
  name: string;
  value: VisualElement;
  plugins: Plugin[];
  onChange: FormikHandlers['handleChange'];
}

const VisualElementEditor = class extends React.PureComponent<
  Props,
  { slateStore: object } // Since the redux-actions we are using doesn't have types
> {
  constructor(props: Props) {
    super(props);

    const slateStore = createSlateStore();
    this.state = {
      slateStore,
    };

    this.onChangeVisualElement = this.onChangeVisualElement.bind(this);
  }

  onChangeVisualElement = (change: { value: Value }) => {
    const node = change.value.toJSON()?.document?.nodes?.[0] as DocumentJSON;
    this.props.onChange({
      target: {
        name: this.props.name,
        value: node?.data || {},
      },
    });
  };

  render() {
    const editorValue = Value.fromJSON({
      document: {
        nodes: [
          {
            object: 'block',
            type: 'embed',
            data: this.props.value,
            nodes: [
              {
                marks: [],
                object: 'text',
                text: '',
              },
            ],
          },
        ],
      },
    });

    return (
      <Editor
        name={this.props.name}
        value={editorValue}
        plugins={this.props.plugins}
        slateStore={this.state.slateStore}
        renderBlock={renderBlock}
        onChange={this.onChangeVisualElement}
      />
    );
  }
};

export default VisualElementEditor;
