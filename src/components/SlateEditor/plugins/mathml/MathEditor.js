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
import he from 'he';
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

const getInfoFromNode = node => {
  const data = node.data ? node.data.toJS() : {};
  return {
    model: {
      innerHTML: data.innerHTML || `<mn>${he.encode(node.text)}</mn>`,
      xlmns: data.xlmns || 'xmlns="http://www.w3.org/1998/Math/MathML',
    },
    isFirstEdit: data.innerHTML === undefined,
  };
};

class MathEditor extends Component {
  constructor(props) {
    super(props);
    const { isFirstEdit } = getInfoFromNode(props.node);
    this.state = { isFirstEdit, editMode: isFirstEdit, showMenu: false }; // turn off editMode and showMenu on start
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

  onExit = () => {
    this.setState(prevState => ({ editMode: false }));
    if (this.state.isFirstEdit) {
      this.handleRemove();
    }
  };

  handleSave(mathML) {
    const { node, editor } = this.props;
    const properties = {
      data: { ...getSchemaEmbed(node), innerHTML: mathML },
    };
    editor.setNodeByKey(node.key, properties);
    this.setState({ isFirstEdit: false, editMode: false });
  }

  handleRemove() {
    const { editor, node } = this.props;
    editor.unwrapInlineByKey(node.key, 'mathml');
    editor.focus();
  }

  render() {
    const { t, node } = this.props;
    const { editMode, showMenu } = this.state;
    const { model } = getInfoFromNode(node);

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
            onExit={this.onExit}
            model={model}
            handleSave={this.handleSave}
            isEditMode={editMode}
            handleRemove={this.handleRemove}
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
