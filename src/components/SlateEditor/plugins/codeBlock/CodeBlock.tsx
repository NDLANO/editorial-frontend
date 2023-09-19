import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-ini';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-lua';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-matlab';
import 'prismjs/components/prism-nsis';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-vhdl';
import 'prismjs/components/prism-bash';
import { useCallback, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { Editor, Path, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import he from 'he';
import { useTranslation } from 'react-i18next';
import { IconButtonV2 } from '@ndla/button';
import { DeleteForever } from '@ndla/icons/editor';
import { CodeBlockEditor, Codeblock } from '@ndla/code';
import { CodeEmbedData } from '@ndla/types-embed';

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from '@ndla/modal';
import { CodeBlockType } from '../../../../interfaces';
import { CodeblockElement } from '.';
import AlertModal from '../../../AlertModal';

const CodeDiv = styled.div`
  cursor: pointer;
`;

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
    <IconButtonV2
      variant="ghost"
      colorTheme="danger"
      aria-label={t('form.remove')}
      data-cy="remove-code"
      onClick={handleRemove}
    >
      <DeleteForever />
    </IconButtonV2>
  );
};
const highlightCode = (code: string, language: string): string => {
  const highlighted = highlight(code, languages[language], language);
  return highlighted;
};

const getInfoFromNode = (data: CodeEmbedData): CodeEmbedData => {
  return {
    resource: 'code-block',
    codeContent: he.decode(data.codeContent || '') as string,
    title: data.title || '',
    codeFormat: data.codeFormat || 'text',
  };
};

const CodeBlock = ({ attributes, editor, element, children }: Props) => {
  const embedData = useMemo(() => getInfoFromNode(element.data), [element.data]);
  const [editMode, setEditMode] = useState<boolean>(!embedData.codeContent && !embedData.title);
  const [showWarning, setShowWarning] = useState(false);
  const { t } = useTranslation();

  const highlightedCode = useMemo(() => {
    if (!embedData.codeFormat?.length || !embedData.codeContent?.length) {
      return embedData.codeContent;
    }
    return highlightCode(embedData.codeContent, embedData.codeFormat);
  }, [embedData.codeContent, embedData.codeFormat]);

  const handleSave = (codeBlock: CodeBlockType) => {
    const newData: CodeEmbedData = {
      resource: 'code-block',
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
    Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
  };

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setEditMode(true);
      } else if (!element.isFirstEdit && !showWarning) {
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
    [editor, element, showWarning],
  );

  return (
    <Modal open={editMode} onOpenChange={onOpenChange}>
      <ModalTrigger>
        <CodeDiv
          className="c-figure"
          aria-label={t('codeEditor.subtitle')}
          contentEditable={false}
          draggable={!editMode}
          role="button"
          {...attributes}
        >
          <Codeblock
            actionButton={<RemoveCodeBlock handleRemove={handleRemove} />}
            code={embedData.codeContent}
            format={embedData.codeFormat}
            title={embedData.title}
            highlightedCode={highlightedCode}
          />
          {children}
        </CodeDiv>
      </ModalTrigger>
      <ModalContent
        size={{ width: 'large', height: 'large' }}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <ModalHeader>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <CodeBlockEditor
            content={{
              code: embedData.codeContent,
              format: embedData.codeFormat,
              title: embedData.title || '',
            }}
            onSave={handleSave}
            highlight={highlightCode}
            onAbort={() => onOpenChange(false)}
          />
        </ModalBody>
      </ModalContent>

      <AlertModal
        title={t('unsavedChanges')}
        label={t('unsavedChanges')}
        show={showWarning}
        text={t('code.continue')}
        actions={[
          {
            text: t('form.abort'),
            onClick: () => setShowWarning(false),
          },
          {
            text: t('alertModal.continue'),
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
