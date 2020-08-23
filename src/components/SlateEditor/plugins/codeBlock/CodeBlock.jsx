import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Types from 'slate-prop-types';
import he from 'he';

import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import { css } from '@emotion/core';
import { colors, spacing } from '@ndla/core';

import { EditorShape } from '../../../../shapes';
import EditCodeBlock from './EditCodeBlock';


const buttonStyle = css`
  color: ${colors.brand.primary};
  text-decoration: underline;
  margin: 0 ${spacing.xsmall};
`;

const getInfoFromNode = node => {
  const data = node?.data ? node.data.toJS() : {};
  const codeBlock = data.codeBlock || node.text; // he.encode ???
  return {
    model: {
      code: codeBlock ? codeBlock : '',
      title: data.programmingLanguage || 'Text', // pure text w/o highlighting
      format: 'text'
    },
    isFirstEdit: data.codeBlock === undefined,
  };
};

class CodeBlock extends Component {

  constructor(props) {
    super(props);
    const { isFirstEdit } = getInfoFromNode(props.node);
    this.state = {isFirstEdit, editMode: isFirstEdit, showMenu: false};
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  toggleEditMode () {
    this.setState(prevState => ({ editMode: !prevState.editMode }));
  };

  render() {
    const { t, editor, node } = this.props;
    const { editMode } = this.state;
    const { model } = getInfoFromNode(node);

    return (
      <>
        <code>{this.children}</code>
        <Button stripped css={buttonStyle} onClick={this.toggleEdit}>
          {t('form.edit')}
        </Button>
        
        {editMode && (
          <EditCodeBlock
            editor={editor}
            node={node}
            model={model}
            blur={editor.blur}
            closeDialog={this.toggleEditMode}
            onChange={editor.onChange}
          />
        )}
      </>
    )
  }
};

CodeBlock.propTypes = {
  editor: EditorShape,
  node: Types.node.isRequired,
};

export default injectT(CodeBlock);
