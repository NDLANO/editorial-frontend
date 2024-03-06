/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useMemo } from "react";
import { extractEmbedMeta } from "@ndla/article-converter";
import { IConcept } from "@ndla/types-backend/concept-api";
import { ConceptVisualElementMeta } from "@ndla/types-embed";
import { ConceptNotionV2, Gloss } from "@ndla/ui";
import { useTaxonomyVersion } from "../../containers/StructureVersion/TaxonomyVersionProvider";
import { usePreviewArticle } from "../../modules/article/articleGqlQueries";
import { useSearchNodes } from "../../modules/nodes/nodeQueries";
import parseMarkdown from "../../util/parseMarkdown";

const getAudioData = (visualElement?: ConceptVisualElementMeta): { title: string; src?: string } => {
  const isSuccessAudio = visualElement?.resource === "audio" && visualElement?.status === "success";
  if (!isSuccessAudio) return { title: "" };

  return {
    title: visualElement?.data.title.title,
    src: visualElement?.data.audioFile?.url,
  };
};

interface Props {
  concept: IConcept;
  language: string;
}
const PreviewConceptComponent = ({ concept, language }: Props) => {
  const { taxonomyVersion } = useTaxonomyVersion();
  const { data } = usePreviewArticle(
    concept.visualElement?.visualElement!,
    concept.visualElement?.language ?? language,
    undefined,
    { enabled: !!concept.visualElement?.visualElement },
  );

  const parsedContent = useMemo(() => {
    if (!concept.content) return;
    return parse(parseMarkdown({ markdown: concept.content.htmlContent, inline: true }));
  }, [concept.content]);

  const { data: subjects } = useSearchNodes(
    {
      ids: concept.subjectIds!,
      taxonomyVersion,
    },
    { enabled: !!concept.subjectIds?.length },
  );
  const visualElementMeta = extractEmbedMeta(data ?? "") as ConceptVisualElementMeta;

  const audioData = useMemo(() => getAudioData(visualElementMeta), [visualElementMeta]);

  return (
    <>
      {concept.conceptType === "gloss" ? (
        <Gloss title={concept.title} glossData={concept.glossData!} audio={audioData} />
      ) : (
        <ConceptNotionV2
          title={concept.title}
          content={parsedContent}
          visualElement={visualElementMeta}
          copyright={concept.copyright}
          tags={concept.tags?.tags}
          subjects={subjects?.results?.map((res) => res.name)}
          conceptType={concept.conceptType}
          previewAlt
        />
      )}
    </>
  );
};

export default PreviewConceptComponent;
