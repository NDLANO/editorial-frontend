import { Editor, Element, NodeEntry, Path, Text, Transforms } from 'slate';

type ElementType = Element['type'];

interface DefaultNodeSettings {
  allowed: ElementType[];
  defaultElement?: () => Element;
}

interface SiblingNodeSettings {
  allowed: ElementType[];
  defaultElement: () => Element;
}

interface ParentNodeSettings {
  allowed: ElementType[];
  defaultElement: () => Element;
}

export interface NormalizerConfig {
  parent?: ParentNodeSettings;
  previous?: SiblingNodeSettings;
  next?: SiblingNodeSettings;
  firstNode?: DefaultNodeSettings;
  lastNode?: DefaultNodeSettings;
  nodes?: DefaultNodeSettings;
}

const normalizeChildren = (editor: Editor, entry: NodeEntry, config: NormalizerConfig): boolean => {
  const [node, path] = entry;

  if (!Element.isElement(node)) return false;

  const { firstNode, lastNode, nodes } = config;

  const children = node.children;

  const getRule = (index: number) => {
    if (index === 0 && firstNode) return firstNode;
    if (index === children.length - 1 && lastNode) return lastNode;
    if (nodes) return nodes;
  };

  for (const [index, child] of children.entries()) {
    const rule = getRule(index);
    if (!rule) return false;

    const { allowed, defaultElement } = rule;

    if (Text.isText(child)) {
      if (defaultElement) {
        Transforms.wrapNodes(editor, defaultElement(), {
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
  settings: SiblingNodeSettings,
): boolean => {
  const [, path] = entry;
  const { defaultElement, allowed } = settings;

  if (!Path.hasPrevious(path)) {
    Transforms.insertNodes(editor, defaultElement(), { at: path });
    return true;
  }

  const previousPath = Path.previous(path);

  const [previousNode] = Editor.node(editor, previousPath);
  if (!Element.isElement(previousNode) || !allowed.includes(previousNode.type)) {
    Transforms.insertNodes(editor, defaultElement(), { at: previousPath });
    return true;
  }

  return false;
};

const normalizeNext = (
  editor: Editor,
  entry: NodeEntry,
  settings: SiblingNodeSettings,
): boolean => {
  const [, path] = entry;

  const nextPath = Path.next(path);

  const { defaultElement, allowed } = settings;

  if (Editor.hasPath(editor, nextPath)) {
    const [nextNode] = Editor.node(editor, nextPath);
    if (!Element.isElement(nextNode) || !allowed.includes(nextNode.type)) {
      Transforms.insertNodes(editor, defaultElement());
      return true;
    }
  } else {
    Transforms.insertNodes(editor, defaultElement(), { at: nextPath });
    return true;
  }

  return false;
};

const normalizeParent = (
  editor: Editor,
  entry: NodeEntry,
  settings: ParentNodeSettings,
): boolean => {
  const [, path] = entry;
  const { defaultElement, allowed } = settings;

  const [parent] = Editor.node(editor, Path.parent(path));

  if (!Element.isElement(parent) || !allowed.includes(parent.type)) {
    Transforms.setNodes(editor, defaultElement(), { at: path });
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
    if (parent && normalizeParent(editor, entry, parent)) {
      return true;
    }
    if (normalizeChildren(editor, entry, config)) {
      return true;
    }
    if (previous && normalizePrevious(editor, entry, previous)) {
      return true;
    }
    if (next && normalizeNext(editor, entry, next)) {
      return true;
    }
  }

  return false;
};
