/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import BEMHelper from 'react-bem-helper';
import { injectT } from '@ndla/i18n';
import SlateImage from './SlateImage';
import SlateVideo from './SlateVideo';
import SlateAudio from './SlateAudio';
import EditorErrorMessage from '../../EditorErrorMessage';
import DisplayExternal from '../../../DisplayEmbed/DisplayExternal';
import { getSchemaEmbed } from '../../editorSchema';
import EditImage from './EditImage';
import { SlateEditor, TranslateType } from '../../../../interfaces';

export const editorClasses = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

interface Props {
  t: TranslateType;
  attributes: {
    'data-key': String;
    'data-slate-object': String;
  };
  editor: SlateEditor;
  isSelected: boolean;
  language: String;
  node: {
    key: string;
  };
}

interface Event {
  preventDefault: Function;
  target: {
    value: string;
    name: string;
  };
}

interface ChangesProp {
  // This way we can use generic name as the variable name.
  // The name can vary depending on which component uses this function.
  [x: string]: string;
}

const SlateFigure: React.FC<Props> = ({
  t,
  attributes,
  editor,
  isSelected,
  language,
  node,
}) => {
  const embed = getSchemaEmbed(node);
  const [submitted, setSubmitted] = useState<boolean>(editor.props.submitted);
  const [changes, setChanges] = useState<ChangesProp>({ caption: '' });

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

  const onFigureInputChange = (event: Event) => {
    event.preventDefault();
    const { value, name } = event.target;
    const change = { [name]: value };

    setChanges(change);
    saveEmbedUpdates(change);
  };

  const saveEmbedUpdates = (updates: ChangesProp) => {
    const properties = {
      data: { ...getSchemaEmbed(node), ...updates },
    };
    editor.setNodeByKey(node.key, properties);
  };

  const isActive = () => {
    return editor.value.selection.anchor.isInNode(node);
  };

  const onRemoveClick = (e: any) => {
    e.stopPropagation();
    editor.removeNodeByKey(node.key);
  };

  const props = {
    t,
    active: isActive(),
    attributes,
    changes: changes,
    embed,
    figureClass: editorClasses('figure', isActive() ? 'active' : ''),
    isSelectedForCopy: isSelected,
    language,
    onFigureInputChange: onFigureInputChange,
    saveEmbedUpdates: saveEmbedUpdates,
    submitted: submitted,
    onRemoveClick: onRemoveClick,
  };

  switch (embed.resource) {
    case 'image':
      return (
        <SlateImage
          node={node}
          editor={editor}
          language={language}
          renderEditComponent={(props: any) => (
            <EditImage imageLanguage={language} {...props}>
              {console.log('renderEditComponent Props: ', props)}
            </EditImage>
          )}
          {...console.log('rest props: ', { ...props })}
          {...props}
        />
      );
    case 'brightcove':
      return <SlateVideo {...props} />;
    case 'audio':
      return <SlateAudio {...props} />;
    case 'external':
    case 'iframe':
    case 'h5p':
      if (embed.url?.includes('youtu')) {
        return <SlateVideo {...props} />;
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

export default injectT(SlateFigure);
