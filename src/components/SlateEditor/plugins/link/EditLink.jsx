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
    this.state = {
      model: undefined,
      newContext: false,
    };
    this.addData = this.addData.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleChangeAndClose = this.handleChangeAndClose.bind(this);
    this.handleNewContext = this.handleNewContext.bind(this);
  }

  componentWillMount() {
    const { node } = this.props;
    this.addData(node);
  }

  handleSave(model) {
    const { newContext } = this.state;
    const { state, node } = this.props;
    const { href, text } = model;
    const isNDLAUrl = /^https:\/(.*).ndla.no\/article\/\d*/.test(href);

    const data = isNDLAUrl
      ? createContentLinkData(
          href,
          newContext
            ? { 'data-open-in': 'new-context' }
            : { 'data-open-in': 'current-context' },
        )
      : createLinkData(href, newContext ? newTabAttributes : {});

    if (node.key) {
      // update/change
      this.handleChangeAndClose(
        state
          .change()
          .moveToRangeOf(node)
          .insertText(text)
          .setInline(data),
      );
    } else {
      // create new
      this.handleChangeAndClose(
        state
          .change()
          .insertText(text)
          .extend(0 - text.length)
          .wrapInline(data)
          .collapseToEnd(),
      );
    }
  }

  handleRemove() {
    const { state, node } = this.props;
    const nextState = state
      .change()
      .removeNodeByKey(node.key)
      .insertText(node.text);
    this.handleChangeAndClose(nextState);
  }

  handleChangeAndClose(change) {
    const { handleStateChange, closeDialog } = this.props;
    handleStateChange(change.focus()); // Always return focus to editor
    closeDialog();
  }

  handleNewContext() {
    this.setState(prevState => ({ newContext: !prevState.newContext }));
  }

  addData(node) {
    const { startOffset, endOffset, focusText } = this.props.state;
    const data = node.data ? node.data.toJS() : {};
    const text = node.text
      ? node.text
      : focusText.text.slice(startOffset, endOffset);

    const href =
      data.resource === 'content-link'
        ? `${window.config.editorialFrontendDomain}/article/${data[
            'content-id'
          ]}`
        : data.href;

    this.setState({
      model: {
        href,
        text,
      },
      newContext: data.target === '_blank' || data['open-in'] === 'new-context',
    });
  }

  render() {
    const { t, state } = this.props;
    const { model, newContext } = this.state;
    const isEdit = model !== undefined;

    return (
      <div>
        <h3>
          {t(
            `form.content.link.${this.state.isEdit
              ? 'changeTitle'
              : 'addTitle'}`,
          )}
        </h3>
        <LinkForm
          initialModel={getInitialModel(model)}
          onClose={() => this.handleChangeAndClose(state.change())}
          isEdit={isEdit}
          isNewContext={newContext}
          onEnableNewContext={this.handleNewContext}
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
