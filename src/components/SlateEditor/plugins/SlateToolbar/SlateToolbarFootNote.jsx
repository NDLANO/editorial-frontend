/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { Cross } from 'ndla-ui/icons';
import { hasNodeOfType } from '../utils';
import FootNoteForm, { getInitialModel } from './FootNoteForm';
import { toolbarClasses } from './SlateToolbar';

const FOOTNOTE = 'footnote';
const initialState = {
  model: undefined,
  nodeType: undefined,
  nodeKey: undefined,
};

class SlateToolbarFootNote extends Component {
  constructor() {
    super();
    this.state = initialState;
    this.onCloseDialog = this.onCloseDialog.bind(this);
    this.addFootNoteData = this.addFootNoteData.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentWillMount() {
    const editorState = this.props.state;

    if (
      !editorState.isBlurred &&
      !editorState.isEmpty &&
      editorState.inlines &&
      editorState.inlines.size > 0
    ) {
      const footNoteNode = editorState.inlines.find(
        inline => inline.type === FOOTNOTE,
      );

      if (footNoteNode) {
        this.addFootNoteData(footNoteNode);
      }
    }
  }

  onCloseDialog() {
    this.setState(initialState);
    this.props.closeDialog();
  }

  handleRemove() {
    const { state, handleStateChange } = this.props;
    const transform = state.transform();
    if (hasNodeOfType(state, FOOTNOTE, 'inline')) {
      const nextState = transform.removeNodeByKey(this.state.nodeKey).apply();
      handleStateChange(nextState);
      this.onCloseDialog();
    }
  }

  handleSave(data) {
    const { state, handleStateChange } = this.props;
    const transform = state.transform();
    if (this.state.nodeType === FOOTNOTE) {
      transform.setNodeByKey(this.state.nodeKey, { data });
    } else {
      transform.collapseToEnd().insertText('#').extend(-1).wrapInline({
        type: FOOTNOTE,
        data,
      });
    }
    const nextState = transform.apply();
    handleStateChange(nextState);
    this.onCloseDialog();
  }

  addFootNoteData(footNoteNode) {
    const model = footNoteNode.data.toJS();
    this.setState({
      model,
      nodeType: footNoteNode.type,
      nodeKey: footNoteNode.key,
    });
  }

  render() {
    const { model } = this.state;
    const { t } = this.props;
    const isEdit = model !== undefined;

    return (
      <div {...toolbarClasses('link-overlay', 'open')}>
        <div {...toolbarClasses('link-dialog')}>
          <Button
            stripped
            {...toolbarClasses('close-dialog')}
            onClick={this.onCloseDialog}>
            <Cross />
          </Button>
          <h2>
            {t(
              `learningResourceForm.fields.content.footNote.${isEdit
                ? 'editTitle'
                : 'addTitle'}`,
            )}
          </h2>
          <FootNoteForm
            initialModel={getInitialModel(model)}
            onClose={this.onCloseDialog}
            isEdit={isEdit}
            onRemove={this.handleRemove}
            onSave={this.handleSave}
          />
        </div>
      </div>
    );
  }
}

SlateToolbarFootNote.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  handleStateChange: PropTypes.func.isRequired,
  state: PropTypes.shape({}),
};

export default injectT(SlateToolbarFootNote);
