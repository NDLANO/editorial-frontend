import { ButtonV2 } from '@ndla/button';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { useTranslation } from 'react-i18next';

const StyledMenu = styled.span`
  display: flex;
  gap: ${spacing.xsmall};
  padding: ${spacing.xsmall};
  background-color: white;
  border: 1px solid ${colors.brand.greyLight};
`;

interface Props {
  handleRemove: () => void;
  toggleEdit: () => void;
}

const BlockMenu = ({ handleRemove, toggleEdit }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledMenu>
      <ButtonV2 variant="link" onClick={toggleEdit}>
        {t('form.edit')}
      </ButtonV2>
      |
      <ButtonV2 variant="link" onClick={handleRemove}>
        {t('form.remove')}
      </ButtonV2>
    </StyledMenu>
  );
};

export default BlockMenu;
