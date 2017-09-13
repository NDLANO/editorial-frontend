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
import FootNoteForm, { getInitialModel } from './FootNoteForm';
import { toolbarClasses } from './SlateToolbar';

const FOOTNOTE = 'footnote';
const initialState = {
  isEdit: false,
  model: undefined,
  initialized: false,
};

class SlateToolbarFootNote extends Component {
  constructor() {
    super();
    this.state = initialState;
    this.onCloseDialog = this.onCloseDialog.bind(this);
    this.addFootNoteData = this.addFootNoteData.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.findFootNote = this.findFootNote.bind(this);
    this.findBlock = this.findBlock.bind(this);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (!nextState.initialized) {
      this.addFootNoteData();
    }
  }

  onCloseDialog() {
    this.setState(initialState);
    this.props.closeDialog();
  }

  handleSave(data) {
    console.log('Handle save', data);
    const { state, handleStateChange } = this.props;
    const transform = state.transform();
    if (this.state.nodeType === FOOTNOTE) {
      // TODO: Edit existing content node
      console.log('Will save current!');
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

  findFootNote() {
    const { state } = this.props;
    return state.inlines.find(inline => inline.type === FOOTNOTE);
  }

  findBlock() {
    const { state } = this.props;
    return state.blocks.find(block => block.kind === 'block');
  }

  // TODO: Remove footnote

  addFootNoteData() {
    const { state } = this.props;
    if (state.isBlurred || state.isEmpty) return;

    const footNoteNode = this.findFootNote();
    if (footNoteNode) {
      const model = footNoteNode.data.toJS();
      this.setState({
        model,
        isEdit: footNoteNode.type === FOOTNOTE,
        initialized: true,
        nodeType: footNoteNode.type,
        nodeKey: footNoteNode.key,
      });
    }
  }

  render() {
    const { isEdit, model } = this.state;
    const { showDialog, t } = this.props;

    if (!showDialog) {
      return null;
    }
    return (
      <div {...toolbarClasses('link-overlay', showDialog ? 'open' : 'hidden')}>
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
            onRemove={() => console.log('Not implemented')}
            onSave={this.handleSave}
          />
        </div>
      </div>
    );
  }
}

SlateToolbarFootNote.propTypes = {
  showDialog: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  handleStateChange: PropTypes.func.isRequired,
  state: PropTypes.shape({}),
};

export default injectT(SlateToolbarFootNote);
