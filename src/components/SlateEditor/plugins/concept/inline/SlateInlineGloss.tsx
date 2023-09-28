/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IConcept } from '@ndla/types-backend/concept-api';
import { Gloss } from '@ndla/ui';
import { useEffect, useMemo } from 'react';
import { addShowConceptDefinitionClickListeners } from '@ndla/article-scripts';
import { Embed } from '../../../../../interfaces';
import { parseEmbedTag } from '../../../../../util/embedTagHelpers';

interface Props {
  concept: IConcept;
}

const SlateInlineGloss = ({ concept }: Props) => {
  const audio = useMemo(() => {
    const embed: Embed | undefined = parseEmbedTag(concept.visualElement?.visualElement);
    if (embed?.resource === 'audio') {
      return {
        url: embed.url,
        title: embed.pageUrl ?? '',
      };
    }
  }, [concept.visualElement?.visualElement]);

  useEffect(() => {
    addShowConceptDefinitionClickListeners();
  }, []);

  return concept.glossData ? (
    <Gloss audio={audio} title={concept.title} glossData={concept.glossData} />
  ) : null;
};

export default SlateInlineGloss;
