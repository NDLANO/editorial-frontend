/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IAudioMetaInformation } from '@ndla/types-backend/audio-api';
import { IConcept } from '@ndla/types-backend/build/concept-api';
import { Gloss } from '@ndla/ui';
import { useEffect, useMemo, useState } from 'react';
import { Embed } from '../../../../../interfaces';
import { fetchAudio } from '../../../../../modules/audio/audioApi';
import { parseEmbedTag } from '../../../../../util/embedTagHelpers';

interface Props {
  concept: IConcept;
}

const SlateBlockGloss = ({ concept }: Props) => {
  const [audio, setAudio] = useState<IAudioMetaInformation | undefined>(undefined);
  const embed: Embed | undefined = parseEmbedTag(concept.visualElement?.visualElement);

  useEffect(() => {
    if (embed?.resource === 'audio') {
      fetchAudio(Number(embed?.resourceId)).then((aud) => setAudio(aud));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAudio, embed?.resource]);

  return concept.glossData ? (
    <Gloss
      audio={{ src: audio?.audioFile.url, title: audio?.title.title ?? '' }}
      glossData={concept.glossData}
      title={concept.title}
    />
  ) : null;
};

export default SlateBlockGloss;
