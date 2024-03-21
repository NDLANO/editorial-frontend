/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { Pencil, Plus } from "@ndla/icons/action";
import { DeleteForever } from "@ndla/icons/editor";
import { Modal, ModalContent, ModalTrigger } from "@ndla/modal";
import { LinkBlockEmbedData } from "@ndla/types-embed";
import { LinkBlock, LinkBlockSection } from "@ndla/ui";
import LinkBlockForm from "./LinkBlockForm";
import { LinkBlockListElement } from "./types";
import { StyledDeleteEmbedButton } from "../embed/FigureButtons";

interface Props {
  attributes: RenderElementProps["attributes"];
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
    (embed: LinkBlockEmbedData, index?: number) => {
      const path = ReactEditor.findPath(editor, element);
      if (index !== undefined && element.data) {
        const newData = element.data?.map((em, idx) => (index === idx ? embed : em));
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
      Transforms.removeNodes(editor, {
        at: ReactEditor.findPath(editor, element),
        voids: true,
      }),
    [editor, element],
  );

  const onDelete = useCallback(
    (index: number) => {
      const newData = element.data?.filter((_, idx) => idx !== index);
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
            <IconButtonV2 aria-label={t("linkBlock.create")} title={t("linkBlock.create")}>
              <Plus />
            </IconButtonV2>
          </ModalTrigger>
          <ModalContent>
            <LinkBlockForm onSave={onSaveNewElement} existingEmbeds={element.data ?? []} />
          </ModalContent>
        </Modal>
        <StyledDeleteEmbedButton
          aria-label={t("linkBlock.deleteBlock")}
          title={t("linkBlock.deleteBlock")}
          colorTheme="danger"
          onClick={handleRemove}
        >
          <DeleteForever />
        </StyledDeleteEmbedButton>
      </HeaderWrapper>
      <LinkBlockSection>
        {element.data?.map((el, index) => (
          <SlateLinkBlock
            key={el.url}
            link={el}
            index={index}
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
  onSave: (embed: LinkBlockEmbedData, index: number) => void;
  index: number;
  onDelete: (index: number) => void;
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

const SlateLinkBlock = ({ link, onSave, onDelete, allEmbeds, index }: SlateLinkBlockProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const otherEmbeds = useMemo(() => allEmbeds.filter((el) => el.url !== link.url), [allEmbeds, link]);

  const onSaveElement = useCallback(
    (embed: LinkBlockEmbedData) => {
      onSave(embed, index);
      setOpen(false);
    },
    [onSave, index],
  );

  return (
    <LinkBlockWrapper>
      <LinkBlock title={link.title} url={link.url} date={link.date} />
      <Modal open={open} onOpenChange={setOpen}>
        <ModalTrigger>
          <IconButtonV2 aria-label={t("linkBlock.edit")} title={t("linkBlock.edit")}>
            <Pencil />
          </IconButtonV2>
        </ModalTrigger>
        <ModalContent>
          <LinkBlockForm embed={link} onSave={onSaveElement} existingEmbeds={otherEmbeds} />
        </ModalContent>
      </Modal>
      <StyledDeleteEmbedButton
        colorTheme="danger"
        aria-label={t("linkBlock.delete")}
        title={t("linkBlock.delete")}
        onClick={() => onDelete(index)}
      >
        <DeleteForever />
      </StyledDeleteEmbedButton>
    </LinkBlockWrapper>
  );
};

export default SlateLinkBlockList;
