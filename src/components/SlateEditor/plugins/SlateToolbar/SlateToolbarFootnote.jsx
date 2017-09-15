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
import FootnoteForm, { getInitialModel } from './FootnoteForm';
import { toolbarClasses } from './SlateToolbar';

const FOOTNOTE = 'footnote';
const initialState = {
  model: undefined,
  nodeType: undefined,
  nodeKey: undefined,
};

class SlateToolbarFootnote extends Component {
  constructor() {
    super();
    this.state = initialState;
    this.onCloseDialog = this.onCloseDialog.bind(this);
    this.addFootnoteData = this.addFootnoteData.bind(this);
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
      const footnoteNode = editorState.inlines.find(
        inline => inline.type === FOOTNOTE,
      );

      if (footnoteNode) {
        this.addFootnoteData(footnoteNode);
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

  addFootnoteData(footnoteNode) {
    const model = footnoteNode.data.toJS();
    this.setState({
      model,
      nodeType: footnoteNode.type,
      nodeKey: footnoteNode.key,
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
              `learningResourceForm.fields.content.footnote.${isEdit
                ? 'editTitle'
                : 'addTitle'}`,
            )}
          </h2>
          <FootnoteForm
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

SlateToolbarFootnote.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  handleStateChange: PropTypes.func.isRequired,
  state: PropTypes.shape({}),
};

export default injectT(SlateToolbarFootnote);
