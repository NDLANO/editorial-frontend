/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { Editor, Transforms, Path } from 'slate';
import { RenderElementProps, ReactEditor, useSelected } from 'slate-react';
import { useTranslation } from 'react-i18next';
import SlateImage from './SlateImage';
import SlateVideo from './SlateVideo';
import SlateAudio from './SlateAudio';
import SlatePodcast from './SlatePodcast';
import EditorErrorMessage from '../../EditorErrorMessage';
import DisplayExternal from '../../../DisplayEmbed/DisplayExternal';
import {
  AudioEmbedElement,
  BrightcoveEmbedElement,
  ErrorEmbedElement,
  ExternalEmbedElement,
  H5PEmbedElement,
  ImageEmbedElement,
} from '.';
import { LocaleType } from '../../../../interfaces';
import { isSlateEmbed } from './utils';
import { useFrontpageArticle } from '../../../../containers/ArticlePage/FrontpageArticlePage/components/FrontpageArticleProvider';

interface Props {
  attributes: RenderElementProps['attributes'];
  editor: Editor;
  element:
    | AudioEmbedElement
    | H5PEmbedElement
    | BrightcoveEmbedElement
    | ErrorEmbedElement
    | ExternalEmbedElement
    | ImageEmbedElement;
  language: string;
  locale?: LocaleType;
  children: ReactNode;
}

interface ChangesProp {
  // This way we can use generic name as the variable name.
  // The name can vary depending on which component uses this function.
  [x: string]: string;
}

const FigureWrapper = styled.div`
  &[data-wide='true'] {
    figure,
    > iframe,
    > div {
      width: 100% !important;
      inset: unset !important;
      padding: unset !important;
    }
  }
`;

const SlateFigure = ({ attributes, editor, element, language, locale = 'nb', children }: Props) => {
  const embed = element.data;
  const { t } = useTranslation();
  const { isFrontpageArticle } = useFrontpageArticle();

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

  const pathToEmbed = ReactEditor.findPath(editor, element);

  const onRemoveClick = (e: any) => {
    e.stopPropagation();
    ReactEditor.focus(editor);
    Transforms.removeNodes(editor, {
      at: pathToEmbed,
      match: (node) => isSlateEmbed(node),
    });
  };

  const getFigure = () => {
    switch (embed.resource) {
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
          >
            {children}
          </SlateImage>
        );
      case 'brightcove':
        return (
          <SlateVideo
            attributes={attributes}
            embed={embed}
            language={language}
            onRemoveClick={onRemoveClick}
            saveEmbedUpdates={saveEmbedUpdates}
            active={isActive()}
            isSelectedForCopy={isSelected}
          >
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
              saveEmbedUpdates={saveEmbedUpdates}
              isSelectedForCopy={isSelected}
            >
              {children}
            </SlatePodcast>
          );
        }
        return (
          <SlateAudio
            attributes={attributes}
            embed={embed}
            language={language}
            locale={locale}
            onRemoveClick={onRemoveClick}
            saveEmbedUpdates={saveEmbedUpdates}
            active={isActive()}
            isSelectedForCopy={isSelected}
          >
            {children}
          </SlateAudio>
        );
      case 'external':
      case 'iframe':
      case 'h5p':
        if (embed.resource !== 'h5p' && embed.url?.includes('youtu')) {
          return (
            <SlateVideo
              attributes={attributes}
              embed={embed}
              language={language}
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
          <EditorErrorMessage
            onRemoveClick={onRemoveClick}
            attributes={attributes}
            msg={embed.message}
          >
            {children}
          </EditorErrorMessage>
        );
      default:
        return (
          <EditorErrorMessage
            attributes={attributes}
            msg={t('form.content.figure.notSupported', {
              mediaType: embed.resource,
            })}
          >
            {children}
          </EditorErrorMessage>
        );
    }
  };

  return <FigureWrapper data-wide={isFrontpageArticle}>{getFigure()}</FigureWrapper>;
};

export default SlateFigure;
