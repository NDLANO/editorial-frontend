/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, ReactNode, useEffect, useState, MouseEvent } from 'react';
import { RenderElementProps } from 'slate-react';
import { Figure } from '@ndla/ui';
import { useTranslation } from 'react-i18next';

import EditAudio from './EditAudio';
import AudioPlayerMounter from './AudioPlayerMounter';
import FigureButtons from './FigureButtons';
import { SlateAudio as Audio, LocaleType, AudioEmbed } from '../../../../interfaces';
import { fetchAudio } from '../../../../modules/audio/audioApi';
import { onError } from '../../../../util/resolveJsonOrRejectWithError';

interface Props {
  attributes: RenderElementProps['attributes'];
  changes: { [x: string]: string };
  embed: AudioEmbed;
  language: string;
  locale: LocaleType;
  onRemoveClick: (event: MouseEvent) => void;
  onFigureInputChange: (event: FormEvent<HTMLSelectElement>) => void;
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
        const audio = await fetchAudio(parseInt(embed.resource_id), language);
        setAudio({
          ...audio,
          title: audio.title?.title || '',
        });
      } catch (error) {
        onError(error);
      }
    };

    getAudio();
  }, [embed, language]);

  const onAudioFigureInputChange = (e: FormEvent<HTMLSelectElement>) => {
    const { value, name } = e.currentTarget;
    setAudio({
      ...audio,
      [name]: value,
    });
    onFigureInputChange(e);
  };

  const toggleEdit = () => {
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
