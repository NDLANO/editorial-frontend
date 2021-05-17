import { Editor, Element, NodeEntry, Node, Transforms, Text } from 'slate';
import { jsx } from 'slate-hyperscript';
import { TYPE_PARAGRAPH } from '../plugins/paragraph';

export const firstTextBlockElement: Element['type'][] = ['paragraph', 'heading'];

export const textBlockElements: Element['type'][] = [
  'paragraph',
  'heading',
  //'bulleted-list',
  //'letter-list',
  //'numbered-list',
  'quote',
  //'table',
  //'embed',
  //'file',
  //'code-block',
];

export const lastTextBlockElement: Element['type'][] = ['paragraph'];

export const afterTextBlockElement: Element['type'][] = ['paragraph', 'heading'];

export const defaultTextBlockNormalizer = (
  editor: Editor,
  entry: NodeEntry<Node>,
  nextNormalizeNode: (entry: NodeEntry<Node>) => void,
) => {
  const [node, path] = entry;
  if (!Element.isElement(node)) return;

  if (node.children.length === 0) {
    Transforms.insertNodes(editor, jsx('element', { type: TYPE_PARAGRAPH }, [{ text: '' }]), {
      at: [...path, 0],
    });
    return;
  }

  const firstChild = node.children[0];
  if (Element.isElement(firstChild)) {
    if (!firstTextBlockElement.includes(firstChild.type)) {
      Transforms.insertNodes(editor, jsx('element', { type: TYPE_PARAGRAPH }, [{ text: '' }]), {
        at: [...path, 0],
      });
      return;
    }
  }

  const lastChild = node.children[node.children.length - 1];
  if (Element.isElement(lastChild)) {
    if (!lastTextBlockElement.includes(lastChild.type)) {
      Transforms.insertNodes(editor, jsx('element', { type: TYPE_PARAGRAPH }, [{ text: '' }]), {
        at: [...path, node.children.length],
      });
      return;
    }
  }

  for (const [child, childPath] of Node.children(editor, path)) {
    if (Text.isText(child)) {
      Transforms.wrapNodes(editor, jsx('element', { type: TYPE_PARAGRAPH }), {
        at: childPath,
      });
      return;
    }
    if (Element.isElement(child) && !textBlockElements.includes(child.type)) {
      Transforms.unwrapNodes(editor, {
        at: childPath,
      });
      return;
    }
  }

  const next = Editor.next(editor, { at: path });
  if (next) {
    const [nextNode, nextPath] = next;
    if (!Element.isElement(nextNode) || !afterTextBlockElement.includes(nextNode.type)) {
      Transforms.wrapNodes(editor, jsx('element', { type: TYPE_PARAGRAPH }), {
        at: nextPath,
      });
      return;
    }
  }
  nextNormalizeNode(entry);
};
