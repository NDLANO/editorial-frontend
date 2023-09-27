/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { extractEmbedMeta } from '@ndla/article-converter';
import { IConcept } from '@ndla/types-backend/concept-api';
import { ConceptVisualElementMeta } from '@ndla/types-embed';
import { ConceptNotionV2, Gloss } from '@ndla/ui';
import { useMemo } from 'react';
import { useTaxonomyVersion } from '../../containers/StructureVersion/TaxonomyVersionProvider';
import { usePreviewArticle } from '../../modules/article/articleGqlQueries';
import { useSearchNodes } from '../../modules/nodes/nodeQueries';

const getAudioData = (
  visualElement?: ConceptVisualElementMeta,
): { title: string; src?: string } => {
  const isSuccessAudio = visualElement?.resource === 'audio' && visualElement?.status === 'success';
  if (!isSuccessAudio) return { title: '' };

  return {
    title: visualElement?.data.title.title,
    src: visualElement?.data.audioFile?.url,
  };
};

interface Props {
  concept: IConcept;
  language: string;
}
const PreviewConcept = ({ concept, language }: Props) => {
  const { taxonomyVersion } = useTaxonomyVersion();
  const { data } = usePreviewArticle(
    concept.visualElement?.visualElement!,
    concept.visualElement?.language ?? language,
    undefined,
    { enabled: !!concept.visualElement?.visualElement },
  );

  const { data: subjects } = useSearchNodes(
    {
      ids: concept.subjectIds!,
      taxonomyVersion,
    },
    { enabled: !!concept.subjectIds?.length },
  );
  const visualElementMeta = extractEmbedMeta(data ?? '') as ConceptVisualElementMeta;

  const audioData = useMemo(() => getAudioData(visualElementMeta), [visualElementMeta]);

  return (
    <>
      {concept.conceptType === 'gloss' ? (
        <Gloss title={concept.title} glossData={concept.glossData!} audio={audioData} />
      ) : (
        <ConceptNotionV2
          title={concept.title.title}
          content={concept.content?.content}
          visualElement={visualElementMeta}
          metaImage={concept.metaImage}
          copyright={concept.copyright}
          tags={concept.tags?.tags}
          subjects={subjects?.results?.map((res) => res.name)}
          previewAlt
        />
      )}
    </>
  );
};

export default PreviewConcept;
