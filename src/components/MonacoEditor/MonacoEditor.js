/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import * as monaco from 'monaco-editor';

class MonacoEditor extends Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  componentDidMount() {
    monaco.editor.create(this.container.current, {
      value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join(
        '\n',
      ),
      language: 'javascript',
    });
  }
  render() {
    return <div ref={this.container} />;
  }
}

export default MonacoEditor;
