import React from 'react';
import styled from '@emotion/styled';
// @ts-ignore
import { constants } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { colors, fonts, spacing } from '@ndla/core';
import { TaxonomyMetadata } from '../../../modules/taxonomy/taxonomyApiInterfaces';

export type ShowMetadataOptions = 'archive' | 'explanationSubject';

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
`;

interface Props {
  metadata: TaxonomyMetadata;
  showMetadata: ShowMetadataOptions[];
}

const translationPaths: Record<ShowMetadataOptions, string> = {
  explanationSubject: 'taxonomy.metadata.customFields.explanationSubject',
  archive: 'subjectCategories.archive',
};

const tagColors = {
  background: {
    archive: colors.brand.greyLight,
    explanationSubject: colors.brand.greyLight,
  },
  text: {
    archive: colors.support.red,
    explanationSubject: colors.text.primary,
  },
};

const StyledTag = styled.div<{ type: ShowMetadataOptions }>`
  font-weight: 600;
  background-color: ${props => tagColors.background[props.type]};
  color: ${props => tagColors.text[props.type]};
  padding: ${spacing.xxsmall} ${spacing.xsmall};
  border-radius: 32px;
  margin-left: ${spacing.xsmall};
  font-size: ${fonts.sizes(12, 1)};
`;

const ItemMetaData = ({ metadata, showMetadata }: Props) => {
  const { t } = useTranslation();

  const { subjectCategories } = constants;

  const shouldShowMetadata = (type: ShowMetadataOptions) => {
    switch (type) {
      case 'archive':
        return metadata?.customFields?.subjectCategory === subjectCategories.ARCHIVE_SUBJECTS;
      case 'explanationSubject':
        return metadata?.customFields?.forklaringsfag === 'true';
      default:
        return false;
    }
  };

  const labels = showMetadata.filter(option => shouldShowMetadata(option));

  if (showMetadata.length === 0) {
    return null;
  }
  return (
    <StyledWrapper>
      {labels.map(type => {
        return <StyledTag type={type}>{t(translationPaths[type])}</StyledTag>;
      })}
    </StyledWrapper>
  );
};

export default ItemMetaData;
