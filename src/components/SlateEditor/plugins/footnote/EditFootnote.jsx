/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import Types from 'slate-prop-types';
import { compose } from 'redux';
import FootnoteForm, { getInitialModel } from './FootnoteForm';
import connectLightbox from '../utils/connectLightbox';
import { TYPE } from './';

class EditFootnote extends Component {
  constructor() {
    super();
    this.state = {
      model: undefined,
      nodeKey: undefined,
    };
    this.addFootnoteData = this.addFootnoteData.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentWillMount() {
    const { node } = this.props;
    if (node.data) {
      this.addFootnoteData(node);
    }
  }

  componentDidMount() {
    this.props.blur(); // blur on mounth to prevent accidental typing
  }

  handleRemove() {
    const { state, handleStateChange, closeDialog } = this.props;
    if (this.state.nodeKey) {
      const nextState = state.change().removeNodeByKey(this.state.nodeKey);
      handleStateChange(nextState);
      closeDialog();
    }
  }

  handleSave(data) {
    const { state, handleStateChange, closeDialog } = this.props;
    const change = state.change();
    if (this.state.nodeKey) {
      handleStateChange(change.setNodeByKey(this.state.nodeKey, { data }));
    } else {
      handleStateChange(
        change.collapseToEnd().insertText('#').extend(-1).wrapInline({
          type: TYPE,
          data,
        }),
      );
    }
    closeDialog();
  }

  addFootnoteData(footnoteNode) {
    const model = footnoteNode.data.toJS();
    this.setState({
      model,
      nodeKey: footnoteNode.key,
    });
  }

  render() {
    const { model } = this.state;
    const { t, closeDialog } = this.props;
    const isEdit = model !== undefined;

    return (
      <div>
        <h2>
          {t(`form.content.footnote.${isEdit ? 'editTitle' : 'addTitle'}`)}
        </h2>
        <FootnoteForm
          initialModel={getInitialModel(model)}
          onClose={closeDialog}
          isEdit={isEdit}
          onRemove={this.handleRemove}
          onSave={this.handleSave}
        />
      </div>
    );
  }
}

EditFootnote.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  handleStateChange: PropTypes.func.isRequired,
  blur: PropTypes.func.isRequired,
  state: Types.state.isRequired,
  node: PropTypes.oneOfType([
    Types.node,
    PropTypes.shape({ type: PropTypes.string.isRequired }),
  ]),
};

export default compose(connectLightbox(() => TYPE), injectT)(EditFootnote);
