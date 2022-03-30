/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useRef, useState } from 'react';
import { Editor, Node } from 'slate';
import { RenderElementProps } from 'slate-react';
import Button from '@ndla/button';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/core';
import { colors, spacing } from '@ndla/core';
import config from '../../../../config';
import { toEditArticle, toLearningpathFull } from '../../../../util/routeHelpers';
import { Portal } from '../../../Portal';
import isNodeInCurrentSelection from '../../utils/isNodeInCurrentSelection';
import { classes } from '../../RichTextEditor';
import EditLink from './EditLink';
import { ContentLinkElement, LinkElement } from '.';

const linkMenuButtonStyle = css`
  color: ${colors.brand.primary};
  text-decoration: underline;
`;

interface StyledLinkMenuProps {
  top: number;
  left: number;
}

const StyledLinkMenu = styled('span')<StyledLinkMenuProps>`
  position: absolute;
  top: ${p => p.top}px;
  left: ${p => p.left}px;
  padding: calc(${spacing.small} / 2);
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid ${colors.brand.greyLight};
  z-index: 1;
`;

const fetchResourcePath = (data: ContentLinkElement, language: string, contentType: string) => {
  const id = data['content-id'];
  return contentType === 'learningpath'
    ? toLearningpathFull(id, language)
    : `${config.editorialFrontendDomain}${toEditArticle(id, contentType)}`;
};

function hasHrefOrContentId(node: LinkElement | ContentLinkElement) {
  if (node.type === 'content-link') {
    return !!node['content-id'];
  } else {
    return !!node.href;
  }
}

interface Props {
  attributes: RenderElementProps['attributes'];
  editor: Editor;
  element: LinkElement | ContentLinkElement;
  language: string;
  children: JSX.Element;
}

export interface Model {
  href: string;
  text: string;
  checkbox: boolean;
}

const Link = (props: Props) => {
  const {
    attributes,
    editor: { onChange },
    editor,
    element,
    language,
    children,
  } = props;
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [model, setModel] = useState<Model | undefined>();
  const [editMode, setEditMode] = useState(!hasHrefOrContentId(element));

  const { t } = useTranslation();

  const getMenuPosition = () => {
    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      return {
        top: window.scrollY + rect.top + rect.height,
        left: rect.left,
      };
    }
    return {
      top: 0,
      left: 0,
    };
  };

  const toggleEditMode = () => {
    setEditMode(prev => !prev);
  };

  useEffect(() => {
    const setStateFromNode = async () => {
      let href;
      let checkbox;
      if (element.type === 'content-link') {
        const contentType = element['content-type'] || 'article';
        href = `${fetchResourcePath(element, language, contentType)}`;
        checkbox = element['open-in'] === 'new-context';
      } else {
        href = element.href;
        checkbox = element.target === '_blank';
      }

      setModel({
        href,
        text: Node.string(element),
        checkbox,
      });
    };
    setStateFromNode();
  }, [element, language]);

  const { top, left } = getMenuPosition();
  const isInline = isNodeInCurrentSelection(editor, element);

  return (
    <a {...attributes} href={model?.href} {...classes('link')} ref={linkRef}>
      {children}
      {model && (
        <>
          <Portal isOpened={isInline}>
            <StyledLinkMenu top={top} left={left}>
              <Button css={linkMenuButtonStyle} stripped onClick={toggleEditMode}>
                {t('form.content.link.change')}
              </Button>{' '}
              | {t('form.content.link.goTo')}{' '}
              <a href={model?.href} target="_blank" rel="noopener noreferrer">
                {' '}
                {model?.href}
              </a>
            </StyledLinkMenu>
          </Portal>
          {editMode && (
            <EditLink {...props} model={model} closeEditMode={toggleEditMode} onChange={onChange} />
          )}
        </>
      )}
    </a>
  );
};

export default Link;
