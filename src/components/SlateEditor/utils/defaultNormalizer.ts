import { Editor, Element, NodeEntry, Path, Text, Transforms } from 'slate';
import { ElementType } from '../interfaces';
import { createNode } from './normalizationHelpers';

interface DefaultNodeRule {
  allowed: ElementType[];
  defaultType: ElementType;
}

export interface NormalizerConfig {
  parent?: DefaultNodeRule;
  previous?: DefaultNodeRule;
  next?: DefaultNodeRule;
  firstNode?: DefaultNodeRule;
  lastNode?: DefaultNodeRule;
  nodes?: DefaultNodeRule;
}

const normalizeNodes = (editor: Editor, entry: NodeEntry, config: NormalizerConfig): boolean => {
  const [node, path] = entry;

  if (!Element.isElement(node)) return false;

  const { firstNode, lastNode, nodes } = config;

  const children = node.children;

  for (const [index, child] of children.entries()) {
    // 1. If first node
    if (index === 0 && firstNode) {
      // a. Wrap text as default firstNode type
      if (Text.isText(child)) {
        Transforms.wrapNodes(editor, createNode(firstNode.defaultType), {
          at: [...path, 0],
        });
        return true;
        // first node is wrong and must be changed
      } else if (!firstNode.allowed.includes(child.type)) {
        // b. If child is also an allowed lastNode. Insert default firstNode type before
        if (children.length === 1 && lastNode && lastNode.allowed.includes(child.type)) {
          Transforms.insertNodes(editor, createNode(firstNode.defaultType), {
            at: [...path, 0],
          });
          return true;
        }
        // c. If child is allowed nodes type. Insert default firstNode type before.
        else if (nodes && nodes.allowed.includes(child.type)) {
          Transforms.insertNodes(editor, createNode(firstNode.defaultType), {
            at: [...path, 0],
          });
          return true;
          // d. Else: Unwrap child
        } else {
          Transforms.unwrapNodes(editor, { at: [...path, 0] });
          return true;
        }
      }
    }

    // 2. If last node
    if (index === children.length - 1 && lastNode) {
      // a. Wrap text as default firstNode type
      if (Text.isText(child)) {
        Transforms.wrapNodes(editor, createNode(lastNode.defaultType), {
          at: [...path, children.length - 1],
        });
        return true;
        // last node is wrong and must be changed
      } else if (!lastNode.allowed.includes(child.type)) {
        // b. If child is allowed firstNode type. Insert default firstNode type after
        if (children.length === 1 && firstNode && firstNode.allowed.includes(child.type)) {
          Transforms.insertNodes(editor, createNode(lastNode.defaultType), {
            at: [...path, children.length],
          });
          return true;
        }
        // c. If child is allowed nodes type. Insert default lastNode type after.
        else if (nodes && nodes.allowed.includes(child.type)) {
          Transforms.insertNodes(editor, createNode(lastNode.defaultType), {
            at: [...path, children.length],
          });
          return true;
          // c. Else: Unwrap child
        } else {
          Transforms.unwrapNodes(editor, {
            at: [...path, children.length - 1],
          });
          return true;
        }
      }
    }

    // 3. If node is valid first or last node, skip next step
    if (
      Element.isElement(child) &&
      ((index === 0 && firstNode && firstNode.allowed.includes(child.type)) ||
        (index === children.length - 1 && lastNode && lastNode.allowed.includes(child.type)))
    ) {
      continue;
    }

    // 4. Other nodes
    if (nodes) {
      // a. Wrap if text
      if (Text.isText(child)) {
        Transforms.wrapNodes(editor, createNode(nodes.defaultType), { at: [...path, index] });
        return true;
        // b. Unwrap if incorrect
      } else if (!nodes.allowed.includes(child.type)) {
        Transforms.unwrapNodes(editor, { at: [...path, index] });
        return true;
      }
    }
  }

  if (children.length === 0) {
    const rule = firstNode || lastNode || nodes;
    if (rule?.defaultType) {
      Transforms.insertNodes(editor, createNode(rule.defaultType), { at: [...path, 0] });
      return true;
    }
  }

  return false;
};

const normalizePrevious = (
  editor: Editor,
  entry: NodeEntry,
  settings: DefaultNodeRule,
): boolean => {
  const [, path] = entry;
  const { defaultType, allowed } = settings;

  // 1. If previous element does not exist, insert default element
  if (!Path.hasPrevious(path)) {
    Transforms.insertNodes(editor, createNode(defaultType), { at: path });
    return true;
  }

  const previousPath = Path.previous(path);

  const [previousNode] = Editor.node(editor, previousPath);

  // 2. If previous element is incorrect, insert default element
  if (!Element.isElement(previousNode) || !allowed.includes(previousNode.type)) {
    Transforms.insertNodes(editor, createNode(defaultType), { at: path });
    return true;
  }

  return false;
};

const normalizeNext = (editor: Editor, entry: NodeEntry, settings: DefaultNodeRule): boolean => {
  const [, path] = entry;
  const nextPath = Path.next(path);
  const { defaultType, allowed } = settings;

  // 1. If next element is incorrect, insert default element
  if (Editor.hasPath(editor, nextPath)) {
    const [nextNode] = Editor.node(editor, nextPath);
    if (!Element.isElement(nextNode) || !allowed.includes(nextNode.type)) {
      Transforms.insertNodes(editor, createNode(defaultType), { at: nextPath });
      return true;
    }
    // 2. If next element does not exist, insert default element
  } else {
    Transforms.insertNodes(editor, createNode(defaultType), { at: nextPath });
    return true;
  }

  return false;
};

const normalizeParent = (editor: Editor, entry: NodeEntry, settings: DefaultNodeRule): boolean => {
  const [, path] = entry;
  const { defaultType, allowed } = settings;

  const [parent] = Editor.node(editor, Path.parent(path));

  // 1. If parent element is incorrect, change current node to default element
  if (!Element.isElement(parent) || !allowed.includes(parent.type)) {
    Transforms.setNodes(editor, createNode(defaultType), { at: path });
    return true;
  }

  return false;
};

export const defaultBlockNormalizer = (
  editor: Editor,
  entry: NodeEntry,
  config: NormalizerConfig,
): boolean => {
  const [node] = entry;

  if (!Element.isElement(node)) return false;

  const { previous, next, firstNode, lastNode, nodes, parent } = config;

  if (firstNode || nodes || lastNode) {
    if (normalizeNodes(editor, entry, config)) {
      return true;
    }
  }
  if (parent && normalizeParent(editor, entry, parent)) {
    return true;
  }
  if (previous && normalizePrevious(editor, entry, previous)) {
    return true;
  }
  if (next && normalizeNext(editor, entry, next)) {
    return true;
  }

  return false;
};
