/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Button, Heading, PageContainer, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { NewImageMetaInformationV2DTO } from "@ndla/types-backend/image-api";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import validateFormik from "../../components/formikValidationSchema";
import { useLicenses } from "../../modules/draft/draftQueries";
import { BatchImageUploader } from "./components/batch/BatchImageUploader";
import { CommonImageInfoForm, toImageFormValues } from "./components/batch/CommonInfoForm";
import { ImageListItem } from "./components/batch/ImageListItem";
import { ImageFormikType, imageFormTypeToApiType, imageRules } from "./imageTransformers";

const StyledList = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledPageContainer = styled(PageContainer, {
  base: {
    gap: "medium",
  },
});

export const Component = () => {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [commonMetadata, setCommonMetadata] = useState<ImageFormikType | undefined>(undefined);
  const [specifiedMetadata, setSpecifiedMetadata] = useState<Record<string, ImageFormikType>>({});
  const [invalidFiles, setInvalidFiles] = useState<Record<string, string[]>>({});

  const { t } = useTranslation();

  const { data: licenses } = useLicenses({
    placeholderData: [],
    select: (data) => data.map((lic) => ({ ...lic, description: lic.description ?? "" })) ?? [],
  });

  const onSave = async () => {
    if (!commonMetadata) return;
    const formValues = acceptedFiles.map((f) =>
      toImageFormValues(commonMetadata, specifiedMetadata[f.name], f, commonMetadata.language),
    );

    const invalidValues = formValues.reduce<Record<string, string[]>>((acc, value) => {
      const errors = Object.values(validateFormik(value, imageRules, t));
      if (errors.length) {
        acc[(value.imageFile as File).name] = errors;
      }
      return acc;
    }, {});

    if (Object.keys(invalidValues).length) {
      setInvalidFiles(invalidValues);
      return;
    }

    const metadatas = formValues.reduce<NewImageMetaInformationV2DTO[]>((acc, value) => {
      const meta = imageFormTypeToApiType(value, licenses);
      if (meta) {
        acc.push(meta);
      }
      return acc;
    }, []);

    if (metadatas.length !== formValues.length) {
      console.log("something returned wrong");
      return;
    }

    const transformed = acceptedFiles.map((f) => {
      const stitched = { ...commonMetadata, ...(specifiedMetadata[f.name] ?? {}), imageFile: f };
      return imageFormTypeToApiType(stitched, licenses);
    });
    console.log("posting the following images", transformed);
  };

  return (
    <StyledPageContainer>
      <title>{t("htmlTitles.batchUploadImagePage")}</title>
      <Heading textStyle="title.large">{t("batchUploadImagePage.heading")}</Heading>
      <Text>{t("batchUploadImagePage.description")}</Text>
      <Heading asChild consumeCss textStyle="title.medium">
        <h2>{t("batchUploadImagePage.commonMetaHeading")}</h2>
      </Heading>
      <Text>{t("batchUploadImagePage.commonMetaHeadingDescription")}</Text>
      <CommonImageInfoForm handleSubmit={setCommonMetadata} />
      {!!commonMetadata && (
        <>
          <Heading asChild consumeCss textStyle="title.medium">
            <h2>{t("batchUploadImagePage.uploadImages")}</h2>
          </Heading>
          <BatchImageUploader acceptedFiles={acceptedFiles} onFileAccept={setAcceptedFiles} />
          <Heading asChild consumeCss textStyle="title.medium">
            <h2>{t("batchUploadImagePage.uploadedImages")}</h2>
          </Heading>
          <Text>{t("batchUploadImagePage.specificImageDescription")}</Text>
          <StyledList>
            {acceptedFiles.map((file) => (
              <ImageListItem
                key={file.name}
                file={file}
                commonData={commonMetadata}
                initialValues={specifiedMetadata[file.name]}
                handleSubmit={(values) => {
                  setInvalidFiles((prev) => {
                    delete prev[file.name];
                    return prev;
                  });
                  setSpecifiedMetadata((prev) => ({ ...prev, [file.name]: values }));
                }}
                invalid={!!invalidFiles[file.name]}
              />
            ))}
          </StyledList>
          {!!Object.keys(invalidFiles).length && (
            <Text color="text.error">{t("batchUploadImagePage.hasImagesWithErrors")}</Text>
          )}
          <Button onClick={onSave} disabled={!!Object.keys(invalidFiles).length}>
            {t("batchUploadImagePage.createImages")}
          </Button>
        </>
      )}
    </StyledPageContainer>
  );
};
