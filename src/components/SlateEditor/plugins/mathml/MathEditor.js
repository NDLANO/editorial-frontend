/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, createRef, Component } from 'react';
import { injectT } from '@ndla/i18n';
import styled from 'react-emotion';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import Types from 'slate-prop-types';

import { Portal } from '../../../Portal';
import EditMath from './EditMath';
import { MathML } from './MathML';

const StyledMenu = styled('span')`
  cursor: pointer;
  position: absolute;
  padding: ${spacing.xsmall};
  background-color: white;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border: 1px solid ${colors.brand.greyLight};
  z-index: 1;

  button {
    color: ${colors.brand.primary};
    text-decoration: underline;
  }
`;

class MathEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { editMode: false };
    this.mathMLRef = createRef();
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  getMenuPosition() {
    if (this.mathMLRef.current) {
      const rect = this.mathMLRef.current.getBoundingClientRect();
      return {
        top: window.scrollY + rect.top + rect.height,
        left: rect.left,
      };
    }
    return {
      top: 0,
      left: 0,
    };
  }

  toggleMenu() {
    this.setState(prevState => ({ showMenu: !prevState.showMenu }));
  }

  toggleEdit() {
    this.setState(prevState => ({ editMode: !prevState.editMode }));
  }

  handleSave(mathML) {
    console.log(mathML); // TODO Add save handling
  }

  render() {
    const { onRemoveClick, t } = this.props;
    const { editMode, showMenu } = this.state;

    const { top, left } = this.getMenuPosition();

    return (
      <Fragment>
        <div
          ref={this.mathMLRef}
          role="button"
          tabIndex={0}
          onKeyPress={this.toggleMenu}
          onClick={this.toggleMenu}>
          <MathML mathRef={this.mathMLRef} {...this.props} />
          <Portal isOpened={showMenu}>
            <StyledMenu style={{ top: `${top}px`, left: `${left}px` }}>
              <Button stripped onClick={this.toggleEdit}>
                {t('mathEditor.edit')}
              </Button>{' '}
              |{' '}
              <Button stripped onClick={onRemoveClick}>
                {t('mathEditor.remove')}
              </Button>{' '}
            </StyledMenu>
          </Portal>
        </div>
        {editMode && (
          <EditMath
            onExit={this.toggleEdit}
            handleSave={this.handleSave}
            isEditMode={editMode}
            {...this.props}
          />
        )}
      </Fragment>
    );
  }
}

MathEditor.propTypes = {
  onRemoveClick: PropTypes.func.isRequired,
  node: Types.node.isRequired,
};

export default injectT(MathEditor);
