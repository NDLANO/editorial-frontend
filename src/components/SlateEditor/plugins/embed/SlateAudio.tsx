/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
// @ts-ignore
import { Figure } from '@ndla/ui';
import { injectT, tType } from '@ndla/i18n';

import * as visualElementApi from '../../../../containers/VisualElement/visualElementApi';

import EditAudio from './EditAudio';
import AudioPlayerMounter from './AudioPlayerMounter';
import FigureButtons from './FigureButtons';
import { Audio, Embed, FormikInputEvent } from '../../../../interfaces';

interface Props {
  attributes?: {
    'data-key': String;
    'data-slate-object': String;
  };
  changes: { [x: string]: string };
  embed: Embed;
  language: string;
  locale: string;
  onRemoveClick: Function;
  onFigureInputChange: Function;
  submitted: boolean;
}

const SlateAudio: React.FC<Props & tType> = ({
  t,
  attributes,
  changes,
  embed,
  language,
  locale,
  onRemoveClick,
  onFigureInputChange,
  submitted,
}) => {
  const speech = embed.type === 'minimal';
  const [editMode, setEditMode] = useState(false);
  const [audio, setAudio] = useState<Audio>({} as Audio);

  const getAudio = async () => {
    try {
      const audio = await visualElementApi.fetchAudio(
        embed.resource_id,
        language,
      );
      setAudio({
        ...audio,
        caption: embed.caption,
        title: audio.title?.title || '',
      });
    } catch (error) {
      visualElementApi.onError(error);
    }
  };

  useEffect(() => {
    getAudio();
  }, [embed.resource_id]);

  const onAudioFigureInputChange = (e: FormikInputEvent) => {
    const { value, name } = e.target;
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
            onExit={toggleEdit}
            onChange={onFigureInputChange}
            onAudioFigureInputChange={onAudioFigureInputChange}
            onRemoveClick={onRemoveClick}
            speech={speech}
            submitted={submitted}
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
              role="button"
              draggable
              className="c-placeholder-editmode"
              tabIndex={0}
              onKeyPress={toggleEdit}
              onClick={toggleEdit}>
              {audio.id && (
                <AudioPlayerMounter
                  audio={audio}
                  locale={locale}
                  speech={speech}
                />
              )}
            </div>
          </>
        )}
      </Figure>
    </div>
  );
};

export default injectT(SlateAudio);
