/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element, Path, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import onBackspace from "./handlers/onBackspace";
import onEnter from "./handlers/onEnter";
import onTab from "./handlers/onTab";
import { TYPE_DEFINITION_DESCRIPTION, TYPE_DEFINITION_LIST, TYPE_DEFINITION_TERM } from "./types";
import { createHtmlTag } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";
import { KEY_BACKSPACE, KEY_ENTER, KEY_TAB } from "../../utils/keys";

export interface DefinitionListElement {
  type: "definition-list";
  children: Descendant[];
}

export interface DefinitionTermElement {
  type: "definition-term";
  children: Descendant[];
}

export interface DefinitionDescriptionElement {
  type: "definition-description";
  children: Descendant[];
}

const normalizerDLConfig: NormalizerConfig = {
  nodes: {
    allowed: [TYPE_DEFINITION_TERM, TYPE_DEFINITION_DESCRIPTION],
    defaultType: TYPE_DEFINITION_TERM,
  },
};
const normalizerDTConfig: NormalizerConfig = {
  parent: {
    allowed: [TYPE_DEFINITION_LIST],
  },
};

const normalizerDDConfig: NormalizerConfig = {
  ...normalizerDTConfig,
  previous: {
    allowed: [TYPE_DEFINITION_TERM, TYPE_DEFINITION_DESCRIPTION],
    defaultType: TYPE_DEFINITION_TERM,
  },
};

export const definitionListSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === "dl") {
      return slatejsx("element", { type: TYPE_DEFINITION_LIST }, children);
    }
    if (tag === "dd") {
      return slatejsx("element", { type: TYPE_DEFINITION_DESCRIPTION }, children);
    }
    if (tag === "dt") {
      return slatejsx("element", { type: TYPE_DEFINITION_TERM }, children);
    }
  },
  serialize(node, children) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_DEFINITION_LIST) {
      return createHtmlTag({ tag: "dl", children });
    }
    if (node.type === TYPE_DEFINITION_TERM) {
      return createHtmlTag({ tag: "dt", children });
    }
    if (node.type === TYPE_DEFINITION_DESCRIPTION) {
      return createHtmlTag({ tag: "dd", children });
    }
  },
};

export const definitionListPlugin = (editor: Editor) => {
  const { normalizeNode: nextNormalizeNode, onKeyDown: nextOnKeyDown } = editor;

  editor.onKeyDown = (e: KeyboardEvent) => {
    if (e.key === KEY_ENTER) {
      onEnter(e, editor, nextOnKeyDown);
    } else if (e.key === KEY_BACKSPACE) {
      onBackspace(e, editor, nextOnKeyDown);
    } else if (e.key === KEY_TAB) {
      onTab(e, editor, nextOnKeyDown);
    } else if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
  };

  editor.normalizeNode = (entry) => {
    const [node, nodepath] = entry;

    if (Element.isElement(node) && node.type === TYPE_DEFINITION_LIST) {
      // Merge list with previous list if identical type
      if (Path.hasPrevious(nodepath)) {
        const previousPath = Path.previous(nodepath);
        if (Editor.hasPath(editor, previousPath)) {
          const [prevNode] = Editor.node(editor, previousPath);
          if (Element.isElement(prevNode) && prevNode.type === TYPE_DEFINITION_LIST) {
            return Transforms.mergeNodes(editor, {
              at: nodepath,
            });
          }
        }
      }

      if (defaultBlockNormalizer(editor, entry, normalizerDLConfig)) {
        return;
      }
    } else if (Element.isElement(node) && node.type === TYPE_DEFINITION_TERM) {
      if (defaultBlockNormalizer(editor, entry, normalizerDTConfig)) {
        return;
      }
    } else if (Element.isElement(node) && node.type === TYPE_DEFINITION_DESCRIPTION) {
      if (defaultBlockNormalizer(editor, entry, normalizerDDConfig)) {
        return;
      }
    }
    nextNormalizeNode(entry);
  };
  return editor;
};
