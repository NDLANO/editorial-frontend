/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import he from "he";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-php";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-c";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-diff";
import "prismjs/components/prism-ini";
import "prismjs/components/prism-json";
import "prismjs/components/prism-java";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-lua";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-matlab";
import "prismjs/components/prism-nsis";
import "prismjs/components/prism-python";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-powershell";
import "prismjs/components/prism-vhdl";
import "prismjs/components/prism-bash";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { Code, DeleteForever } from "@ndla/icons/editor";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { Figure, IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { CodeEmbedData } from "@ndla/types-embed";

import { CodeBlock as UICodeBlock } from "@ndla/ui";
import { CodeblockElement } from ".";
import CodeBlockEditor from "./CodeBlockEditor";
import { CodeBlockType } from "../../../../interfaces";
import AlertModal from "../../../AlertModal";

const StyledFigure = styled(Figure, {
  base: {
    cursor: "pointer",
  },
});

const TitleWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    justifyContent: "space-between",
  },
});

interface Props extends RenderElementProps {
  element: CodeblockElement;
  editor: Editor;
}

interface RemoveCodeBlockProps {
  handleRemove: () => void;
}

const RemoveCodeBlock = ({ handleRemove }: RemoveCodeBlockProps) => {
  const { t } = useTranslation();
  return (
    <IconButton
      variant="danger"
      size="small"
      aria-label={t("form.remove")}
      data-testid="remove-code"
      onClick={handleRemove}
    >
      <DeleteForever />
    </IconButton>
  );
};
const highlightCode = (code: string, language: string): string => {
  const highlighted = highlight(code, languages[language], language);
  return highlighted;
};

const getInfoFromNode = (data: CodeEmbedData): CodeEmbedData => {
  return {
    resource: "code-block",
    codeContent: he.decode(data.codeContent || "") as string,
    title: data.title || "",
    codeFormat: data.codeFormat || "text",
  };
};

const CodeBlock = ({ attributes, editor, element, children }: Props) => {
  const embedData = useMemo(() => getInfoFromNode(element.data), [element.data]);
  const [editMode, setEditMode] = useState<boolean>(!embedData.codeContent && !embedData.title);
  const [showWarning, setShowWarning] = useState(false);
  const [shouldShowWarning, setShouldShowWarning] = useState(false);
  const { t } = useTranslation();

  const highlightedCode = useMemo(() => {
    if (!embedData.codeFormat?.length || !embedData.codeContent?.length) {
      return embedData.codeContent;
    }
    return highlightCode(embedData.codeContent, embedData.codeFormat);
  }, [embedData.codeContent, embedData.codeFormat]);

  const handleSave = (codeBlock: CodeBlockType) => {
    const newData: CodeEmbedData = {
      resource: "code-block",
      codeFormat: codeBlock.format,
      title: codeBlock.title,
      codeContent: he.encode(codeBlock.code),
    };
    const properties = {
      data: newData,
      isFirstEdit: false,
    };
    ReactEditor.focus(editor);
    setEditMode(false);
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, properties, { at: path });
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
  };

  const handleRemove = () => {
    Transforms.removeNodes(editor, {
      at: ReactEditor.findPath(editor, element),
      voids: true,
    });
  };

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setEditMode(true);
      } else if (shouldShowWarning) {
        setShowWarning(true);
      } else {
        ReactEditor.focus(editor);
        setEditMode(false);
        if (element.isFirstEdit) {
          Transforms.unwrapNodes(editor, {
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
    [editor, element, shouldShowWarning],
  );

  return (
    <Modal open={editMode} onOpenChange={onOpenChange}>
      <ModalTrigger>
        <StyledFigure
          aria-label={t("codeEditor.subtitle")}
          contentEditable={false}
          draggable={!editMode}
          role="button"
          {...attributes}
        >
          <TitleWrapper>
            {embedData.title && <h3>{embedData.title}</h3>}
            <RemoveCodeBlock handleRemove={handleRemove} />
          </TitleWrapper>
          <UICodeBlock format={embedData.codeFormat} highlightedCode={highlightedCode} />
          {children}
        </StyledFigure>
      </ModalTrigger>
      <ModalContent size={{ width: "large", height: "large" }} onCloseAutoFocus={(e) => e.preventDefault()}>
        <ModalHeader>
          <ModalTitle>
            {t("codeEditor.title")} <Code />
          </ModalTitle>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <CodeBlockEditor
            content={{
              code: embedData.codeContent,
              format: embedData.codeFormat,
              title: embedData.title || "",
            }}
            onSave={handleSave}
            highlight={highlightCode}
            onAbort={() => onOpenChange(false)}
            setShowWarning={setShouldShowWarning}
          />
        </ModalBody>
      </ModalContent>

      <AlertModal
        title={t("unsavedChanges")}
        label={t("unsavedChanges")}
        show={showWarning}
        text={t("code.continue")}
        actions={[
          {
            text: t("form.abort"),
            onClick: () => setShowWarning(false),
          },
          {
            text: t("alertModal.continue"),
            onClick: () => {
              setShowWarning(false);
              setEditMode(false);
            },
          },
        ]}
        onCancel={() => setShowWarning(false)}
      />
    </Modal>
  );
};

export default CodeBlock;
