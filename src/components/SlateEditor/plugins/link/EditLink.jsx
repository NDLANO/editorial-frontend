/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import Types from 'slate-prop-types';
import { compose } from 'redux';
import { Field } from '../../../Fields';
import { toolbarClasses } from '../SlateToolbar/SlateToolbar'; // TODO: Remove depdency
import { TYPE } from './';
import { hasNodeOfType } from '../utils';
import connectLightbox from '../utils/connectLightbox';

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
      url: '',
      text: '',
      initialized: false,
      urlError: false,
      isEdit: false,
      nodeType: undefined,
      nodeKey: undefined,
    };
    this.addData = this.addData.bind(this);
    this.onContentLinkChange = this.onContentLinkChange.bind(this);
    this.onContentLinkSubmit = this.onContentLinkSubmit.bind(this);
    this.onCloseDialog = this.onCloseDialog.bind(this);
    this.removeUrl = this.removeUrl.bind(this);
  }

  componentWillMount() {
    const { node } = this.props;
    this.addData(node);
  }

  onContentLinkSubmit() {
    const { state, handleStateChange, node } = this.props;
    const href = this.state.url;
    const text = this.state.text;
    const isNDLAUrl = /^https:\/(.*).ndla.no\/article\/\d*/.test(href);

    // TODO: A way to set either 'embed-inline' or 'link'

    if (isNDLAUrl && href && text) {
      const splittedHref = href.split('/');
      const id = splittedHref[splittedHref.length - 1];
      if (this.state.nodeKey) {
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
      this.onCloseDialog();
    }
  }

  onContentLinkChange(evt) {
    const name = evt.target.name;
    const value = evt.target.value;
    const urlError =
      name === 'url'
        ? !/^https:\/(.*).ndla.no\/article\/\d*/.test(value)
        : false;
    this.setState({
      [name]: value,
      urlError,
    });
  }

  onCloseDialog() {
    this.setState({
      text: '',
      url: '',
      isEdit: false,
      initialized: false,
    });
    this.props.closeDialog();
  }

  removeUrl() {
    const { state, handleStateChange } = this.props;
    const change = state.change();
    if (hasNodeOfType(state, TYPE, 'inline')) {
      const nextState = change
        .removeNodeByKey(state.selection.startKey)
        .insertText(this.state.text);
      handleStateChange(nextState);
      this.onCloseDialog();
    }
  }

  addData(node) {
    const { startOffset, endOffset, focusText } = this.props.state;
    const text = node.text
      ? node.text
      : focusText.text.slice(startOffset, endOffset);

    this.setState({
      url: node.data
        ? `${window.config.editorialFrontendDomain}/article/${node.data.get(
            'content-id',
          )}`
        : '',
      text,
      nodeType: node.type,
      nodeKey: node.key,
    });
    // TODO: Handle normal external links by checking nodeLink.type === 'link'
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <h3>
          {t(
            `learningResourceForm.fields.content.link.${this.state.isEdit
              ? 'changeTitle'
              : 'addTitle'}`,
          )}
        </h3>
        <Field>
          <label htmlFor="text">
            {t('learningResourceForm.fields.content.link.text')}
          </label>
          <input
            name="text"
            type="text"
            value={this.state.text}
            onChange={this.onContentLinkChange}
          />
        </Field>
        <Field>
          <label htmlFor="url">
            {t('learningResourceForm.fields.content.link.url')}
          </label>
          <input
            name="url"
            type="text"
            value={this.state.url}
            onChange={this.onContentLinkChange}
          />
          {this.state.urlError
            ? <span {...toolbarClasses('link-input', 'error')}>
                {t('learningResourceForm.fields.content.link.urlError')}
              </span>
            : ''}
        </Field>
        <Field right>
          <div {...toolbarClasses('link-actions')}>
            {this.state.nodeType === TYPE
              ? <Button onClick={this.removeUrl}>
                  {t('learningResourceForm.fields.content.link.removeUrl')}
                </Button>
              : ''}
            <Button outline onClick={this.onCloseDialog}>
              {t('learningResourceForm.fields.content.link.abort')}
            </Button>
            <Button onClick={this.onContentLinkSubmit}>
              {t('learningResourceForm.fields.content.link.save')}
            </Button>
          </div>
        </Field>
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
