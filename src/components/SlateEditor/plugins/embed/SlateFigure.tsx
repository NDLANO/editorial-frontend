/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactNode, useState } from 'react';
import { Editor, Transforms, Element, Path } from 'slate';
import { RenderElementProps, ReactEditor, useSelected } from 'slate-react';
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
  children: ReactNode;
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
  children,
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
    if (!editor.selection) return false;
    return Path.isDescendant(editor.selection.anchor.path, ReactEditor.findPath(editor, element));
  };

  const isSelected = useSelected();

  const onRemoveClick = (e: any) => {
    console.log('remove');
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
          attributes={attributes}
          embed={embed}
          figureClass={editorClasses('figure', isActive() ? 'active' : '')}
          language={language}
          onRemoveClick={onRemoveClick}
          saveEmbedUpdates={saveEmbedUpdates}
          visualElement={false}
          active={isActive()}
          isSelectedForCopy={isSelected}>
          {children}
        </SlateImage>
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
          active={isActive()}
          isSelectedForCopy={isSelected}>
          {children}
        </SlateVideo>
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
            active={isActive()}
            isSelectedForCopy={isSelected}>
            {children}
          </SlatePodcast>
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
          active={isActive()}
          isSelectedForCopy={isSelected}>
          {children}
        </SlateAudio>
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
            active={isActive()}
            isSelectedForCopy={isSelected}>
            {children}
          </SlateVideo>
        );
      }
      return (
        <DisplayExternal
          onRemoveClick={onRemoveClick}
          editor={editor}
          element={element}
          embed={embed}
          language={language}
          active={isActive()}
          isSelectedForCopy={isSelected}>
          {children}
        </DisplayExternal>
      );
    case 'error':
      return (
        <EditorErrorMessage
          onRemoveClick={onRemoveClick}
          attributes={attributes}
          msg={embed.message}>
          {children}
        </EditorErrorMessage>
      );
    default:
      return (
        <EditorErrorMessage
          attributes={attributes}
          msg={t('form.content.figure.notSupported', {
            mediaType: embed.resource,
          })}>
          {children}
        </EditorErrorMessage>
      );
  }
};

export default injectT(SlateFigure);
