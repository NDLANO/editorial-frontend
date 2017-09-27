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
import { compose } from 'redux';
import { TYPE } from './';
import connectLightbox from '../utils/connectLightbox';
import LinkForm, { getInitialModel } from './LinkForm';

const createContentLinkData = (id, text) => ({
  type: TYPE,
  data: {
    'content-id': id,
    resource: 'content-link',
    'link-text': text,
  },
});

class EditLink extends React.Component {
  constructor() {
    super();
    this.state = {
      model: undefined,
    };
    this.addData = this.addData.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentWillMount() {
    const { node } = this.props;
    this.addData(node);
  }

  handleSave(model) {
    const { state, handleStateChange, closeDialog, node } = this.props;
    const href = model.url;
    const text = model.text;
    const isNDLAUrl = /^https:\/(.*).ndla.no\/article\/\d*/.test(href);

    // TODO: A way to set either 'embed-inline' or 'link'
    if (isNDLAUrl && href && text) {
      const splittedHref = href.split('/');
      const id = splittedHref[splittedHref.length - 1];
      if (node.key) {
        // update/change
        handleStateChange(
          state
            .change()
            .moveToRangeOf(node)
            .extend(node.text.length)
            .insertText(text)
            .setInline(createContentLinkData(id, text)),
        );
      } else {
        // create new
        handleStateChange(
          state
            .change()
            .insertText(text)
            .extend(0 - text.length)
            .wrapInline(createContentLinkData(id, text))
            .collapseToEnd(),
        );
      }
    }
    closeDialog();
  }

  handleRemove() {
    const { state, handleStateChange, closeDialog, node } = this.props;
    const nextState = state
      .change()
      .removeNodeByKey(node.key)
      .insertText(node.text);
    handleStateChange(nextState);
    closeDialog();
  }

  addData(node) {
    const { startOffset, endOffset, focusText } = this.props.state;
    const text = node.text
      ? node.text
      : focusText.text.slice(startOffset, endOffset);
    const url = node.data
      ? `${window.config.editorialFrontendDomain}/article/${node.data.get(
          'content-id',
        )}`
      : '';

    this.setState({
      model: {
        url,
        text,
      },
    });
    // TODO: Handle normal external links by checking nodeLink.type === 'link'
  }

  render() {
    const { t, closeDialog } = this.props;
    const { model } = this.state;
    const isEdit = model !== undefined;

    return (
      <div>
        <h3>
          {t(
            `learningResourceForm.fields.content.link.${this.state.isEdit
              ? 'changeTitle'
              : 'addTitle'}`,
          )}
        </h3>
        <LinkForm
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

EditLink.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  handleStateChange: PropTypes.func.isRequired,
  state: Types.state.isRequired,
  blur: PropTypes.func.isRequired,
  node: PropTypes.oneOfType([
    Types.node,
    PropTypes.shape({ type: PropTypes.string.isRequired }),
  ]),
};

export default compose(connectLightbox(() => TYPE), injectT)(EditLink);
