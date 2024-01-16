/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { spacing, colors, spacingUnit, fonts } from '@ndla/core';
import { DeleteForever, Link } from '@ndla/icons/editor';
import SafeLink from '@ndla/safelink';
import ElementImage, { ELEMENT_HEIGHT } from './ElementImage';
import { ExternalElementType, ListElement } from './ElementList';
import { createGuard } from '../../../util/guards';
import { resourceToLinkProps } from '../../../util/resourceHelpers';

const isExternal = createGuard<ExternalElementType>('isExternal');

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.xxsmall};
  background: ${colors.brand.greyLighter};
  width: 100%;
  margin-bottom: ${spacing.xxsmall};
`;

const StyledLinkContainer = styled.div`
  background: ${colors.background.darker};
  width: ${ELEMENT_HEIGHT * 1.33}px;
  height: ${ELEMENT_HEIGHT - spacingUnit / 2}px;
  object-fit: cover;
  margin-right: ${spacing.small};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  svg {
    height: 30px;
    width: 30px;
    color: ${colors.brand.greyMedium};
  }
`;
const StyledSafeLink = styled(SafeLink)`
  font-weight: ${fonts.weight.semibold};
  color: ${colors.brand.primary};
`;

interface DeleteButtonProps {
  onDelete: (v: number) => void;
  index: number;
  removeElementTranslation?: string;
}
const DeleteButton = ({ onDelete, index, removeElementTranslation }: DeleteButtonProps) => {
  const { t } = useTranslation();
  return (
    <IconButtonV2
      aria-label={removeElementTranslation ?? t('form.relatedContent.removeArticle')}
      variant="ghost"
      colorTheme="danger"
      data-testid="elementListItemDeleteButton"
      onClick={() => onDelete(index)}
      title={removeElementTranslation ?? t('form.relatedContent.removeArticle')}
    >
      <DeleteForever />
    </IconButtonV2>
  );
};

interface Props {
  element: ListElement;
  onDelete: (v: number) => void;
  index: number;
  removeElementTranslation?: string;
  articleType?: string;
  isDeletable: boolean;
}

const ListElementCard = ({
  element,
  onDelete,
  index,
  removeElementTranslation,
  articleType,
  isDeletable,
}: Props) => {
  const { i18n } = useTranslation();
  const isExternalElement = isExternal(element);

  if (isExternalElement) {
    return (
      <StyledCard>
        <StyledWrapper>
          <StyledLinkContainer>
            <Link />
          </StyledLinkContainer>
          <StyledSafeLink to={element.url} target="_blank">
            {element.title}
          </StyledSafeLink>
        </StyledWrapper>
        {isDeletable && (
          <DeleteButton
            onDelete={onDelete}
            index={index}
            removeElementTranslation={removeElementTranslation}
          />
        )}
      </StyledCard>
    );
  }

  const linkProps = resourceToLinkProps(
    element,
    element.articleType ?? articleType ?? 'learning-path',
    i18n.language,
  );

  return (
    <StyledCard data-testid="elementListItem">
      <StyledWrapper>
        <ElementImage url={element.metaImage?.url} alt={element?.metaImage?.alt} />
        <StyledSafeLink to={linkProps.to ? linkProps.to : linkProps.href!}>
          {element.title?.title}
        </StyledSafeLink>
      </StyledWrapper>
      {isDeletable && (
        <DeleteButton
          onDelete={onDelete}
          index={index}
          removeElementTranslation={removeElementTranslation}
        />
      )}
    </StyledCard>
  );
};

export default ListElementCard;
