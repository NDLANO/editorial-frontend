/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik } from "formik";
import { TFunction } from "i18next";
import sortBy from "lodash/sortBy";
import uniq from "lodash/uniq";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import { createListCollection } from "@ark-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
  SelectContent,
  SelectLabel,
  SelectPositioner,
  SelectRoot,
  SelectValueText,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IUpdatedArticle } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import PlannedResourceSelect from "./PlannedResourceSelect";
import { GenericSelectItem, GenericSelectTrigger } from "../../../components/abstractions/Select";
import { FormField } from "../../../components/FormField";
import { FormActionsContainer, FormikForm } from "../../../components/FormikForm";
import validateFormik, { RulesType } from "../../../components/formikValidationSchema";
import { TYPE_DIV } from "../../../components/SlateEditor/plugins/div/types";
import { TYPE_PARAGRAPH } from "../../../components/SlateEditor/plugins/paragraph/types";
import {
  DRAFT_RESPONSIBLE,
  LAST_UPDATED_SIZE,
  RESOURCE_FILTER_CORE,
  RESOURCE_FILTER_SUPPLEMENTARY,
} from "../../../constants";
import { Auth0UserData } from "../../../interfaces";
import { useAuth0Responsibles } from "../../../modules/auth0/auth0Queries";
import { createDraft, updateUserData } from "../../../modules/draft/draftApi";
import { useUserData } from "../../../modules/draft/draftQueries";
import { RESOURCE_NODE, TOPIC_NODE } from "../../../modules/nodes/nodeApiTypes";
import {
  useAddNodeMutation,
  useCreateResourceResourceTypeMutation,
  usePostResourceForNodeMutation,
} from "../../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../../modules/nodes/nodeQueries";
import { getRootIdForNode } from "../../../modules/nodes/nodeUtil";
import { useAllResourceTypes } from "../../../modules/taxonomy/resourcetypes/resourceTypesQueries";
import { inlineContentToHTML } from "../../../util/articleContentConverter";
import { convertUpdateToNewDraft } from "../../../util/articleUtil";
import { getCommentInfoText } from "../../ArticlePage/components/InputComment";
import { useSession } from "../../Session/SessionProvider";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

interface PlannedResourceFormikType {
  title: string;
  comments: string;
  contentType: string;
  responsible: string;
  articleType: string;
  relevance: string;
  priority: string;
}

const StyledFormikForm = styled(FormikForm, {
  base: {
    width: "100%",
  },
});

const StyledGenericSelectTrigger = styled(GenericSelectTrigger, {
  base: {
    width: "100%",
  },
});

const plannedResourceRules: RulesType<PlannedResourceFormikType> = {
  title: {
    required: true,
  },
  comments: { required: false },
  contentType: {
    required: true,
    onlyValidateIf: (values: PlannedResourceFormikType) => values.articleType !== "topic-article",
  },
  responsible: { required: true },
  relevance: { required: true },
  priority: { required: false },
};

const toInitialValues = (responsible?: string, articleType?: string): PlannedResourceFormikType => {
  return {
    title: "",
    comments: "",
    contentType: "",
    responsible: responsible ?? "",
    articleType: articleType ?? "standard",
    relevance: RESOURCE_FILTER_CORE,
    priority: "unspecified",
  };
};

const formatUserList = (users: Auth0UserData[]) =>
  users.map((u) => ({
    value: `${u.app_metadata.ndla_id}`,
    label: u.name,
  }));

const getSlateComment = (userName: string | undefined, t: TFunction, formikComment: string): Descendant[] => {
  if (!formikComment) return [];
  const infoText = getCommentInfoText(userName, t);
  const slateComment: Descendant[] = [
    {
      type: TYPE_DIV,
      children: [
        { type: TYPE_PARAGRAPH, children: [{ text: formikComment }] },
        { type: TYPE_PARAGRAPH, children: [{ text: infoText }] },
      ],
    },
  ];
  return slateComment;
};

interface Props {
  articleType: string;
  node: Node | undefined;
  onClose: () => void;
}

const PlannedResourceForm = ({ articleType, node, onClose }: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const { data: userData } = useUserData();

  const { t, i18n } = useTranslation();
  const { ndlaId, userName } = useSession();
  const { mutateAsync: addNodeMutation, isPending: addNodeMutationLoading } = useAddNodeMutation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const qc = useQueryClient();
  const nodeId = useMemo(() => node && getRootIdForNode(node), [node]);
  const compKey = nodeQueryKeys.resources({
    id: node?.id,
    language: i18n.language,
  });
  const compKeyChildNodes = nodeQueryKeys.childNodes({
    taxonomyVersion,
    id: nodeId,
    language: i18n.language,
  });
  const { mutateAsync: createNodeResource, isPending: postResourceLoading } = usePostResourceForNodeMutation({
    onSuccess: (_) => {
      qc.invalidateQueries({ queryKey: compKey });
      qc.invalidateQueries({ queryKey: compKeyChildNodes });
    },
  });
  const { mutateAsync: createResourceResourceType, isPending: createResourceTypeLoading } =
    useCreateResourceResourceTypeMutation({
      onSuccess: (_) => qc.invalidateQueries({ queryKey: compKey }),
    });
  const initialValues = useMemo(() => toInitialValues(ndlaId, articleType), [ndlaId, articleType]);
  const isTopicArticle = articleType === "topic-article";

  const { data: users } = useAuth0Responsibles(
    { permission: DRAFT_RESPONSIBLE },
    {
      select: (users) => sortBy(formatUserList(users), (u) => u.label),
      placeholderData: [],
    },
  );

  const { data: contentTypes } = useAllResourceTypes(
    { language: i18n.language, taxonomyVersion },
    {
      select: (res) =>
        res
          .flatMap(
            (parent) =>
              parent.subtypes?.map((s) => ({
                label: `${parent.name} - ${s.name}`,
                value: `${s.id},${parent.id}`,
              })) ?? [],
          )
          .filter((r) => !!r),
      placeholderData: [],
      enabled: !isTopicArticle,
    },
  );
  const onSubmit = useCallback(
    async (values: PlannedResourceFormikType) => {
      try {
        setError(undefined);
        const slateComment = getSlateComment(userName, t, values.comments);
        const plannedResource: IUpdatedArticle = {
          title: values.title,
          comments: slateComment.length ? [{ content: inlineContentToHTML(slateComment), isOpen: true }] : [],
          language: i18n.language,
          articleType: values.articleType,
          responsibleId: values.responsible,
          revision: 0,
          priority: values.priority,
          metaImage: undefined,
        };
        const createdArticle = await createDraft(convertUpdateToNewDraft(plannedResource));

        // Add created article to latest edited
        const latestEdited = uniq([createdArticle.id.toString()].concat(userData?.latestEditedArticles ?? []));
        await updateUserData({ latestEditedArticles: latestEdited.slice(0, LAST_UPDATED_SIZE) });

        // Create node in taxonomy
        const resourceUrl = await addNodeMutation({
          body: {
            name: values.title,
            contentUri: `urn:article:${createdArticle.id}`,
            nodeType: isTopicArticle ? TOPIC_NODE : RESOURCE_NODE,
            root: false,
            ...(isTopicArticle ? { visible: false } : {}),
          },
          taxonomyVersion,
        });

        // Position node in taxonomy
        const resourceId = resourceUrl.replace("/v1/nodes/", "");
        await createNodeResource({
          body: {
            resourceId: resourceId,
            nodeId: node?.id ?? "",
            relevanceId: values.relevance,
          },
          taxonomyVersion,
        });

        if (!isTopicArticle) {
          const [childContentType, parentContentType] = values.contentType.split(",");
          await createResourceResourceType({
            body: {
              resourceId: resourceId,
              resourceTypeId: childContentType,
            },
            taxonomyVersion,
          });

          if (parentContentType) {
            await createResourceResourceType({
              body: {
                resourceId: resourceId,
                resourceTypeId: parentContentType,
              },
              taxonomyVersion,
            });
          }
        }
        if (!(addNodeMutationLoading || postResourceLoading || createResourceTypeLoading)) {
          onClose();
        }
      } catch (e) {
        setError("taxonomy.errorMessage");
      }
    },
    [
      userName,
      t,
      i18n.language,
      userData?.latestEditedArticles,
      addNodeMutation,
      isTopicArticle,
      taxonomyVersion,
      createNodeResource,
      node?.id,
      addNodeMutationLoading,
      postResourceLoading,
      createResourceTypeLoading,
      createResourceResourceType,
      onClose,
    ],
  );

  const priorityCollection = useMemo(() => {
    return createListCollection({
      items: [
        { label: t("editorFooter.prioritized"), value: "prioritized" },
        { label: t("welcomePage.workList.onHold"), value: "on-hold" },
      ],
      itemToString: (item) => item.label,
      itemToValue: (item) => item.value,
    });
  }, [t]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={(values) => validateFormik(values, plannedResourceRules, t)}
      validateOnMount
    >
      {({ dirty, isValid }) => (
        <StyledFormikForm id="planned-resource-form">
          <FormField name="title">
            {({ field, meta }) => (
              <FieldRoot required invalid={!!meta.error}>
                <FieldLabel>{t("taxonomy.title")}</FieldLabel>
                <FieldInput placeholder={t("taxonomy.title")} {...field} />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FieldRoot>
            )}
          </FormField>
          <FormField name="comments">
            {({ field, meta }) => (
              <FieldRoot invalid={!!meta.error}>
                <FieldLabel>{t("taxonomy.comment")}</FieldLabel>
                <FieldInput placeholder={t("taxonomy.commentPlaceholder")} {...field} />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FieldRoot>
            )}
          </FormField>
          {!isTopicArticle && (
            <PlannedResourceSelect
              label="taxonomy.contentType"
              fieldName="contentType"
              placeholder="taxonomy.contentTypePlaceholder"
              options={contentTypes?.length ? contentTypes : []}
            />
          )}
          <PlannedResourceSelect
            label="form.responsible.label"
            fieldName="responsible"
            placeholder="form.responsible.label"
            options={users ?? []}
            defaultValue={ndlaId && userName ? { value: ndlaId, label: userName } : undefined}
          />
          <FormField name="priority">
            {({ field, helpers, meta }) => (
              <FieldRoot invalid={!!meta.error}>
                <SelectRoot
                  collection={priorityCollection}
                  value={["prioritized", "on-hold"].includes(field.value) ? [field.value] : undefined}
                  onValueChange={(details) => helpers.setValue(details.value[0])}
                  positioning={{ sameWidth: true }}
                >
                  <SelectLabel>{t("taxonomy.addPriority")}</SelectLabel>
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                  <StyledGenericSelectTrigger clearable>
                    <SelectValueText placeholder={t("editorFooter.placeholderPrioritized")} />
                  </StyledGenericSelectTrigger>
                  <SelectPositioner>
                    <SelectContent>
                      {priorityCollection.items.map((item) => (
                        <GenericSelectItem key={item.value} item={item}>
                          {item.label}
                        </GenericSelectItem>
                      ))}
                    </SelectContent>
                  </SelectPositioner>
                </SelectRoot>
              </FieldRoot>
            )}
          </FormField>
          <FormField name="relevance">
            {({ field, meta, helpers }) => (
              <FieldRoot invalid={!!meta.error}>
                <SwitchRoot
                  checked={field.value === RESOURCE_FILTER_CORE}
                  onCheckedChange={(details) => {
                    helpers.setValue(details.checked ? RESOURCE_FILTER_CORE : RESOURCE_FILTER_SUPPLEMENTARY);
                  }}
                >
                  <SwitchControl>
                    <SwitchThumb>{field.value === RESOURCE_FILTER_CORE ? "K" : "T"}</SwitchThumb>
                  </SwitchControl>
                  <SwitchLabel>{t("taxonomy.resourceType")}</SwitchLabel>
                  <SwitchHiddenInput />
                </SwitchRoot>
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FieldRoot>
            )}
          </FormField>
          <FormActionsContainer>
            <Button
              disabled={!dirty || !isValid}
              type="submit"
              loading={addNodeMutationLoading || postResourceLoading || createResourceTypeLoading}
            >
              {t("taxonomy.create")}
            </Button>
          </FormActionsContainer>
          {error && <Text color="text.error">{t(error)}</Text>}
        </StyledFormikForm>
      )}
    </Formik>
  );
};

export default PlannedResourceForm;
