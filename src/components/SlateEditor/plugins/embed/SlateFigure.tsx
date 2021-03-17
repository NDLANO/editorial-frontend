/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import BEMHelper from 'react-bem-helper';
import { injectT, tType } from '@ndla/i18n';
import SlateImage from './SlateImage';
import SlateVideo from './SlateVideo';
import SlateAudio from './SlateAudio';
import SlatePodcast from './SlatePodcast';
import EditorErrorMessage from '../../EditorErrorMessage';
import DisplayExternal from '../../../DisplayEmbed/DisplayExternal';
import { getSchemaEmbed } from '../../editorSchema';
import { FormikInputEvent, LocaleType, SlateFigureProps } from '../../../../interfaces';

export const editorClasses = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

interface Props extends SlateFigureProps {
  locale?: LocaleType;
}

interface ChangesProp {
  // This way we can use generic name as the variable name.
  // The name can vary depending on which component uses this function.
  [x: string]: string;
}

const SlateFigure: React.FC<Props & tType> = ({
  t,
  attributes,
  editor,
  isSelected,
  language,
  locale = 'nb',
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onFigureInputChange = (event: FormikInputEvent) => {
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
    editor
      .moveToRangeOfNode(node)
      .moveToEnd()
      .focus()
      .moveForward(1);
    editor.removeNodeByKey(node.key);
  };

  switch (embed.resource) {
    case 'image':
      return (
        <SlateImage
          active={isActive()}
          attributes={attributes}
          embed={embed}
          figureClass={editorClasses('figure', isActive() ? 'active' : '')}
          isSelectedForCopy={isSelected}
          language={language}
          onRemoveClick={onRemoveClick}
          saveEmbedUpdates={saveEmbedUpdates}
          submitted={submitted}
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
          submitted={submitted}
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
