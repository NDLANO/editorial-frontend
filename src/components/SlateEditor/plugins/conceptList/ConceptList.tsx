/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms } from "slate";
import { RenderElementProps, ReactEditor, useSelected } from "slate-react";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { colors } from "@ndla/core";
import { Pencil } from "@ndla/icons/action";
import { DeleteForever } from "@ndla/icons/editor";
import { Modal, ModalContent, ModalTrigger } from "@ndla/modal";
import { ConceptListEmbedData, ConceptListMetaData } from "@ndla/types-embed";
import { ConceptListEmbed } from "@ndla/ui";
import { ConceptListElement } from ".";
import ConceptTagPicker from "./ConceptTagPicker";
import { useSearchConcepts } from "../../../../modules/concept/conceptQueries";
import { useConceptListMeta } from "../../../../modules/embed/queries";
import { maybeUndefinedFilterList } from "../../../../util/searchHelpers";
import { useArticleLanguage } from "../../ArticleLanguageProvider";

interface Props {
  element: ConceptListElement;
  editor: Editor;
  attributes: RenderElementProps["attributes"];
  children: ReactNode;
}

const StyledWrapper = styled.div`
  position: relative;
  &[data-selected="true"] {
    outline: 2px solid ${colors.brand.primary};
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  padding-left: 5px;
  transform: translateX(100%);
`;

const ConceptList = ({ element, editor, attributes, children }: Props) => {
  const [editMode, setEditMode] = useState<boolean>(!!element.isFirstEdit);
  const isSelected = useSelected();
  const { t } = useTranslation();
  const language = useArticleLanguage();

  const conceptsQuery = useSearchConcepts(
    {
      ...maybeUndefinedFilterList("subjects", [element.data.subjectId]),
      ...maybeUndefinedFilterList("tags", [element.data.tag]),
      language,
      pageSize: 200,
    },
    { enabled: !!element.data?.tag },
  );

  const conceptListQuery = useConceptListMeta(
    element.data.tag,
    element.data.subjectId,
    language,
    conceptsQuery.data?.results ?? [],
    { enabled: !!element.data.tag && !!conceptsQuery.data?.results.length },
  );

  const embed: ConceptListMetaData | undefined = useMemo(() => {
    if (!element.data || !conceptsQuery.data) return;
    return {
      resource: "concept-list",
      status: "success",
      embedData: element.data,
      data: conceptListQuery.data ?? {
        concepts: conceptsQuery.data.results.map((c) => ({ concept: c })),
      },
    };
  }, [conceptListQuery.data, conceptsQuery.data, element.data]);

  const onClose = () => {
    ReactEditor.focus(editor);
    if (element.isFirstEdit) {
      Transforms.removeNodes(editor, {
        at: [],
        match: (node) => element === node,
      });
    }
    setEditMode(false);
  };

  const onSave = (embed: ConceptListEmbedData) => {
    ReactEditor.focus(editor);
    Transforms.setNodes<ConceptListElement>(
      editor,
      { data: embed, isFirstEdit: false },
      { match: (node) => node === element, at: [] },
    );
    onClose();
  };

  const onRemoveClick = () => {
    Transforms.removeNodes(editor, {
      at: [],
      match: (node) => element === node,
    });
  };

  return (
    <Modal open={editMode} onOpenChange={setEditMode}>
      <StyledWrapper {...attributes} data-selected={isSelected} draggable>
        <div contentEditable={false}>
          <ButtonContainer>
            <IconButtonV2
              aria-label={t("form.conceptList.remove")}
              title={t("form.conceptList.remove")}
              variant="ghost"
              colorTheme="danger"
              onClick={onRemoveClick}
            >
              <DeleteForever />
            </IconButtonV2>
            <ModalTrigger>
              <IconButtonV2
                aria-label={t("form.conceptList.edit")}
                title={t("form.conceptList.edit")}
                variant="ghost"
                colorTheme="light"
              >
                <Pencil />
              </IconButtonV2>
            </ModalTrigger>
          </ButtonContainer>
          {embed && <ConceptListEmbed embed={embed} />}
        </div>
        {children}
      </StyledWrapper>
      <ModalContent size={{ height: "large", width: "large" }}>
        <ConceptTagPicker element={element} onClose={onClose} language={language} onSave={onSave} />
      </ModalContent>
    </Modal>
  );
};

export default ConceptList;
