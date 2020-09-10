/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { injectT } from '@ndla/i18n';
import Types from 'slate-prop-types';
import SlateImage from './SlateImage';
import SlateVideo from './SlateVideo';
import SlateAudio from './SlateAudio';
import EditorErrorMessage from '../../EditorErrorMessage';
import DisplayExternal from '../../../DisplayEmbed/DisplayExternal';
import { getSchemaEmbed } from '../../editorSchema';
import { EditorShape } from '../../../../shapes';
import EditImage from './EditImage';

export const editorClasses = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const SlateFigure = ({
  t,
  language,
  isSelected,
  node,
  attributes,
  editor,
  onRemoveClick,
  className,
}) => {
  const [submitted, setSubmitted] = useState(editor.props.submitted);
  const [changes, setChanges] = useState({});

  const onSubmittedChange = () => {
    const slateStore = editor.props.slateStore;
    setSubmitted(slateStore.getState().submitted);
  };

  useEffect(() => {
    const slateStore = editor.props.slateStore;
    const unsubscribe = slateStore.subscribe(onSubmittedChange);

    // ComponentWillUnmount
    return () => unsubscribe();
  }, []);

  const onFigureInputChange = e => {
    e.preventDefault();
    const { value, name } = e.target;
    const change = { [name]: value };

    setChanges(change);
    saveEmbedUpdates(change);
  };

  const saveEmbedUpdates = updates => {
    const properties = {
      data: { ...getSchemaEmbed(node), ...updates },
    };
    editor.setNodeByKey(node.key, properties);
  };

  const active = isSelected;
  const figureClass = editorClasses('figure', active ? 'active' : '');
  const embed = getSchemaEmbed(node);
  const props = {
    embed,
    onFigureInputChange: onFigureInputChange,
    saveEmbedUpdates: saveEmbedUpdates,
    figureClass,
    attributes,
    submitted: submitted,
    language,
    isSelected,
    active,
    changes: changes,
  };

  switch (embed.resource) {
    case 'image':
      return (
        <SlateImage
          node={node}
          editor={editor}
          onRemoveClick={onRemoveClick}
          language={language}
          renderEditComponent={props => (
            <EditImage imageLanguage={language} {...props} />
          )}
          {...props}
        />
      );
    case 'brightcove':
      return <SlateVideo onRemoveClick={onRemoveClick} {...props} />;
    case 'audio':
      return <SlateAudio onRemoveClick={onRemoveClick} {...props} />;
    case 'external':
    case 'iframe':
    case 'h5p':
      if (embed.url?.includes('youtu')) {
        return <SlateVideo onRemoveClick={onRemoveClick} {...props} />;
      }
      return (
        <DisplayExternal
          onRemoveClick={onRemoveClick}
          editor={editor}
          node={node}
          embed={embed}
        />
      );
    case 'error':
      return (
        <EditorErrorMessage
          onRemoveClick={onRemoveClick}
          attributes={attributes}
          msg={embed.message}
        />
      );
    default:
      return (
        <EditorErrorMessage
          attributes={attributes}
          msg={t('form.content.figure.notSupported', {
            mediaType: embed.resource,
          })}
        />
      );
  }
};

SlateFigure.propTypes = {
  className: PropTypes.string,
  node: Types.node.isRequired,
  editor: EditorShape,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  language: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  onRemoveClick: PropTypes.func,
};

SlateFigure.defaultProps = {
  className: '',
};

export default injectT(SlateFigure);
