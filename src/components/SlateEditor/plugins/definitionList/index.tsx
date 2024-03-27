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
import { SlateSerializer } from "../../interfaces";
import { NormalizerConfig } from "../../utils/defaultNormalizer";
import { KEY_BACKSPACE, KEY_ENTER, KEY_TAB } from "../../utils/keys";
import { createPlugin } from "../PluginFactory";

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
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_DEFINITION_LIST) {
      return <dl>{children}</dl>;
    }
    if (node.type === TYPE_DEFINITION_TERM) {
      return <dt>{children}</dt>;
    }
    if (node.type === TYPE_DEFINITION_DESCRIPTION) {
      return <dd>{children}</dd>;
    }
  },
};

export const definitionListPlugin = createPlugin<DefinitionListElement["type"]>({
  type: TYPE_DEFINITION_LIST,
  normalizerConfig: normalizerDLConfig,
  normalize: [
    {
      description: "Merge definition lists if they are next to each other",
      normalize: ([_node, path], editor) => {
        if (Path.hasPrevious(path)) {
          const previousPath = Path.previous(path);
          if (Editor.hasPath(editor, previousPath)) {
            const [prevNode] = Editor.node(editor, previousPath);
            if (Element.isElement(prevNode) && prevNode.type === TYPE_DEFINITION_LIST) {
              Transforms.mergeNodes(editor, {
                at: path,
              });
              return true;
            }
          }
        }
        return false;
      },
    },
  ],
  childPlugins: [
    {
      type: TYPE_DEFINITION_TERM,
      normalizerConfig: normalizerDTConfig,
      onKeyDown: {
        [KEY_ENTER]: onEnter,
        [KEY_TAB]: onTab,
        [KEY_BACKSPACE]: onBackspace,
      },
    },
    {
      type: TYPE_DEFINITION_DESCRIPTION,
      normalizerConfig: normalizerDDConfig,
      onKeyDown: {
        [KEY_ENTER]: onEnter,
        [KEY_TAB]: onTab,
        [KEY_BACKSPACE]: onBackspace,
      },
    },
  ],
});
