/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import EditMathModal from './EditMathModal';
import { getLocale } from '../../../../modules/locale/locale';

const mathOpenTag = '<math xmlns="http://www.w3.org/1998/Math/MathML">';
const mathCloseTag = '</math>';
const emptyMathTag = '<math xmlns="http://www.w3.org/1998/Math/MathML"/>';
let mathEditor;

class EditMath extends Component {
  constructor(props) {
    super(props);
    const { innerHTML } = props.model;
    this.state = {
      openDiscardModal: false,
      renderMathML: innerHTML ? innerHTML : emptyMathTag,
      initialMathML: innerHTML ? innerHTML : emptyMathTag,
    };
    this.previewMath = this.previewMath.bind(this);
    this.handleExit = this.handleExit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancelDiscard = this.handleCancelDiscard.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
  }

  componentDidMount() {
    const { renderMathML } = this.state;
    const { locale } = this.props;

    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }

    const script = document.createElement('script');
    script.src = 'https://www.wiris.net/client/editor/editor';

    const callback = function() {
      mathEditor = window.com.wiris.jsEditor.JsEditor.newInstance({
        language: locale,
      });

      mathEditor.setMathML(renderMathML);
      mathEditor.insertInto(document.getElementById('mathEditorContainer'));
    };
    script.onload = callback;

    document.head.appendChild(script);
  }

  componentDidUpdate() {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  }

  handleExit() {
    const { initialMathML } = this.state;
    const { onExit } = this.props;
    const mathML = mathEditor.getMathML();
    if (initialMathML !== mathML) {
      this.setState({ openDiscardModal: true });
    } else {
      onExit();
    }
  }

  handleSave() {
    const { handleSave } = this.props;
    handleSave(mathEditor.getMathML());
  }

  previewMath() {
    const renderMathML = mathEditor.getMathML();
    this.setState({ renderMathML });
  }

  handleCancelDiscard() {
    this.setState({ openDiscardModal: false });
  }

  handleContinue() {
    const { onExit } = this.props;
    onExit();
  }

  render() {
    const { renderMathML, openDiscardModal } = this.state;
    const { handleRemove } = this.props;

    return (
      <EditMathModal
        handleExit={this.handleExit}
        handleSave={this.handleSave}
        handleCancelDiscard={this.handleCancelDiscard}
        handleContinue={this.handleContinue}
        handleRemove={handleRemove}
        previewMath={this.previewMath}
        openDiscardModal={openDiscardModal}
        renderMathML={renderMathML}
      />
    );
  }
}

EditMath.propTypes = {
  locale: PropTypes.string.isRequired,
  onExit: PropTypes.func,
  handleSave: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  model: PropTypes.shape({
    innerHTML: PropTypes.string,
  }),
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(EditMath);
