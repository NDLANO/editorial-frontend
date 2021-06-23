/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { Editor, Transforms, Element } from 'slate';
import { RenderElementProps, ReactEditor } from 'slate-react';
import BEMHelper from 'react-bem-helper';
import { injectT, tType } from '@ndla/i18n';
import SlateImage from './SlateImage';
import SlateVideo from './SlateVideo';
import SlateAudio from './SlateAudio';
import SlatePodcast from './SlatePodcast';
import EditorErrorMessage from '../../EditorErrorMessage';
import DisplayExternal from '../../../DisplayEmbed/DisplayExternal';
import { FormikInputEvent, LocaleType } from '../../../../interfaces';
import { EmbedElement, TYPE_EMBED } from '.';

export const editorClasses = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

interface Props {
  attributes: RenderElementProps['attributes'];
  editor: Editor;
  element: EmbedElement;
  language: string;
  locale?: LocaleType;
}

interface ChangesProp {
  // This way we can use generic name as the variable name.
  // The name can vary depending on which component uses this function.
  [x: string]: string;
}

const SlateFigure = ({
  t,
  attributes,
  editor,
  element,
  language,
  locale = 'nb',
}: Props & tType) => {
  const embed = element.data;
  const [changes, setChanges] = useState<ChangesProp>({ caption: '' });

  const onFigureInputChange = (event: FormikInputEvent) => {
    event.preventDefault();
    const { value, name } = event.target;
    const change = { [name]: value };

    setChanges(change);
    saveEmbedUpdates(change);
  };

  const saveEmbedUpdates = (updates: ChangesProp) => {
    Transforms.setNodes(
      editor,
      { data: { ...embed, ...updates } },
      { at: ReactEditor.findPath(editor, element) },
    );
  };

  const isActive = () => {
    return false;
  };

  const onRemoveClick = (e: any) => {
    e.stopPropagation();
    const path = ReactEditor.findPath(editor, element);
    ReactEditor.focus(editor);
    Transforms.removeNodes(editor, {
      at: path,
      match: node => Element.isElement(node) && node.type === TYPE_EMBED,
    });
  };

  switch (embed.resource) {
    case 'image':
      return (
        <SlateImage
          active={isActive()}
          attributes={attributes}
          embed={embed}
          figureClass={editorClasses('figure', isActive() ? 'active' : '')}
          language={language}
          onRemoveClick={onRemoveClick}
          saveEmbedUpdates={saveEmbedUpdates}
          visualElement={false}
        />
      );
    case 'brightcove':
      return (
        <SlateVideo
          attributes={attributes}
          embed={embed}
          figureClass={editorClasses('figure', isActive() ? 'active' : '')}
          language={language}
          onRemoveClick={onRemoveClick}
          saveEmbedUpdates={saveEmbedUpdates}
        />
      );
    case 'audio':
      if (embed.type === 'podcast') {
        return (
          <SlatePodcast
            attributes={attributes}
            embed={embed}
            language={language}
            locale={locale}
            onRemoveClick={onRemoveClick}
          />
        );
      }
      return (
        <SlateAudio
          attributes={attributes}
          changes={changes}
          embed={embed}
          language={language}
          locale={locale}
          onRemoveClick={onRemoveClick}
          onFigureInputChange={onFigureInputChange}
        />
      );
    case 'external':
    case 'iframe':
    case 'h5p':
      if (embed.url?.includes('youtu')) {
        return (
          <SlateVideo
            attributes={attributes}
            embed={embed}
            figureClass={editorClasses('figure', isActive() ? 'active' : '')}
            language={language}
            onRemoveClick={onRemoveClick}
            saveEmbedUpdates={saveEmbedUpdates}
          />
        );
      }
      return (
        <DisplayExternal
          onRemoveClick={onRemoveClick}
          editor={editor}
          node={node}
          embed={embed}
          language={language}
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
