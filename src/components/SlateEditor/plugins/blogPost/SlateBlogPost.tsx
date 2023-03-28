/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { Pencil } from '@ndla/icons/lib/action';
import { ModalBody, ModalCloseButton, ModalHeaderV2, ModalV2 } from '@ndla/modal';
import { BlogPostEmbedData } from '@ndla/types-embed';
import { BlogPostV2 } from '@ndla/ui';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor, Path, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import config from '../../../../config';
import DeleteButton from '../../../DeleteButton';
import BlogPostForm from './BlogPostForm';
import { BlogPostElement } from './types';

interface Props extends RenderElementProps {
  element: BlogPostElement;
  editor: Editor;
}

const BlogPostWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const imageUrl = `${config.ndlaApiUrl}/image-api/raw/id/`;

const SlateBlogPost = ({ element, editor }: Props) => {
  const [isEditing, setIsEditing] = useState(element.isFirstEdit);
  const [blogPost, setBlogPost] = useState<BlogPostEmbedData | undefined>(element.data);

  const handleRemove = () => {
    Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
  };

  const onClose = () => {
    ReactEditor.focus(editor);
    setIsEditing(false);
    if (element.isFirstEdit) {
      Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
    }
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
  };

  const onSave = useCallback((data: BlogPostEmbedData) => {
    setBlogPost(data);
    setIsEditing(false);
  }, []);

  const StyledModalHeader = styled(ModalHeaderV2)`
    padding-bottom: 0px;
  `;

  const StyledModalBody = styled(ModalBody)`
    padding-top: 0px;
    h2 {
      margin: 0px;
    }
  `;

  const { t } = useTranslation();
  return (
    <>
      {blogPost && (
        <BlogPostWrapper contentEditable={false}>
          <ButtonContainer>
            <IconButtonV2 variant="ghost" onClick={() => setIsEditing(true)} aria-label="Rediger">
              <Pencil />
            </IconButtonV2>
            <DeleteButton aria-label={t('delete')} onClick={handleRemove} />
          </ButtonContainer>
          <BlogPostV2
            title={{ title: blogPost.title, language: blogPost.language }}
            author={blogPost.author}
            size={blogPost.size}
            url={blogPost.url}
            metaImage={{
              url: `${imageUrl}/${blogPost.imageId}`,
              alt: '',
            }}
          />
        </BlogPostWrapper>
      )}
      {isEditing && (
        <ModalV2
          controlled
          isOpen
          size="large"
          aria-label={t('blogPostForm.title')}
          onClose={onClose}
        >
          {(close) => (
            <>
              <StyledModalHeader>
                <h1>{t('blogPostForm.title')}</h1>
                <ModalCloseButton onClick={close} />
              </StyledModalHeader>
              <StyledModalBody>
                <BlogPostForm onSave={onSave} initialData={blogPost} onCancel={close} />
              </StyledModalBody>
            </>
          )}
        </ModalV2>
      )}
    </>
  );
};

export default SlateBlogPost;
