/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useMemo, useState } from 'react';
import { Editor, Path, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { LinkBlockEmbedData } from '@ndla/types-embed';
import { LinkBlock, LinkBlockSection } from '@ndla/ui';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { IconButtonV2 } from '@ndla/button';
import { Pencil, Plus } from '@ndla/icons/action';
import { Modal, ModalContent, ModalTrigger } from '@ndla/modal';
import { useTranslation } from 'react-i18next';
import { DeleteForever } from '@ndla/icons/editor';
import { LinkBlockListElement } from './types';
import LinkBlockForm from './LinkBlockForm';

interface Props {
  attributes: RenderElementProps['attributes'];
  editor: Editor;
  element: LinkBlockListElement;
  children: ReactNode;
}

const BlockListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
`;

const HeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-end;
  gap: ${spacing.small};
`;

const SlateLinkBlockList = ({ attributes, editor, element, children }: Props) => {
  const [open, setOpen] = useState(element.isFirstEdit);
  const { t } = useTranslation();

  const onOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);
      if (!open) {
        ReactEditor.focus(editor);
        if (element.isFirstEdit) {
          Transforms.removeNodes(editor, {
            at: ReactEditor.findPath(editor, element),
            voids: true,
          });
        }
        const path = ReactEditor.findPath(editor, element);
        if (Editor.hasPath(editor, Path.next(path))) {
          setTimeout(() => {
            Transforms.select(editor, Path.next(path));
          }, 0);
        }
      }
    },
    [editor, element],
  );

  const onSave = useCallback(
    (embed: LinkBlockEmbedData) => {
      const existingEmbed = element.data?.find((em) => em.url === embed.url);
      const path = ReactEditor.findPath(editor, element);
      if (existingEmbed) {
        const newData = element.data?.map((em) => (em.url === embed.url ? embed : em));
        Transforms.setNodes(editor, { data: newData }, { at: path });
      } else {
        const existingData = element.data ?? [];
        const properties = {
          data: existingData.concat(embed),
          isFirstEdit: false,
        };
        Transforms.setNodes(editor, properties, { at: path });
      }
      ReactEditor.focus(editor);
    },
    [editor, element],
  );

  const onSaveNewElement = useCallback(
    (embed: LinkBlockEmbedData) => {
      onSave(embed);
      setOpen(false);
    },
    [onSave],
  );

  const handleRemove = useCallback(
    () =>
      Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true }),
    [editor, element],
  );

  const onDelete = useCallback(
    (embed: LinkBlockEmbedData) => {
      const newData = element.data?.filter((em) => em.url !== embed.url);
      const path = ReactEditor.findPath(editor, element);
      if (!newData?.length) {
        Transforms.removeNodes(editor, { at: path, voids: true });
      } else {
        Transforms.setNodes(editor, { data: newData }, { at: path });
      }
    },
    [editor, element],
  );

  return (
    <BlockListWrapper {...attributes} contentEditable={false}>
      {children}
      <HeaderWrapper>
        <Modal open={open} onOpenChange={onOpenChange}>
          <ModalTrigger>
            <IconButtonV2 aria-label={t('linkBlock.create')} title={t('linkBlock.create')}>
              <Plus />
            </IconButtonV2>
          </ModalTrigger>
          <ModalContent>
            <LinkBlockForm onSave={onSaveNewElement} existingEmbeds={element.data ?? []} />
          </ModalContent>
        </Modal>
        <IconButtonV2
          aria-label={t('linkBlock.deleteBlock')}
          title={t('linkBlock.deleteBlock')}
          colorTheme="danger"
          onClick={handleRemove}
        >
          <DeleteForever />
        </IconButtonV2>
      </HeaderWrapper>
      <LinkBlockSection>
        {element.data?.map((el) => (
          <SlateLinkBlock
            key={el.url}
            link={el}
            onDelete={onDelete}
            onSave={onSave}
            allEmbeds={element.data ?? []}
          />
        ))}
      </LinkBlockSection>
    </BlockListWrapper>
  );
};

interface SlateLinkBlockProps {
  link: LinkBlockEmbedData;
  allEmbeds: LinkBlockEmbedData[];
  onSave: (embed: LinkBlockEmbedData) => void;
  onDelete: (embed: LinkBlockEmbedData) => void;
}

const LinkBlockWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  a {
    width: 100%;
  }
  gap: ${spacing.small};
`;

const SlateLinkBlock = ({ link, onSave, onDelete, allEmbeds }: SlateLinkBlockProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const otherEmbeds = useMemo(
    () => allEmbeds.filter((el) => el.url !== link.url),
    [allEmbeds, link],
  );

  const onSaveElement = useCallback(
    (embed: LinkBlockEmbedData) => {
      onSave(embed);
      setOpen(false);
    },
    [onSave],
  );

  return (
    <LinkBlockWrapper>
      <LinkBlock {...link} />
      <Modal open={open} onOpenChange={setOpen}>
        <ModalTrigger>
          <IconButtonV2 aria-label={t('linkBlock.edit')} title={t('linkBlock.edit')}>
            <Pencil />
          </IconButtonV2>
        </ModalTrigger>
        <ModalContent>
          <LinkBlockForm embed={link} onSave={onSaveElement} existingEmbeds={otherEmbeds} />
        </ModalContent>
      </Modal>
      <IconButtonV2
        colorTheme="danger"
        aria-label={t('linkBlock.delete')}
        title={t('linkBlock.delete')}
        onClick={() => onDelete(link)}
      >
        <DeleteForever />
      </IconButtonV2>
    </LinkBlockWrapper>
  );
};

export default SlateLinkBlockList;
