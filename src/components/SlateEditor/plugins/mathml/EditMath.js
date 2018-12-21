/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import Types from 'slate-prop-types';
import PropTypes from 'prop-types';
import EditMathModal from './EditMathModal';

let mathEditor;

class EditMath extends Component {
  constructor(props) {
    super(props);
    const { node } = props;
    const { innerHTML } = node.data.toJS();
    this.state = {
      initialMathML: innerHTML ? `<math>${innerHTML}</math>` : undefined,
      mathML: `<math>${innerHTML}</math>`,
    };
    this.previewMath = this.previewMath.bind(this);
    this.onHandleExit = this.onHandleExit.bind(this);
    this.onHandleExitSave = this.onHandleExitSave.bind(this);
    this.onHandleExitRemove = this.onHandleExitRemove.bind(this);
  }

  componentDidMount() {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }

    if (window.com.wiris) {
      mathEditor = window.com.wiris.jsEditor.JsEditor.newInstance({
        language: 'en',
      });
      mathEditor.setMathML(this.state.mathML);
      mathEditor.insertInto(document.getElementById('mathEditorContainer'));
    }
  }

  componentDidUpdate() {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  }

  onHandleExit(closeModal) {
    const { initialMathML, mathML } = this.state;

    if (initialMathML !== undefined && initialMathML !== mathML) {
      console.log('Unsaved changes'); // TODO warn if math has changed
    }
    closeModal();
  }

  onHandleExitSave(closeModal) {
    const { mathML } = this.state;
    const { handleSave } = this.props;

    handleSave(mathML);
    closeModal();
  }

  onHandleExitRemove(closeModal) {
    const { onRemoveClick } = this.props;

    onRemoveClick();
    closeModal();
  }

  previewMath() {
    const mathML = mathEditor.getMathML();
    this.setState({ mathML });
  }

  render() {
    const { mathML } = this.state;
    const { onExit, isEditMode } = this.props;

    if (!isEditMode) {
      return null;
    }

    return (
      <EditMathModal
        handleExit={this.onHandleExit}
        handleSave={this.onHandleExitSave}
        handleRemove={this.onHandleExitRemove}
        onExit={onExit}
        previewMath={this.previewMath}
        isEditMode={isEditMode}
        mathML={mathML}
      />
    );
  }
}

EditMath.propTypes = {
  onExit: PropTypes.func,
  handleSave: PropTypes.func.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  node: Types.node.isRequired,
};

export default EditMath;
