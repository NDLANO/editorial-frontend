/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import Types from 'slate-prop-types';
import { Portal } from '../../../Portal';
import Lightbox from '../../../Lightbox';
import { TYPE } from '.';
import LinkForm, { getInitialModel } from './LinkForm';

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
  }

  handleSave(model) {
    const { value, node } = this.props;
    const { href, text, checkbox } = model;
    const isNDLAUrl = /^https:\/(.*).ndla.no\/article\/\d*/.test(href);
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
        value
          .change()
          .moveToRangeOfNode(node)
          .insertText(text)
          .setInlines(data),
      );
    }
  }

  handleRemove() {
    const { value, node } = this.props;
    const nextValue = value
      .change()
      .removeNodeByKey(node.key)
      .insertText(node.text);
    this.handleChangeAndClose(nextValue);
  }

  handleChangeAndClose(change) {
    const { onChange, closeEditMode } = this.props;

    onChange(change.focus()); // Always return focus to editor

    closeEditMode();
  }

  render() {
    const { t, value, model, closeEditMode } = this.props;
    const isEdit = model !== undefined && model.href !== undefined;

    return (
      <Portal isOpened>
        <Lightbox display big onClose={closeEditMode}>
          <h2>
            {t(`form.content.link.${isEdit ? 'changeTitle' : 'addTitle'}`)}
          </h2>
          <LinkForm
            initialModel={getInitialModel(model)}
            onClose={() => {
              if (!model.href) {
                this.handleRemove();
              } else {
                this.handleChangeAndClose(value.change());
              }
            }}
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
  }).isRequired,
  closeEditMode: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,

  value: Types.value.isRequired,
  node: PropTypes.oneOfType([
    Types.node,
    PropTypes.shape({ type: PropTypes.string.isRequired }),
  ]),
};

export default injectT(EditLink);
