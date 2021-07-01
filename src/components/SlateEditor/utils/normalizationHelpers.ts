import { Editor, Element, NodeEntry, Node, Transforms, Text, Path } from 'slate';
import { jsx } from 'slate-hyperscript';
import { TYPE_PARAGRAPH } from '../plugins/paragraph/utils';

export const firstTextBlockElement: Element['type'][] = ['paragraph', 'heading', 'quote'];

export const textBlockElements: Element['type'][] = [
  'paragraph',
  'heading',
  'list',
  'quote',
  //'table',
  //'embed',
  //'file',
  //'code-block',
];

export const lastTextBlockElement: Element['type'][] = ['paragraph'];

export const afterOrBeforeTextBlockElement: Element['type'][] = ['paragraph', 'heading'];

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

  const nextPath = Path.next(path);

  if (Editor.hasPath(editor, nextPath)) {
    const [nextNode] = Editor.node(editor, nextPath);
    if (!Element.isElement(nextNode) || !afterOrBeforeTextBlockElement.includes(nextNode.type)) {
      Transforms.insertNodes(editor, jsx('element', { type: TYPE_PARAGRAPH }), {
        at: nextPath,
      });

      return;
    }
  }

  if (Path.hasPrevious(path)) {
    const previousPath = Path.previous(path);

    if (Editor.hasPath(editor, previousPath)) {
      const [previousNode] = Editor.node(editor, previousPath);
      if (
        !Element.isElement(previousNode) ||
        !afterOrBeforeTextBlockElement.includes(previousNode.type)
      ) {
        Transforms.insertNodes(editor, jsx('element', { type: TYPE_PARAGRAPH }), {
          at: path,
        });
        return;
      }
    }
  }
  nextNormalizeNode(entry);
};

export const addSurroundingParagraphs = (editor: Editor, path: Path) => {
  const nextPath = Path.next(path);

  if (Editor.hasPath(editor, nextPath)) {
    const [nextNode] = Editor.node(editor, nextPath);
    if (!Element.isElement(nextNode) || !afterOrBeforeTextBlockElement.includes(nextNode.type)) {
      Transforms.insertNodes(editor, jsx('element', { type: TYPE_PARAGRAPH }), {
        at: nextPath,
      });

      return true;
    }
  }

  if (Path.hasPrevious(path)) {
    const previousPath = Path.previous(path);

    if (Editor.hasPath(editor, previousPath)) {
      const [previousNode] = Editor.node(editor, previousPath);
      if (
        !Element.isElement(previousNode) ||
        !afterOrBeforeTextBlockElement.includes(previousNode.type)
      ) {
        Transforms.insertNodes(editor, jsx('element', { type: TYPE_PARAGRAPH }), {
          at: path,
        });

        return true;
      }
    }
  }
};
