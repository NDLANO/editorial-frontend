/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor } from "slate";
import { RenderElementProps } from "slate-react";




export interface DefinitionListElement {
    type: 'definition-list';
    children: Descendant[];
}

export interface DefinitionTermElement {
    type: 'definition-term';
    children: Descendant[];
}

export interface DefinitionDescriptionElement {
    type: 'definition-description';
    children: Descendant[];
}




export const defintionListPlugin = (editor: Editor) => {
    const { renderElement } = editor;


    editor.renderElement = ({attributes, children, element}: RenderElementProps) => {

    }


} 
