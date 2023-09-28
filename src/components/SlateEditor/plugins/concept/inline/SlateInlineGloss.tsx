/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IConcept } from '@ndla/types-backend/concept-api';
import { Gloss } from '@ndla/ui';
import { useEffect, useState } from 'react';
import { addShowConceptDefinitionClickListeners } from '@ndla/article-scripts';
import { IAudioMetaInformation } from '@ndla/types-backend/audio-api';
import { Embed } from '../../../../../interfaces';
import { parseEmbedTag } from '../../../../../util/embedTagHelpers';
import { fetchAudio } from '../../../../../modules/audio/audioApi';

interface Props {
  concept: IConcept;
}

const SlateInlineGloss = ({ concept }: Props) => {
  const [audio, setAudio] = useState<IAudioMetaInformation | undefined>(undefined);
  const embed: Embed | undefined = parseEmbedTag(concept.visualElement?.visualElement);

  useEffect(() => {
    if (embed?.resource === 'audio') {
      fetchAudio(Number(embed?.resourceId)).then((aud) => setAudio(aud));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAudio, embed?.resource]);

  useEffect(() => {
    addShowConceptDefinitionClickListeners();
  }, []);

  return concept.glossData ? (
    <Gloss
      audio={{ src: audio?.audioFile.url, title: audio?.title.title ?? '' }}
      title={concept.title}
      glossData={concept.glossData}
    />
  ) : null;
};

export default SlateInlineGloss;
