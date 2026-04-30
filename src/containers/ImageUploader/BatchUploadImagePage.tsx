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
import { uniqBy } from "@ndla/util";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormActionsContainer } from "../../components/FormikForm";
import validateFormik from "../../components/formikValidationSchema";
import { IMAGE_BATCH_SCOPE } from "../../constants";
import { useLicenses } from "../../modules/draft/draftQueries";
import NotFound from "../NotFoundPage/NotFoundPage";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { useSession } from "../Session/SessionProvider";
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
  return <PrivateRoute component={<BatchUploadImagePage />} />;
};

export const BatchUploadImagePage = () => {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [commonMetadata, setCommonMetadata] = useState<ImageFormikType | undefined>(undefined);
  const [specifiedMetadata, setSpecifiedMetadata] = useState<Record<string, ImageFormikType>>({});
  const [invalidFiles, setInvalidFiles] = useState<Record<string, string[]>>({});
  const [hasImageWithErrors, setHasImageWithErrors] = useState(false);

  const { userPermissions } = useSession();

  const { t } = useTranslation();

  const { data: licenses } = useLicenses({
    placeholderData: [],
    select: (data) => data.map((lic) => ({ ...lic, description: lic.description ?? "" })) ?? [],
  });

  const onAcceptFiles = (files: File[]) => {
    setAcceptedFiles((prev) => uniqBy([...prev, ...files], (file) => file.name));
  };

  const onRemoveFile = (file: File) => {
    setAcceptedFiles((prev) => prev.filter((f) => f.name !== file.name));
  };

  const onSave = async () => {
    if (!commonMetadata) return;
    setHasImageWithErrors(false);
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
      setHasImageWithErrors(true);
      return;
    }

    const transformed = acceptedFiles.map((f) => {
      const stitched = { ...commonMetadata, ...(specifiedMetadata[f.name] ?? {}), imageFile: f };
      return imageFormTypeToApiType(stitched, licenses);
    });

    // TODO: Implement
    return transformed;
  };

  if (!userPermissions?.includes(IMAGE_BATCH_SCOPE)) {
    return <NotFound />;
  }

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
          <BatchImageUploader acceptedFiles={acceptedFiles} onFileAccept={onAcceptFiles} />
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
                onRemoveFile={onRemoveFile}
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
          {hasImageWithErrors ||
            (!!Object.keys(invalidFiles).length && (
              <Text color="text.error">{t("batchUploadImagePage.hasImagesWithErrors")}</Text>
            ))}
          <FormActionsContainer>
            <Button onClick={onSave} disabled={!!Object.keys(invalidFiles).length}>
              {t("batchUploadImagePage.createImages")}
            </Button>
          </FormActionsContainer>
        </>
      )}
    </StyledPageContainer>
  );
};
