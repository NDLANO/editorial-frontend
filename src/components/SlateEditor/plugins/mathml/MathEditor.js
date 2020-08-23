/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, createRef, Component } from 'react';
import { injectT } from '@ndla/i18n';
import Types from 'slate-prop-types';
import he from 'he';
import { Portal } from '../../../Portal';
import EditMath from './EditMath';
import MathML from './MathML';
import { getSchemaEmbed } from '../../editorSchema';
import { EditorShape } from '../../../../shapes';
import MathMenu from './MathMenu';

const getInfoFromNode = node => {
  const data = node.data ? node.data.toJS() : {};
  const innerHTML = data.innerHTML || `<mn>${he.encode(node.text)}</mn>`;
  return {
    model: {
      innerHTML: innerHTML.startsWith('<math')
        ? innerHTML
        : `<math xmlns="http://www.w3.org/1998/Math/MathML">${innerHTML}</math>`,
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
    if (window.MathJax) window.MathJax.typeset();
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
            <MathMenu
              top={top}
              left={left}
              t={t}
              toggleMenu={this.toggleMenu}
              handleRemove={this.handleRemove}
              toggleEdit={this.toggleEdit}
            />
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
