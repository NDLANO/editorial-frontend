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
import { ConceptDTO } from "@ndla/types-backend/concept-api";
import { ConceptVisualElementMeta } from "@ndla/types-embed";
import { BlockConcept, Gloss } from "@ndla/ui";
import { usePreviewArticle } from "../../modules/article/articleGqlQueries";

const getAudioData = (visualElement?: ConceptVisualElementMeta): { title: string; src?: string } => {
  const isSuccessAudio = visualElement?.resource === "audio" && visualElement?.status === "success";
  if (!isSuccessAudio) return { title: "" };

  return {
    title: visualElement?.data.title.title,
    src: visualElement?.data.audioFile?.url,
  };
};

interface Props {
  concept: ConceptDTO;
  language: string;
}
const PreviewConceptComponent = ({ concept, language }: Props) => {
  const { data } = usePreviewArticle(
    concept.visualElement?.visualElement ?? "",
    concept.visualElement?.language ?? language,
    undefined,
    false,
    { enabled: !!concept.visualElement?.visualElement },
  );

  const parsedContent = useMemo(() => {
    if (!concept.content) return;
    return parse(concept.content.htmlContent);
  }, [concept.content]);

  const visualElementMeta = extractEmbedMeta(data ?? "") as ConceptVisualElementMeta;

  const audioData = useMemo(() => getAudioData(visualElementMeta), [visualElementMeta]);

  if (concept.conceptType === "gloss") {
    return <Gloss title={concept.title} glossData={concept.glossData!} audio={audioData} />;
  }

  return (
    <BlockConcept
      title={concept.title.title}
      visualElement={visualElementMeta}
      copyright={concept.copyright}
      previewAlt
    >
      {parsedContent}
    </BlockConcept>
  );
};

export default PreviewConceptComponent;
