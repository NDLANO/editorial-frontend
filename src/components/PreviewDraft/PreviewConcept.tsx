/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { extractEmbedMeta } from '@ndla/article-converter';
import { IConcept } from '@ndla/types-concept-api';
import { ConceptVisualElementMeta } from '@ndla/types-embed';
import { ConceptNotionV2 } from '@ndla/ui';
import { usePreviewArticle } from '../../modules/article/articleGqlQueries';
interface Props {
  concept: IConcept;
  language: string;
}
const PreviewConcept = ({ concept, language }: Props) => {
  const { data } = usePreviewArticle(
    concept.visualElement?.visualElement!,
    concept.visualElement?.language ?? language,
    undefined,
    { enabled: !!concept.visualElement?.visualElement },
  );

  const visualElementMeta = extractEmbedMeta(data ?? '') as ConceptVisualElementMeta;

  return (
    <ConceptNotionV2
      title={concept.title.title}
      content={concept.content?.content}
      visualElement={visualElementMeta}
      metaImage={concept.metaImage}
      copyright={concept.copyright}
      previewAlt
    />
  );
};

export default PreviewConcept;
