/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Types from 'slate-prop-types';
import FootnoteForm, { getInitialModel } from './FootnoteForm';
import { Portal } from '../../../Portal';
import Lightbox from '../../../Lightbox';
import { FootnoteShape } from '../../../../shapes';

class EditFootnote extends Component {
  constructor() {
    super();
    this.handleSave = this.handleSave.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    const { model, closeDialog } = this.props;
    if (!model.title) {
      this.handleRemove();
    } else {
      closeDialog();
    }
  }

  handleRemove() {
    const { editor, node, closeDialog } = this.props;
    if (node) {
      editor.removeNodeByKey(node.key);

      closeDialog();
    }
  }

  handleSave(data) {
    const { editor, node, closeDialog } = this.props;
    editor.setNodeByKey(node.key, { data });

    closeDialog();
  }

  render() {
    const { t, model } = this.props;
    const isEdit = model.title !== undefined;

    return (
      <Portal isOpened>
        <Lightbox display appearance="big" onClose={this.onClose}>
          <h2>
            {t(`form.content.footnote.${isEdit ? 'editTitle' : 'addTitle'}`)}
          </h2>
          <FootnoteForm
            initialModel={getInitialModel(model)}
            onClose={this.onClose}
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
  editor: PropTypes.object.isRequired,
  model: FootnoteShape,
  node: PropTypes.oneOfType([
    Types.node,
    PropTypes.shape({ type: PropTypes.string.isRequired }),
  ]),
};

export default injectT(EditFootnote);
