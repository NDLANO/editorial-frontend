import { IConcept } from '@ndla/types-backend/concept-api';
import { Gloss } from '@ndla/ui';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { addShowConceptDefinitionClickListeners } from '@ndla/article-scripts';
import { Embed } from '../../../../../interfaces';
import { parseEmbedTag } from '../../../../../util/embedTagHelpers';

interface Props {
  concept: IConcept;
  handleRemove: () => void;
}

const SlateInlineGloss = ({ concept, handleRemove }: Props) => {
  const { t } = useTranslation();
  const audio = useMemo(() => {
    const embed: Embed | undefined = parseEmbedTag(concept.visualElement?.visualElement);
    if (embed?.resource === 'audio') {
      return {
        url: embed.url,
        title: embed.pageUrl ?? 'oopsie',
      };
    }
  }, [concept.visualElement?.visualElement]);
  useEffect(() => {
    addShowConceptDefinitionClickListeners();
  }, []);

  if (!concept.glossData) return null;

  return (
    <>
      <Gloss audio={audio ?? { title: '' }} title={concept.title} glossData={concept.glossData} />
    </>
  );
};

export default SlateInlineGloss;
