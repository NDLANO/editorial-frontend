/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Types from 'slate-prop-types';
import { Portal } from '../../../Portal';
import Lightbox from '../../../Lightbox';
import { TYPE } from '.';
import LinkForm, { getInitialModel } from './LinkForm';
import config from '../../../../config';

const newTabAttributes = {
  target: '_blank',
  rel: 'noopener noreferrer',
};

const createContentLinkData = (href, targetRel) => {
  const splittedHref = href.split('/');
  const id = splittedHref[splittedHref.length - 1];
  return {
    type: TYPE,
    data: {
      'content-id': id,
      resource: 'content-link',
      ...targetRel,
    },
  };
};

const createLinkData = (href, targetRel) => ({
  type: TYPE,
  data: {
    href,
    ...targetRel,
  },
});

class EditLink extends React.Component {
  constructor() {
    super();
    this.handleSave = this.handleSave.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleChangeAndClose = this.handleChangeAndClose.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    const { editor, model } = this.props;
    if (!model.href) {
      this.handleRemove();
    } else {
      this.handleChangeAndClose(editor);
    }
  }

  handleSave(model) {
    const { editor, node } = this.props;
    const { href, text, checkbox } = model;
    const isNDLAUrl = config.isNdlaProdEnvironment
      ? /^https:\/\/(www\.)?ndla.no\/article\/\d*/.test(href)
      : /^https:\/(.*).ndla.no\/article\/\d*/.test(href);
    const data = isNDLAUrl
      ? createContentLinkData(
          href,
          checkbox
            ? { 'open-in': 'new-context' }
            : { 'open-in': 'current-context' },
        )
      : createLinkData(href, checkbox ? newTabAttributes : {});

    if (node.key) {
      // update/change
      this.handleChangeAndClose(
        editor
          .moveToRangeOfNode(node)
          .insertText(text)
          .setInlines(data),
      );
    }
  }

  handleRemove() {
    const { editor, node } = this.props;
    const nextValue = editor.removeNodeByKey(node.key).insertText(node.text);
    this.handleChangeAndClose(nextValue);
  }

  handleChangeAndClose(editor) {
    const { closeEditMode } = this.props;

    editor.focus(); // Always return focus to editor

    closeEditMode();
  }

  render() {
    const { t, model } = this.props;
    const isEdit = model !== undefined && model.href !== undefined;

    return (
      <Portal isOpened>
        <Lightbox display appearance="big" onClose={this.onClose}>
          <h2>
            {t(`form.content.link.${isEdit ? 'changeTitle' : 'addTitle'}`)}
          </h2>
          <LinkForm
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

EditLink.propTypes = {
  model: PropTypes.shape({
    href: PropTypes.string,
    text: PropTypes.string,
    checkbox: PropTypes.bool,
  }).isRequired,
  closeEditMode: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,

  editor: PropTypes.object.isRequired,
  node: PropTypes.oneOfType([
    Types.node,
    PropTypes.shape({ type: PropTypes.string.isRequired }),
  ]),
};

export default injectT(EditLink);
