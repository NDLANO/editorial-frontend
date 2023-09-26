import { IconButtonV2 } from '@ndla/button';
import { Check, DeleteForever, Link, Warning } from '@ndla/icons/lib/editor';
import { SafeLinkIconButton } from '@ndla/safelink';
import Tooltip from '@ndla/tooltip';
import { IConcept } from '@ndla/types-backend/build/concept-api';
import { Gloss } from '@ndla/ui';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PUBLISHED } from '../../../../../constants';
import { Embed } from '../../../../../interfaces';
import { parseEmbedTag } from '../../../../../util/embedTagHelpers';
import { StyledFigureButtons } from '../../embed/FigureButtons';

interface Props {
  concept: IConcept;
  handleRemove: () => void;
}

const SlateBlockGloss = ({ concept, handleRemove }: Props) => {
  const { t, i18n } = useTranslation();

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
    <>
      <Gloss
        title={concept.title}
        audio={audio ?? { url: '', title: '' }}
        glossData={concept.glossData}
      />
      <StyledFigureButtons>
        <Tooltip tooltip={t('form.concept.removeConcept')}>
          <IconButtonV2
            aria-label={t('form.concept.removeConcept')}
            variant="ghost"
            colorTheme="danger"
            onClick={handleRemove}
          >
            <DeleteForever />
          </IconButtonV2>
        </Tooltip>
        <Tooltip tooltip={t('form.concept.edit')}>
          <SafeLinkIconButton
            aria-label={t('form.concept.edit')}
            variant="ghost"
            colorTheme="light"
            to={`/concept/${concept.id}/edit/${concept.content?.language ?? i18n.language}`}
            target="_blank"
          >
            <Link />
          </SafeLinkIconButton>
        </Tooltip>
        {(concept?.status.current === PUBLISHED || concept?.status.other.includes(PUBLISHED)) && (
          <Tooltip tooltip={t('form.workflow.published')}>
            <Check />
          </Tooltip>
        )}
        {concept?.status.current !== PUBLISHED && (
          <Tooltip
            tooltip={t('form.workflow.currentStatus', {
              status: t(`form.status.${concept?.status.current.toLowerCase()}`),
            })}
          >
            <Warning />
          </Tooltip>
        )}
      </StyledFigureButtons>
    </>
  );
};

export default SlateBlockGloss;
