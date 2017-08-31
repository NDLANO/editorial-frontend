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
import { Cross } from 'ndla-ui/icons';
import { Field } from '../../../Fields';
import { toolbarClasses } from './SlateToolbar';

const LINK_TYPE = 'link';

class SlateToolbarLink extends React.Component {
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
    this.findLink = this.findLink.bind(this);
    this.findBlock = this.findBlock.bind(this);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (!nextState.initialized) {
      this.addData();
    }
  }

  onContentLinkSubmit() {
    const { state, handleStateChange } = this.props;
    const transform = state.transform();
    const href = this.state.url;
    const text = this.state.text;
    const isNDLAUrl = /^https:\/(.*).ndla.no\/article\/\d*/.test(href);
    if (isNDLAUrl && href && text) {
      const splittedHref = href.split('/');
      const id = splittedHref[splittedHref.length - 1];
      if (this.state.nodeType === 'embed-inline') {
        transform
          .insertText(text)
          .extend(0 - text.length)
          .setInline({
            type: LINK_TYPE,
            data: {
              'content-id': id,
              resource: 'content-link',
              contentLinkText: text,
            },
          })
          .collapseToEnd();
      } else {
        transform
          .insertText(text)
          .extend(0 - text.length)
          .wrapInline({
            type: 'embed-inline',
            data: {
              'content-id': id,
              resource: 'content-link',
              contentLinkText: text,
            },
          })
          .collapseToEnd();
      }
      const nextState = transform.apply();
      handleStateChange(nextState);
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

  findLink() {
    const { state } = this.props;
    return state.inlines.find(inline => inline.type === 'link');
  }

  findBlock() {
    const { state } = this.props;
    return state.blocks.find(block => block.kind === 'block');
  }

  removeUrl() {
    const { hasInlines, state, handleStateChange } = this.props;
    const transform = state.transform();
    if (hasInlines(LINK_TYPE)) {
      const nextState = transform
        .removeNodeByKey(state.selection.startKey)
        .insertText(this.state.text)
        .apply();
      handleStateChange(nextState);
      this.onCloseDialog();
    }
  }

  addData() {
    const { state } = this.props;
    const nodeLink = this.findLink() || this.findBlock();
    if (nodeLink) {
      const { startOffset, endOffset, focusText } = state;
      const text =
        nodeLink.type === LINK_TYPE
          ? nodeLink.text
          : focusText.text.slice(startOffset, endOffset);
      this.setState({
        url:
          nodeLink.type === LINK_TYPE
            ? `${window.config.editorialFrontendDomain}/article/${nodeLink
                .get('data')
                .get('content-id')}`
            : '',
        text,
        isEdit: nodeLink.type === LINK_TYPE,
        initialized: true,
        nodeType: nodeLink.type,
        nodeKey: nodeLink.key,
      });
    }
  }

  render() {
    const { showDialog, t } = this.props;
    return (
      <div {...toolbarClasses('link-overlay', showDialog ? 'open' : 'hidden')}>
        <div {...toolbarClasses('link-dialog')}>
          <Button
            stripped
            {...toolbarClasses('close-dialog')}
            onClick={this.onCloseDialog}>
            <Cross />
          </Button>
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
              {this.state.nodeType === 'link'
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
      </div>
    );
  }
}

SlateToolbarLink.propTypes = {
  showDialog: PropTypes.bool.isRequired,
  hasInlines: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired,
  handleStateChange: PropTypes.func.isRequired,
  state: PropTypes.shape({
    document: PropTypes.shape({
      getClosestInline: PropTypes.func.isRequired,
    }),
  }),
};

export default injectT(SlateToolbarLink);
