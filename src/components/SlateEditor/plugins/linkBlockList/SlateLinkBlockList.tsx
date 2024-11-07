/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { Portal } from "@ark-ui/react";
import { Pencil, AddLine, DeleteBinLine } from "@ndla/icons/action";
import { DialogContent, DialogRoot, DialogTrigger, IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { LinkBlockEmbedData } from "@ndla/types-embed";
import { EmbedWrapper, LinkBlock, LinkBlockSection } from "@ndla/ui";
import LinkBlockForm from "./LinkBlockForm";
import { LinkBlockListElement } from "./types";

interface Props {
  attributes: RenderElementProps["attributes"];
  editor: Editor;
  element: LinkBlockListElement;
  children: ReactNode;
}

const HeaderWrapper = styled("div", {
  base: {
    position: "absolute",
    right: "0",
    top: "-xlarge",
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    gap: "3xsmall",
  },
});

const SlateLinkBlockList = ({ attributes, editor, element, children }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setOpen(!!element.isFirstEdit);
  }, [element.isFirstEdit]);

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
    <DialogRoot open={open} onOpenChange={(details) => onOpenChange(details.open)}>
      <EmbedWrapper {...attributes} contentEditable={false}>
        {children}
        <HeaderWrapper>
          <DialogTrigger asChild>
            <IconButton aria-label={t("linkBlock.create")} title={t("linkBlock.create")} size="small">
              <AddLine />
            </IconButton>
          </DialogTrigger>
          <Portal>
            <DialogContent>
              <LinkBlockForm onSave={onSaveNewElement} existingEmbeds={element.data ?? []} />
            </DialogContent>
          </Portal>
          <IconButton
            aria-label={t("linkBlock.deleteBlock")}
            title={t("linkBlock.deleteBlock")}
            variant="danger"
            size="small"
            onClick={handleRemove}
          >
            <DeleteBinLine />
          </IconButton>
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
      </EmbedWrapper>
    </DialogRoot>
  );
};

interface SlateLinkBlockProps {
  link: LinkBlockEmbedData;
  allEmbeds: LinkBlockEmbedData[];
  onSave: (embed: LinkBlockEmbedData, index: number) => void;
  index: number;
  onDelete: (index: number) => void;
}

const ButtonWrapper = styled("div", {
  base: {
    position: "absolute",
    right: "-xlarge",
    top: "0",
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

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
    <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <EmbedWrapper>
        <LinkBlock title={link.title} url={link.url} date={link.date} />
        <ButtonWrapper>
          <DialogTrigger>
            <IconButton aria-label={t("linkBlock.edit")} title={t("linkBlock.edit")} size="small">
              <Pencil />
            </IconButton>
          </DialogTrigger>
          <Portal>
            <DialogContent>
              <LinkBlockForm embed={link} onSave={onSaveElement} existingEmbeds={otherEmbeds} />
            </DialogContent>
          </Portal>

          <IconButton
            variant="danger"
            size="small"
            aria-label={t("linkBlock.delete")}
            title={t("linkBlock.delete")}
            onClick={() => onDelete(index)}
          >
            <DeleteBinLine />
          </IconButton>
        </ButtonWrapper>
      </EmbedWrapper>
    </DialogRoot>
  );
};

export default SlateLinkBlockList;
