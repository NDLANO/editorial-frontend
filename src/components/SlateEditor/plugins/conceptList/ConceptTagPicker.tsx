/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { InputV3 } from "@ndla/forms";
import { Spinner } from "@ndla/icons";
import { ModalBody, ModalCloseButton, ModalHeader } from "@ndla/modal";
import { ConceptListEmbedData } from "@ndla/types-embed";
import { Node } from "@ndla/types-taxonomy";
import { Figure, BlockConcept } from "@ndla/ui";
import { ConceptListElement } from ".";
import { fetchAllSubjects, fetchAllTags } from "../../../../modules/concept/conceptApi";
import { useSearchConcepts } from "../../../../modules/concept/conceptQueries";
import { fetchNode } from "../../../../modules/nodes/nodeApi";
import Dropdown, { DropdownItem } from "../../../Dropdown/Dropdown";

const TwoColumn = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${spacing.small};
  align-items: flex-start;
`;

const FormInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  flex: 1;
`;

const StyledList = styled.ul`
  display: block;
  list-style: none;
`;

interface Props {
  element: ConceptListElement;
  onSave: (embed: ConceptListEmbedData) => void;
  language: string;
}

const ConceptTagPicker = ({ element, language, onSave: onSaveProp }: Props) => {
  const { t } = useTranslation();
  const [selectedTag, setSelectedTag] = useState<DropdownItem | undefined>(
    element.data.tag ? { name: element.data.tag, id: element.data.tag } : undefined,
  );
  const [selectedSubject, setSelectedSubject] = useState<DropdownItem | undefined>(
    element.data.subjectId ? { name: element.data.subjectId, id: element.data.subjectId } : undefined,
  );
  const [titleInput, setTitleInput] = useState(element.data.title || "");
  const [tags, setTags] = useState<DropdownItem[]>([]);
  const [subjects, setSubjects] = useState<DropdownItem[]>([]);

  const conceptSearchQuery = useSearchConcepts(
    {
      ...(selectedSubject?.id ? { subjects: [selectedSubject.id] } : {}),
      ...(selectedTag?.id ? { tags: [selectedTag.id] } : {}),
      language,
      pageSize: 200,
    },
    { enabled: !!selectedTag?.id },
  );

  const onChangeTitleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTitleInput(e.target.value);
  };

  const onSave = () => {
    onSaveProp({
      resource: "concept-list",
      tag: selectedTag?.id ?? "",
      title: titleInput,
      subjectId: selectedSubject?.id ?? "",
    });
  };

  useEffect(() => {
    const initialize = async () => {
      // If subjectId exists, fetch subject name and set selected subject
      if (element.data.subjectId) {
        fetchNode({
          id: element.data.subjectId,
          language,
          taxonomyVersion: "default",
        })
          .then((subject) => {
            setSelectedSubject({ name: subject.name, id: subject.id });
          })
          .catch(() => {
            setSelectedSubject({
              id: element.data.subjectId || "",
              name: t("form.content.conceptList.subjectMissing", {
                subjectId: element.data.subjectId,
              }),
            });
          });
      }

      fetchAllTags(language).then((tags) => {
        const items = tags.map((tag) => ({ name: tag, id: tag })).sort((a, b) => a.name.localeCompare(b.name));
        setTags(items);
      });

      const subjectIds: string[] = await fetchAllSubjects();
      const subjectResults = await Promise.allSettled(
        subjectIds.map((id) => fetchNode({ id, language, taxonomyVersion: "default" })),
      );
      const subjects = (
        subjectResults.filter((result) => result.status === "fulfilled") as Array<PromiseFulfilledResult<Node>>
      ).map((res) => {
        const subject = res.value;
        return { name: subject.name, id: subject.id };
      });
      setSubjects(subjects);
    };

    initialize();
  }, [language, setTags, element.data.subjectId, t]);

  return (
    <div>
      <ModalHeader>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <TwoColumn>
          <FormInput>
            <InputV3 value={titleInput} onChange={onChangeTitleInput} placeholder={t("form.name.title")} />
            <Dropdown
              items={tags}
              onSelect={setSelectedTag}
              onReset={() => setSelectedTag(undefined)}
              selectedTag={selectedTag}
              placeholder={t("form.categories.label")}
            />
            <Dropdown
              items={subjects}
              onSelect={setSelectedSubject}
              onReset={() => setSelectedSubject(undefined)}
              selectedTag={selectedSubject}
              placeholder={t("form.name.subjects")}
            />
            {conceptSearchQuery.isLoading ? (
              <Spinner />
            ) : conceptSearchQuery.data?.results.length ? (
              <div>
                <p>{`${t("searchPage.totalCount")}: ${conceptSearchQuery.data.totalCount}`}</p>
                <Figure type="full">
                  <StyledList>
                    {conceptSearchQuery.data.results?.map((concept) => (
                      <li key={concept.id}>
                        <BlockConcept
                          title={concept.title}
                          content={concept.content.content}
                          metaImage={concept.metaImage}
                          copyright={concept.copyright}
                          source={concept.source}
                          conceptType={concept.conceptType}
                        />
                      </li>
                    ))}
                  </StyledList>
                </Figure>
              </div>
            ) : (
              <p>{t("conceptSearch.noResults")}</p>
            )}
          </FormInput>
          <ButtonV2 onClick={onSave} disabled={!selectedTag || conceptSearchQuery.isLoading}>
            {t("form.save")}
          </ButtonV2>
        </TwoColumn>
      </ModalBody>
    </div>
  );
};

export default ConceptTagPicker;
