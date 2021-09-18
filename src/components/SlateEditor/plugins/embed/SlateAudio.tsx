/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactNode, useEffect, useState } from 'react';
import { RenderElementProps } from 'slate-react';
// @ts-ignore
import { Figure } from '@ndla/ui';
import { useTranslation } from 'react-i18next';

import * as visualElementApi from '../../../../containers/VisualElement/visualElementApi';

import EditAudio from './EditAudio';
import AudioPlayerMounter from './AudioPlayerMounter';
import FigureButtons from './FigureButtons';
import { SlateAudio as Audio, LocaleType, AudioEmbed } from '../../../../interfaces';

interface Props {
  attributes: RenderElementProps['attributes'];
  changes: { [x: string]: string };
  embed: AudioEmbed;
  language: string;
  locale: LocaleType;
  onRemoveClick: (event: React.MouseEvent) => void;
  onFigureInputChange: (event: React.FormEvent<HTMLSelectElement>) => void;
  active: boolean;
  isSelectedForCopy: boolean;
  children: ReactNode;
}

const SlateAudio = ({
  attributes,
  changes,
  embed,
  language,
  locale,
  onRemoveClick,
  onFigureInputChange,
  active,
  isSelectedForCopy,
  children,
}: Props) => {
  const { t } = useTranslation();
  const speech = embed.type === 'minimal';
  const [editMode, setEditMode] = useState(false);
  const [audio, setAudio] = useState<Audio>({} as Audio);
  const showCopyOutline = isSelectedForCopy && (!editMode || !active);

  useEffect(() => {
    const getAudio = async () => {
      try {
        const audio = await visualElementApi.fetchAudio(embed.resource_id, language);
        setAudio({
          ...audio,
          caption: embed.caption,
          title: audio.title?.title || '',
        });
      } catch (error) {
        visualElementApi.onError(error);
      }
    };

    getAudio();
  }, [embed, language]);

  const onAudioFigureInputChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const { value, name } = e.currentTarget;
    setAudio({
      ...audio,
      [name]: value,
    });
    onFigureInputChange(e);
  };

  const toggleEdit = (event: React.KeyboardEvent | React.MouseEvent) => {
    event.stopPropagation();
    setEditMode(!editMode);
  };

  return (
    <div draggable {...attributes}>
      <Figure id={`${audio.id}`}>
        {editMode ? (
          <EditAudio
            audio={audio}
            changes={changes}
            embed={embed}
            language={language}
            locale={locale}
            onExit={toggleEdit}
            onChange={onFigureInputChange}
            onAudioFigureInputChange={onAudioFigureInputChange}
            onRemoveClick={onRemoveClick}
            speech={speech}
            type={embed.type || 'standard'}
          />
        ) : (
          <>
            {!speech && (
              <FigureButtons
                tooltip={t('form.audio.remove')}
                onRemoveClick={onRemoveClick}
                embed={embed}
                figureType="audio"
                language={language}
              />
            )}
            <div
              css={
                showCopyOutline && {
                  boxShadow: 'rgb(32, 88, 143) 0 0 0 2px;',
                }
              }
              contentEditable={false}
              role="button"
              draggable
              className="c-placeholder-editmode"
              tabIndex={0}
              onKeyPress={toggleEdit}
              onClick={toggleEdit}>
              {audio.id && <AudioPlayerMounter audio={audio} locale={locale} speech={speech} />}
            </div>
          </>
        )}
      </Figure>
      {children}
    </div>
  );
};

export default SlateAudio;
