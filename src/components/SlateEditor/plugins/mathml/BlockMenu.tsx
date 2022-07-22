import { PureComponent } from 'react';
import Button from '@ndla/button';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { WithTranslation, withTranslation } from 'react-i18next';

const StyledMenu = styled('span')<{ top: number; left: number }>`
  cursor: pointer;
  position: absolute;
  padding: ${spacing.xsmall};
  background-color: white;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border: 1px solid ${colors.brand.greyLight};
  z-index: 1;
  ${p => (p.left ? `left: ${p.left}px;` : '')};
  ${p => (p.top ? `top: ${p.top}px;` : '')};
`;

const StyledButton = styled(Button)`
  color: ${colors.brand.primary};
  text-decoration: underline;
  margin: 0 ${spacing.xsmall};
`;

interface Props {
  top: number;
  left: number;
  handleRemove: () => void;
  toggleEdit: () => void;
  toggleMenu: (event: Event) => void;
}

class BlockMenu extends PureComponent<Props & WithTranslation> {
  modal: HTMLSpanElement | null | undefined;
  componentDidMount() {
    document.addEventListener('click', this.closeModal, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeModal, false);
  }

  closeModal = (event: Event) => {
    if (this.modal && event.target instanceof Element && !this.modal.contains(event.target)) {
      this.props.toggleMenu(event);
    }
  };

  render() {
    const { t, top, left, handleRemove, toggleEdit } = this.props;
    return (
      <StyledMenu top={top} left={left} ref={node => (this.modal = node)}>
        <StyledButton stripped onClick={toggleEdit}>
          {t('form.edit')}
        </StyledButton>
        |
        <StyledButton stripped onClick={handleRemove}>
          {t('form.remove')}
        </StyledButton>
      </StyledMenu>
    );
  }
}

export default withTranslation()(BlockMenu);
