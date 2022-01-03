import { Editor, Element, NodeEntry, Node, Transforms, Text, Path } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { ElementType } from '../interfaces';
import { defaultParagraphBlock, TYPE_PARAGRAPH } from '../plugins/paragraph/utils';

export const firstTextBlockElement: Element['type'][] = ['paragraph', 'heading', 'quote'];

export const textBlockElements: Element['type'][] = [
  'paragraph',
  'heading',
  'list',
  'quote',
  'table',
  'embed',
  'file',
  'code-block',
];

export const lastTextBlockElement: Element['type'][] = ['paragraph'];

export const afterOrBeforeTextBlockElement: Element['type'][] = ['paragraph', 'heading'];

export const createNode = (type: ElementType, attributes?: Partial<Element>) =>
  slatejsx('element', { ...attributes, type });

export const addSurroundingParagraphs = (editor: Editor, path: Path) => {
  const nextPath = Path.next(path);

  if (Editor.hasPath(editor, nextPath)) {
    const [nextNode] = Editor.node(editor, nextPath);
    if (!Element.isElement(nextNode) || !afterOrBeforeTextBlockElement.includes(nextNode.type)) {
      Transforms.insertNodes(editor, defaultParagraphBlock(), {
        at: nextPath,
      });

      return true;
    }
  } else {
    Transforms.insertNodes(editor, defaultParagraphBlock(), {
      at: nextPath,
    });

    return true;
  }

  if (Path.hasPrevious(path)) {
    const previousPath = Path.previous(path);

    if (Editor.hasPath(editor, previousPath)) {
      const [previousNode] = Editor.node(editor, previousPath);
      if (
        !Element.isElement(previousNode) ||
        !afterOrBeforeTextBlockElement.includes(previousNode.type)
      ) {
        Transforms.insertNodes(editor, slatejsx('element', { type: TYPE_PARAGRAPH }), {
          at: path,
        });

        return true;
      }
    }
  }
};
