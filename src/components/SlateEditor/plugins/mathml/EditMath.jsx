/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { uuid } from '@ndla/util';
import EditMathModal from './EditMathModal';

const emptyMathTag = '<math xmlns="http://www.w3.org/1998/Math/MathML"/>';

class EditMath extends Component {
  constructor(props) {
    super(props);
    const { innerHTML } = props.model;
    this.state = {
      openDiscardModal: false,
      renderMathML: innerHTML ? innerHTML : emptyMathTag,
      initialMathML: innerHTML ? innerHTML : emptyMathTag,
    };
    this.mathEditor = undefined;
    this.id = uuid();
    this.previewMath = this.previewMath.bind(this);
    this.handleExit = this.handleExit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancelDiscard = this.handleCancelDiscard.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
  }

  componentDidMount() {
    // force set state to trigger rerender.
    this.setState({});
    const { renderMathML } = this.state;
    const { i18n } = this.props;
    const locale = i18n.language;

    const script = document.createElement('script');
    script.src = 'https://www.wiris.net/client/editor/editor';

    const outer = this;

    const callback = function() {
      outer.mathEditor = window.com.wiris.jsEditor.JsEditor.newInstance({
        language: locale,
      });

      outer.mathEditor.setMathML(renderMathML);
      outer.mathEditor.insertInto(document.getElementById(`mathEditorContainer-${outer.id}`));
      outer.mathEditor.focus();
    };
    script.onload = callback;

    document.head.appendChild(script);
  }

  handleExit() {
    const { initialMathML } = this.state;
    const { onExit } = this.props;
    const mathML = this.mathEditor.getMathML();
    if (initialMathML !== mathML) {
      this.setState({ openDiscardModal: true });
    } else {
      onExit();
    }
  }

  handleSave() {
    const { handleSave } = this.props;
    handleSave(this.mathEditor.getMathML());
  }

  previewMath() {
    const renderMathML = this.mathEditor.getMathML();
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
        id={this.id}
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
  i18n: PropTypes.shape({
    language: PropTypes.string.isRequired,
  }).isRequired,
  onExit: PropTypes.func,
  handleSave: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  model: PropTypes.shape({
    innerHTML: PropTypes.string,
  }),
};

export default withTranslation()(EditMath);
