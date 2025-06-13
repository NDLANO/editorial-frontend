/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Transforms } from "slate";
import { AddLine, CameraFill, CloseLine, H5P, LinkMedium, MovieLine, VoiceprintLine } from "@ndla/icons";
import { Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import SlateVisualElementPicker from "../../components/SlateEditor/plugins/blockPicker/SlateVisualElementPicker";
import { defaultExternalBlock } from "../../components/SlateEditor/plugins/external/utils";
import { defaultH5pBlock } from "../../components/SlateEditor/plugins/h5p/utils";
import { isEmpty } from "../../components/validators";

interface Props {
  editor: Editor;
  language: string;
  types?: VisualElementType[];
}

export type VisualElementType = "image" | "video" | "h5p" | "url" | "audio";

const ButtonWrapper = styled("div", {
  base: {
    display: "flex",
    marginBlockStart: "xsmall",
    flexDirection: "row",
    gap: "xsmall",
  },
});

const visualElementButtons = [
  {
    type: "image",
    component: <CameraFill />,
  },
  {
    type: "video",
    component: <MovieLine />,
  },
  {
    type: "h5p",
    component: <H5P />,
  },
  {
    type: "url",
    component: <LinkMedium />,
  },
  {
    type: "audio",
    component: <VoiceprintLine />,
  },
] as const;

const VisualElementPicker = ({ editor, language, types = ["image", "video", "h5p", "url"] }: Props) => {
  const { t } = useTranslation();
  const [selectedResource, setSelectedResource] = useState<string | undefined>(undefined);
  const [isOpen, setOpen] = useState(false);

  const handleSelect = (type: string) => {
    setOpen(false);
    onSelect(type);
  };

  const toggleIsOpen = () => {
    setOpen(!isOpen);
  };

  const filteredButtons = visualElementButtons.filter((button) => types.includes(button.type));
  const onInsertBlock = useCallback(
    (block: Element) => {
      Editor.withoutNormalizing(editor, () => {
        Transforms.insertNodes(editor, block);
      });
    },
    [editor],
  );

  const resetSelectedResource = () => {
    setSelectedResource(undefined);
  };

  const onSelect = (visualElement: string) => {
    if (visualElement === "h5p") {
      onInsertBlock(defaultH5pBlock());
      return;
    } else if (visualElement === "external" || visualElement === "url") {
      onInsertBlock(defaultExternalBlock());
      return;
    }
    setSelectedResource(visualElement);
  };

  if (!isEmpty(editor.children)) {
    return null;
  }

  return (
    <div contentEditable={false}>
      {!!selectedResource && (
        <SlateVisualElementPicker
          isOpen
          label={t(`form.visualElementPicker.${selectedResource}`)}
          articleLanguage={language}
          resource={selectedResource}
          onVisualElementClose={resetSelectedResource}
          onInsertBlock={onInsertBlock}
        />
      )}
      <ButtonWrapper>
        {filteredButtons.length > 1 && (
          <Button variant="secondary" onClick={toggleIsOpen}>
            {isOpen ? <CloseLine /> : <AddLine />}
          </Button>
        )}
        {!!(isOpen || filteredButtons.length <= 1) &&
          filteredButtons.map((button) => (
            <Button key={button.type} variant="secondary" onClick={() => handleSelect(button.type)}>
              {button.component}
            </Button>
          ))}
      </ButtonWrapper>
    </div>
  );
};

export default VisualElementPicker;
