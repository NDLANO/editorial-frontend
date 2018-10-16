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
import FootnoteForm, { getInitialModel } from './FootnoteForm';
import { Portal } from '../../../Portal';
import Lightbox from '../../../Lightbox';
import { TYPE } from '.';

class EditFootnote extends Component {
  constructor() {
    super();
    this.handleSave = this.handleSave.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleRemove() {
    const { value, node, onChange, closeDialog } = this.props;
    if (node) {
      const nextState = value.change().removeNodeByKey(node.key);
      onChange(nextState);
      closeDialog();
    }
  }

  handleSave(data) {
    const { value, onChange, node, closeDialog } = this.props;
    const change = value.change();
    if (node) {
      onChange(change.setNodeByKey(node.key, { data }));
    } else {
      onChange(
        change
          .moveToEnd()
          .insertText('#')
          .extend(-1)
          .wrapInline({
            type: TYPE,
            data,
          }),
      );
    }
    closeDialog();
  }

  render() {
    const { t, closeDialog, model } = this.props;
    const isEdit = model.title !== undefined;

    return (
      <Portal isOpened>
        <Lightbox display big onClose={closeDialog}>
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
        </Lightbox>
      </Portal>
    );
  }
}

EditFootnote.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: Types.value.isRequired,
  node: PropTypes.oneOfType([
    Types.node,
    PropTypes.shape({ type: PropTypes.string.isRequired }),
  ]),
};

export default injectT(EditFootnote);
