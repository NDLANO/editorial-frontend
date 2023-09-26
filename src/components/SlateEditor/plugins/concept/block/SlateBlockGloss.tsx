/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IConcept } from '@ndla/types-backend/build/concept-api';
import { Gloss } from '@ndla/ui';
import { useMemo } from 'react';
import { Embed } from '../../../../../interfaces';
import { parseEmbedTag } from '../../../../../util/embedTagHelpers';

interface Props {
  concept: IConcept;
}

const SlateBlockGloss = ({ concept }: Props) => {
  const audio = useMemo(() => {
    const embed: Embed | undefined = parseEmbedTag(concept.visualElement?.visualElement);
    if (embed?.resource === 'audio') {
      return {
        url: embed.url,
        title: embed.pageUrl ?? 'oopsie',
      };
    }
  }, [concept.visualElement?.visualElement]);

  if (!concept.glossData) return null;

  return (
    <Gloss
      title={concept.title}
      audio={audio ?? { url: '', title: '' }}
      glossData={concept.glossData}
    />
  );
};

export default SlateBlockGloss;
