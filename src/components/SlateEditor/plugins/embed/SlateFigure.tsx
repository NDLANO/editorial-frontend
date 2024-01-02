/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor, Transforms, Path } from 'slate';
import { RenderElementProps, ReactEditor, useSelected } from 'slate-react';
import { EmbedElements } from '.';
import SlateImage from './SlateImage';
import SlateVideo from './SlateVideo';
import { isSlateEmbed } from './utils';
import DisplayExternal from '../../../DisplayEmbed/DisplayExternal';
import EditorErrorMessage from '../../EditorErrorMessage';

interface Props {
  attributes: RenderElementProps['attributes'];
  editor: Editor;
  element: EmbedElements;
  language: string;
  children: ReactNode;
  allowDecorative?: boolean;
}

interface ChangesProp {
  // This way we can use generic name as the variable name.
  // The name can vary depending on which component uses this function.
  [x: string]: string;
}

const SlateFigure = ({ attributes, editor, element, language, children, allowDecorative = true }: Props) => {
  const embed = element.data;
  const { t } = useTranslation();

  const saveEmbedUpdates = (updates: ChangesProp) => {
    Transforms.setNodes(editor, { data: { ...embed, ...updates } }, { at: ReactEditor.findPath(editor, element) });
  };

  const isActive = () => {
    if (!editor.selection) return false;
    return Path.isDescendant(editor.selection.anchor.path, ReactEditor.findPath(editor, element));
  };

  const isSelected = useSelected();

  const pathToEmbed = ReactEditor.findPath(editor, element);

  const onRemoveClick = (e: any) => {
    e.stopPropagation();
    ReactEditor.focus(editor);
    Transforms.removeNodes(editor, {
      at: pathToEmbed,
      match: (node) => isSlateEmbed(node),
    });
  };

  switch (embed?.resource) {
    case 'image':
      return (
        <SlateImage
          attributes={attributes}
          embed={embed}
          language={language}
          onRemoveClick={onRemoveClick}
          saveEmbedUpdates={saveEmbedUpdates}
          visualElement={false}
          active={isActive()}
          isSelectedForCopy={isSelected}
          pathToEmbed={pathToEmbed}
          allowDecorative={allowDecorative}
        >
          {children}
        </SlateImage>
      );
    case 'brightcove':
      return (
        <SlateVideo
          attributes={attributes}
          embed={embed}
          onRemoveClick={onRemoveClick}
          saveEmbedUpdates={saveEmbedUpdates}
          active={isActive()}
          isSelectedForCopy={isSelected}
        >
          {children}
        </SlateVideo>
      );
    case 'external':
    case 'iframe':
      if (embed.url?.includes('youtu')) {
        return (
          <SlateVideo
            attributes={attributes}
            embed={embed}
            onRemoveClick={onRemoveClick}
            saveEmbedUpdates={saveEmbedUpdates}
            active={isActive()}
            isSelectedForCopy={isSelected}
          >
            {children}
          </SlateVideo>
        );
      }
      return (
        <DisplayExternal
          attributes={attributes}
          onRemoveClick={onRemoveClick}
          embed={embed}
          language={language}
          active={isActive()}
          isSelectedForCopy={isSelected}
          pathToEmbed={pathToEmbed}
          editor={editor}
        >
          {children}
        </DisplayExternal>
      );
    case 'error':
      return (
        <EditorErrorMessage onRemoveClick={onRemoveClick} attributes={attributes} msg={embed.message}>
          {children}
        </EditorErrorMessage>
      );
    default:
      return (
        <EditorErrorMessage
          attributes={attributes}
          msg={t('form.content.figure.notSupported', {
            mediaType: embed?.resource,
          })}
        >
          {children}
        </EditorErrorMessage>
      );
  }
};

export default SlateFigure;
