import Button from '@ndla/button';
import React, { PureComponent } from 'react';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { css } from '@emotion/core';
import PropTypes from 'prop-types';

const StyledMenu = styled('span')`
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

const buttonStyle = css`
  color: ${colors.brand.primary};
  text-decoration: underline;
  margin: 0 ${spacing.xsmall};
`;

class MathMenu extends PureComponent {
  componentDidMount() {
    document.addEventListener('click', this.closeModal, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeModal, false);
  }

  closeModal = ({ target }) => {
    if (this.modal && !this.modal.contains(target)) {
      this.props.toggleMenu();
    }
  };

  render() {
    const { t, top, left, handleRemove,toggleEdit } = this.props;
    return (
      <StyledMenu top={top} left={left} ref={node => (this.modal = node)}>
        <Button stripped css={buttonStyle} onClick={toggleEdit}>
          {t('form.edit')}
        </Button>
        |
        <Button stripped css={buttonStyle} onClick={handleRemove}>
          {t('form.remove')}
        </Button>
      </StyledMenu>
    );
  }
}

MathMenu.propTypes = {
  top: PropTypes.number,
  left: PropTypes.number,
  t: PropTypes.func,
  toggleMenu: PropTypes.func,
  toggleEdit: PropTypes.func,
  handleRemove: PropTypes.func,
};

export default MathMenu;
