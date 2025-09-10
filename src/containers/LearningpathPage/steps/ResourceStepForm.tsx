/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ContentEditableFieldLabel } from "@ndla/editor-components";
import { DeleteBinLine, ExternalLinkLine } from "@ndla/icons";
import { ComboboxLabel, FieldErrorMessage, FieldHelper, FieldRoot, IconButton, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ILearningStepV2DTO } from "@ndla/types-backend/learningpath-api";
import { ContentTypeBadge } from "@ndla/ui";
import { contentTypeMapping, ResourcePicker } from "./ResourcePicker";
import { ResourceData, ResourceFormValues } from "./types";
import { FormField } from "../../../components/FormField";
import { RulesType } from "../../../components/formikValidationSchema";
import { fetchNode, fetchNodes } from "../../../modules/nodes/nodeApi";
import { getContentTypeFromResourceTypes } from "../../../util/resourceHelpers";
import { toEditArticle } from "../../../util/routeHelpers";
import { LicenseField } from "../../FormikForm";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import { LearningpathTextEditor } from "../components/LearningpathTextEditor";
import { getFormTypeFromStep, getNodeIdFromEmbedUrl } from "../learningpathUtils";

interface Props {
  onlyPublishedResources: boolean;
  step: ILearningStepV2DTO | undefined;
  language: string;
}

const ResourceContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4xsmall",
    flex: "1",
  },
});

const ResourceWrapper = styled("div", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    borderBottom: "1px solid",
    borderColor: "stroke.default",
    padding: "xsmall",
    gap: "medium",
    justifyContent: "space-between",
    boxShadow: "xsmall",
    backgroundColor: "background.default",
    position: "relative",
  },
});

const StyledHStack = styled(HStack, {
  base: {
    flexWrap: "wrap",
  },
});

const CrumbText = styled(Text, {
  base: {
    overflowWrap: "anywhere",
  },
});

const StyledIconButton = styled(IconButton, {
  base: {
    position: "relative",
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    display: "inline",
    color: "text.default",
    textDecoration: "underline",
    _hover: {
      textDecoration: "none",
    },
    _focusVisible: {
      textDecoration: "none",
    },
  },
});

export const resourceStepRules: RulesType<ResourceFormValues> = {};

export const ResourceStepForm = ({ onlyPublishedResources, language, step }: Props) => {
  const { t } = useTranslation();
  const [selectedResource, setSelectedResource] = useState<ResourceData | undefined>(undefined);
  const [focusId, setFocusId] = useState<string | undefined>(undefined);
  const { taxonomyVersion } = useTaxonomyVersion();
  const { values, setFieldValue } = useFormikContext<ResourceFormValues>();

  useEffect(() => {
    (async () => {
      if (values.embedUrl && !selectedResource) {
        const nodeId = getNodeIdFromEmbedUrl(values.embedUrl);
        if (!nodeId) return;
        const node = await fetchNode({ id: `urn:${nodeId}`, language: language, taxonomyVersion });
        const articleId = parseInt(node.contentUri?.split(":")?.pop() ?? "");
        const articleType = getContentTypeFromResourceTypes(node.resourceTypes);
        if (!articleId) return;
        setSelectedResource({
          articleId,
          title: node.name,
          articleType: articleType,
          breadcrumbs: node.breadcrumbs,
          resourceTypes: node.resourceTypes,
        });
      } else if (values.articleId && !selectedResource) {
        const nodes = await fetchNodes({ contentURI: `urn:article:${values.articleId}`, language, taxonomyVersion });
        const node = nodes[0];
        if (node) {
          const articleType = getContentTypeFromResourceTypes(node.resourceTypes);
          setSelectedResource({
            articleId: values.articleId,
            articleType: articleType,
            title: node.name,
            breadcrumbs: node.breadcrumbs,
            resourceTypes: node.resourceTypes,
          });
        }
      }
    })();
  }, [language, selectedResource, taxonomyVersion, values.articleId, values.embedUrl]);

  const contentType = selectedResource?.resourceTypes?.map((type) => contentTypeMapping[type.id]).filter(Boolean)[0];

  const onSelectResource = (resource: ResourceData) => {
    setSelectedResource(resource);
    setFieldValue("articleId", resource.articleId, true);
    setFieldValue("title", resource.title, true);
    setFocusId("remove-resource");
  };

  const onRemove = () => {
    setSelectedResource(undefined);
    setFieldValue("embedUrl", null, true);
    setFieldValue("articleId", null, true);
    setFieldValue("title", null, true);
    setFocusId("resource-input");
  };

  useEffect(() => {
    if (focusId) {
      document.getElementById(focusId)?.focus();
      setFocusId(undefined);
    }
  }, [focusId]);

  return (
    <>
      {!!step?.description?.description.length && getFormTypeFromStep(step) === "resource" && (
        <FormField name="description">
          {({ field, meta, helpers }) => (
            <FieldRoot invalid={!!meta.error}>
              <ContentEditableFieldLabel>
                {t("learningpathForm.steps.resourceForm.descriptionLabel")}
              </ContentEditableFieldLabel>
              <FieldHelper>{t("learningpathForm.steps.resourceForm.descriptionHelper")}</FieldHelper>
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              <LearningpathTextEditor value={field.value} onChange={helpers.setValue} language={language} />
            </FieldRoot>
          )}
        </FormField>
      )}
      {!selectedResource ? (
        <FieldRoot>
          <ResourcePicker onlyPublishedResources={onlyPublishedResources} setResource={onSelectResource}>
            <ComboboxLabel fontWeight="bold">{t("learningpathForm.steps.resourceForm.label")}</ComboboxLabel>
            <FieldHelper>{t("learningpathForm.steps.resourceForm.labelHelper")}</FieldHelper>
          </ResourcePicker>
        </FieldRoot>
      ) : (
        <ResourceContainer>
          <Text textStyle="label.medium" fontWeight="bold">
            {t("learningpathForm.steps.resourceForm.label")}
          </Text>
          <Text textStyle="label.small">{t("learningpathForm.steps.resourceForm.labelHelper")}</Text>

          <ResourceWrapper>
            <TextWrapper>
              <StyledSafeLink
                to={toEditArticle(selectedResource.articleId, selectedResource.articleType, language)}
                target="_blank"
                css={linkOverlay.raw()}
              >
                <Text fontWeight="bold">
                  {selectedResource.title}
                  <ExternalLinkLine size="small" />
                </Text>
              </StyledSafeLink>
              {!!selectedResource.breadcrumbs && (
                <CrumbText
                  textStyle="label.small"
                  color="text.subtle"
                  css={{ textAlign: "start" }}
                  aria-label={`${t("breadcrumb.breadcrumb")}: ${selectedResource.breadcrumbs.join(", ")}`}
                >
                  {selectedResource.breadcrumbs.join(" > ")}
                </CrumbText>
              )}
            </TextWrapper>
            <StyledHStack gap="medium">
              {!!contentType && <ContentTypeBadge contentType={contentType} />}
              <StyledIconButton
                id="remove-resource"
                aria-label={t("myNdla.learningpath.form.delete")}
                title={t("myNdla.learningpath.form.delete")}
                variant="tertiary"
                onClick={onRemove}
              >
                <DeleteBinLine />
              </StyledIconButton>
            </StyledHStack>
          </ResourceWrapper>
        </ResourceContainer>
      )}
      {!!step?.license?.license.length && <LicenseField />}
    </>
  );
};
