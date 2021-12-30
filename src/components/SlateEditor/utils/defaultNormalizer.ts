import { Editor, Element, NodeEntry, Path, Text, Transforms } from 'slate';
import { ElementType } from '../interfaces';
import { createNode } from './normalizationHelpers';

interface DefaultNodeRule {
  allowed: ElementType[];
  defaultType?: ElementType;
}

interface SiblingNodeRule {
  allowed: ElementType[];
  defaultType: ElementType;
}

interface ParentNodeRule {
  allowed: ElementType[];
  defaultType: ElementType;
}

export interface NormalizerConfig {
  parent?: ParentNodeRule;
  previous?: SiblingNodeRule;
  next?: SiblingNodeRule;
  firstNode?: DefaultNodeRule;
  lastNode?: DefaultNodeRule;
  nodes?: DefaultNodeRule;
}

const normalizeNodes = (editor: Editor, entry: NodeEntry, config: NormalizerConfig): boolean => {
  const [node, path] = entry;

  if (!Element.isElement(node)) return false;

  const { firstNode, lastNode, nodes } = config;

  const children = node.children;

  const getRule = (index: number) => {
    if (index === 0 && firstNode) return firstNode;
    if (index === children.length - 1 && lastNode) return lastNode;
    if (nodes) return nodes;
  };

  // 1. If node has defined rules for both first and last node, but only contains one node.
  if (node.children.length === 1 && firstNode && lastNode) {
    const child = node.children[0];
    const { allowed, defaultType } = lastNode;

    if (!Element.isElement(child) || !allowed.includes(child.type)) {
      if (defaultType) {
        Transforms.insertNodes(editor, createNode(defaultType), { at: [...path, 1] });
        return true;
      }
    }
  }

  // 2. Check each child node
  for (const [index, child] of children.entries()) {
    const rule = getRule(index);

    if (!rule) return false;

    const { allowed, defaultType } = rule;
    if (Text.isText(child)) {
      if (defaultType) {
        Transforms.wrapNodes(editor, createNode(defaultType), {
          at: [...path, index],
        });
        return true;
      } else {
        Transforms.removeNodes(editor, { at: [...path, index] });
        return true;
      }
    } else if (!allowed.includes(child.type)) {
      Transforms.unwrapNodes(editor, { at: [...path, index] });
      return true;
    }
  }

  return false;
};

const normalizePrevious = (
  editor: Editor,
  entry: NodeEntry,
  settings: SiblingNodeRule,
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
    Transforms.insertNodes(editor, createNode(defaultType), { at: previousPath });
    return true;
  }

  return false;
};

const normalizeNext = (editor: Editor, entry: NodeEntry, settings: SiblingNodeRule): boolean => {
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

const normalizeParent = (editor: Editor, entry: NodeEntry, settings: ParentNodeRule): boolean => {
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
