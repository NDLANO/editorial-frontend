/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Portal } from "@ark-ui/react";
import { PencilFill, AddLine, DeleteBinLine } from "@ndla/icons";
import { DialogContent, DialogRoot, DialogTrigger, IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { LinkBlockEmbedData } from "@ndla/types-embed";
import { LinkBlock, LinkBlockSection } from "@ndla/ui";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import { SelectableEmbedWrapper } from "../../common/SelectableSlateEmbed";
import { useEditableElement } from "../../utils/useEditableElement";
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
  const { t } = useTranslation();
  const { isEditing, handleRemove, handleSave, handleEditingChange, onEditingExit } = useEditableElement(
    element,
    editor,
  );

  const onSave = useCallback(
    (embed: LinkBlockEmbedData, index?: number) => {
      const data =
        index !== undefined && element.data
          ? element.data.map((em, idx) => (index === idx ? embed : em))
          : (element.data ?? []).concat(embed);
      handleSave({ data });
    },
    [element.data, handleSave],
  );

  const onDelete = useCallback(
    (index: number) => {
      const newData = element.data?.filter((_, idx) => idx !== index);
      if (!newData?.length) {
        handleRemove();
      } else {
        handleSave({ data: newData });
      }
    },
    [element.data, handleRemove, handleSave],
  );

  // TODO: Rewrite this to only use one dialog once `onTriggerValueChange` lands in ark.

  return (
    <DialogRoot
      open={isEditing}
      onOpenChange={(details) => handleEditingChange(details.open)}
      onExitComplete={onEditingExit}
    >
      <SelectableEmbedWrapper {...attributes} contentEditable={false}>
        {children}
        <HeaderWrapper>
          <DialogTrigger asChild>
            <IconButton aria-label={t("linkBlock.create")} title={t("linkBlock.create")} size="small">
              <AddLine />
            </IconButton>
          </DialogTrigger>
          <Portal>
            <DialogContent>
              <LinkBlockForm onSave={(data) => onSave(data)} existingEmbeds={element.data ?? []} />
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
      </SelectableEmbedWrapper>
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
      <LinkBlock title={link.title} url={link.url} date={link.date} />
      <ButtonWrapper>
        <DialogTrigger asChild>
          <IconButton aria-label={t("linkBlock.edit")} title={t("linkBlock.edit")} size="small">
            <PencilFill />
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
    </DialogRoot>
  );
};

export default SlateLinkBlockList;
