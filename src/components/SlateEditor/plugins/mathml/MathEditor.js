/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, createRef, Component } from 'react';
import { injectT } from '@ndla/i18n';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Button from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import Types from 'slate-prop-types';
import { Portal } from '../../../Portal';
import EditMath from './EditMath';
import MathML from './MathML';
import { getSchemaEmbed } from '../../editorSchema';
import { EditorShape } from '../../../../shapes';

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

const getModelFromNode = node => {
  const data = node.data ? node.data.toJS() : {};
  return {
    innerHTML: data.innerHTML || '',
    xlmns: data.xlmns || 'xmlns="http://www.w3.org/1998/Math/MathML',
  };
};

class MathEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { editMode: false, showMenu: false }; // turn off editMode and showMenu on start
    this.mathMLRef = createRef();
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
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
    const { node, editor } = this.props;
    const properties = {
      data: { ...getSchemaEmbed(node), innerHTML: mathML },
    };
    editor.setNodeByKey(node.key, properties);
  }

  handleRemove() {
    const { editor, node } = this.props;
    editor.removeNodeByKey(node.key);
    editor.focus();
  }

  render() {
    const { t, node } = this.props;
    const { editMode, showMenu } = this.state;
    const model = getModelFromNode(node);
    const { top, left } = this.getMenuPosition();

    return (
      <Fragment>
        <span
          ref={this.mathMLRef}
          role="button"
          tabIndex={0}
          onKeyPress={this.toggleMenu}
          onClick={this.toggleMenu}>
          <MathML
            mathRef={this.mathMLRef}
            node={node}
            model={model}
            {...this.props}
          />
          <Portal isOpened={showMenu}>
            <StyledMenu top={top} left={left}>
              <Button stripped css={buttonStyle} onClick={this.toggleEdit}>
                {t('form.edit')}
              </Button>
              |
              <Button stripped css={buttonStyle} onClick={this.handleRemove}>
                {t('form.remove')}
              </Button>
            </StyledMenu>
          </Portal>
        </span>
        {editMode && (
          <EditMath
            onExit={this.toggleEdit}
            model={model}
            handleSave={this.handleSave}
            isEditMode={editMode}
            onRemoveClick={this.handleRemove}
          />
        )}
      </Fragment>
    );
  }
}

MathEditor.propTypes = {
  editor: EditorShape,
  node: Types.node.isRequired,
};

export default injectT(MathEditor);
