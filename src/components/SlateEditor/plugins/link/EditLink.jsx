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
import LinkForm from './LinkForm';
import { resolveUrls } from '../../../../modules/taxonomy/taxonomyApi';

const newTabAttributes = {
  target: '_blank',
  rel: 'noopener noreferrer',
};

const createContentLinkData = (id, resourceType, targetRel) => {
  return {
    type: TYPE,
    data: {
      'content-id': id,
      'content-type': resourceType || 'article',
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

export const isNDLAArticleUrl = url =>
  /^https:\/\/((.*)\.)?ndla.no\/((.*)\/)?article\/\d*/.test(url);
export const isNDLASubjectUrl = url =>
  /^https:\/\/((.*)\.)?ndla.no\/((.*)\/)?subjects\/(.*)\/topic(.*)/.test(url);
export const isNDLALearningPathUrl = url =>
  /^https:\/\/((.*)\.)?ndla.no\/((.*)\/)?learningpaths\/(.*)/.test(url);
export const isPlainId = url => /^\d+/.test(url);

const getIdAndTypeFromUrl = async href => {
  if (isNDLAArticleUrl(href)) {
    const splittedHref = href.split('/');
    return {
      resourceId: splittedHref.pop(),
      resourceType: 'article',
    };
  } else if (isNDLALearningPathUrl(href)) {
    const splittedHref = href.split('learningpaths/');
    return {
      resourceId: splittedHref[1],
      resourceType: 'learningpath',
    };
  } else if (isPlainId(href)) {
    return {
      resourceId: href,
      resourceType: 'article',
    };
  } else if (isNDLASubjectUrl(href)) {
    const taxonomyPath = href.split('subjects').pop();
    const resolvedTaxonomy = await resolveUrls(taxonomyPath);

    const contentUriSplit =
      resolvedTaxonomy && resolvedTaxonomy.contentUri.split(':');

    const resourceId = contentUriSplit.pop();
    const resourceType = contentUriSplit.pop();

    return { resourceId, resourceType };
  }
  return { resourceId: null };
};

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

  async handleSave(model) {
    const { editor, node } = this.props;
    const { href, text, checkbox } = model;

    const { resourceId, resourceType } = await getIdAndTypeFromUrl(href);

    const targetRel = checkbox
      ? { 'open-in': 'new-context' }
      : { 'open-in': 'current-context' };

    const data = resourceId
      ? createContentLinkData(resourceId, resourceType, targetRel)
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
            onClose={this.onClose}
            link={model}
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
