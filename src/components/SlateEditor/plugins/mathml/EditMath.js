/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Types from 'slate-prop-types';
import PropTypes from 'prop-types';
import he from 'he';

import EditMathModal from './EditMathModal';
import { getLocale } from '../../../../modules/locale/locale';

const mathOpenTag = '<math xmlns="http://www.w3.org/1998/Math/MathML">';
const mathCloseTag = '</math>';
let mathEditor;

class EditMath extends Component {
  constructor(props) {
    super(props);
    const { innerHTML } = props.model;
    this.state = {
      initialMathML: innerHTML
        ? `${mathOpenTag}${he.decode(innerHTML)}${mathCloseTag}`
        : '',
      mathML: innerHTML
        ? `${mathOpenTag}${he.decode(innerHTML)}${mathCloseTag}`
        : '',
    };
    this.previewMath = this.previewMath.bind(this);
    this.onHandleExit = this.onHandleExit.bind(this);
    this.onHandleExitSave = this.onHandleExitSave.bind(this);
    this.onHandleExitRemove = this.onHandleExitRemove.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onContinue = this.onContinue.bind(this);
  }

  componentDidMount() {
    const { locale } = this.props;

    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }

    if (window.com.wiris) {
      mathEditor = window.com.wiris.jsEditor.JsEditor.newInstance({
        language: locale,
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
    const { initialMathML, hasSaved } = this.state;
    const mathML = he.decode(mathEditor.getMathML());

    if (!hasSaved && initialMathML !== undefined && initialMathML !== mathML) {
      this.setState({ openDiscardModal: true });
    } else {
      closeModal();
    }
  }

  onHandleExitSave(closeModal) {
    const { handleSave } = this.props;

    let saveMathML = he.decode(mathEditor.getMathML());

    // Removes outer tags for embed saving
    saveMathML = saveMathML.replace(mathOpenTag, '');
    saveMathML = saveMathML.replace(mathCloseTag, '');

    handleSave(saveMathML);
    this.setState({ hasSaved: true }, closeModal);
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

  onCancel() {
    this.setState({ openDiscardModal: false });
  }

  onContinue() {
    const { onExit } = this.props;
    onExit();
  }

  render() {
    const { mathML, openDiscardModal } = this.state;
    const { onExit, isEditMode } = this.props;

    if (!isEditMode) {
      return null;
    }

    return (
      <EditMathModal
        handleExit={this.onHandleExit}
        handleSave={this.onHandleExitSave}
        handleRemove={this.onHandleExitRemove}
        handleCancel={this.onCancel}
        handleContinue={this.onContinue}
        onExit={onExit}
        previewMath={this.previewMath}
        isEditMode={isEditMode}
        openDiscardModal={openDiscardModal}
        mathML={mathML}
      />
    );
  }
}

EditMath.propTypes = {
  locale: PropTypes.string.isRequired,
  onExit: PropTypes.func,
  handleSave: PropTypes.func.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  node: Types.node.isRequired,
  model: PropTypes.shape({
    innerHTML: PropTypes.string.isRequired,
  }),
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(EditMath);
