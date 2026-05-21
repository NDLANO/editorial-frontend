/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Heading, PageContainer, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { BulkUploadStartedDTO, BulkUploadStateDTO, NewImageMetaInformationV2DTO } from "@ndla/types-backend/image-api";
import { uniqBy } from "@ndla/util";
import { useQuery } from "@tanstack/react-query";
import { TFunction } from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormActionsContainer } from "../../components/FormikForm";
import validateFormik from "../../components/formikValidationSchema";
import SaveButton from "../../components/SaveButton";
import { IMAGE_BULK_SCOPE } from "../../constants";
import { licenseQuery } from "../../modules/draft/draftQueries";
import { bulkUploadImages } from "../../modules/image/imageApi";
import NotFound from "../NotFoundPage/NotFoundPage";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { useSession } from "../Session/SessionProvider";
import { BulkImageUploader } from "./components/bulk/BulkImageUploader";
import { CommonImageInfoForm, toImageFormValues } from "./components/bulk/CommonInfoForm";
import { ImageListItem } from "./components/bulk/ImageListItem";
import { ImageFormikType, imageFormTypeToApiType, imageRules } from "./imageTransformers";
import { useImageUploadStatus } from "./useImageUploadStatus";

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
  return <PrivateRoute component={<BulkUploadImagePage />} />;
};

const getInvalidFiles = (
  commonMetadata: ImageFormikType,
  specifiedMetadata: Record<string, ImageFormikType>,
  acceptedFiles: File[],
  t: TFunction,
) => {
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
  return invalidValues;
};

export const BulkUploadImagePage = () => {
  const [bulkUploadId, setBulkUploadId] = useState<BulkUploadStartedDTO | undefined>(undefined);
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [commonMetadata, setCommonMetadata] = useState<ImageFormikType | undefined>(undefined);
  const [specifiedMetadata, setSpecifiedMetadata] = useState<Record<string, ImageFormikType>>({});
  const [invalidFiles, setInvalidFiles] = useState<Record<string, string[]>>({});
  const [hasImageWithErrors, setHasImageWithErrors] = useState(false);
  const uploadState = useImageUploadStatus(bulkUploadId?.uploadId);

  const { userPermissions } = useSession();

  const { t } = useTranslation();

  const { data: licenses } = useQuery({
    ...licenseQuery(),
    placeholderData: [],
    select: (data) => data.map((lic) => ({ ...lic, description: lic.description ?? "" })) ?? [],
  });

  const onAcceptFiles = (files: File[]) => {
    setAcceptedFiles((prev) => uniqBy([...prev, ...files], (file) => file.name));
  };

  const onRemoveFile = (file: File) => {
    setAcceptedFiles((prev) => prev.filter((f) => f.name !== file.name));
  };

  const onSetCommonMetadata = (values: ImageFormikType) => {
    setCommonMetadata(values);
    if (acceptedFiles.length) {
      setInvalidFiles(getInvalidFiles(values, specifiedMetadata, acceptedFiles, t));
    }
  };

  const onSave = async () => {
    if (!commonMetadata || uploadState?.status === "Complete") return;
    setBulkUploadId(undefined);
    setHasImageWithErrors(false);
    const formValues = acceptedFiles.map((f) =>
      toImageFormValues(commonMetadata, specifiedMetadata[f.name], f, commonMetadata.language),
    );

    const invalidValues = getInvalidFiles(commonMetadata, specifiedMetadata, acceptedFiles, t);

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
      return [imageFormTypeToApiType(stitched, licenses), f];
    });

    const res = await bulkUploadImages(metadatas, acceptedFiles);
    setBulkUploadId(res);

    return transformed;
  };

  if (!userPermissions?.includes(IMAGE_BULK_SCOPE)) {
    return <NotFound />;
  }

  return (
    <StyledPageContainer>
      <title>{t("htmlTitles.bulkUploadImagePage")}</title>
      <Heading textStyle="title.large">{t("bulkUploadImagePage.heading")}</Heading>
      <Text>{t("bulkUploadImagePage.description")}</Text>
      <Heading asChild consumeCss textStyle="title.medium">
        <h2>{t("bulkUploadImagePage.commonMetaHeading")}</h2>
      </Heading>
      <Text>{t("bulkUploadImagePage.commonMetaHeadingDescription")}</Text>
      <CommonImageInfoForm handleSubmit={onSetCommonMetadata} />
      {!!commonMetadata && (
        <>
          <Heading asChild consumeCss textStyle="title.medium">
            <h2>{t("bulkUploadImagePage.uploadImages")}</h2>
          </Heading>
          <BulkImageUploader acceptedFiles={acceptedFiles} onFileAccept={onAcceptFiles} />
          <Heading asChild consumeCss textStyle="title.medium">
            <h2>{t("bulkUploadImagePage.uploadedImages")}</h2>
          </Heading>
          <Text>{t("bulkUploadImagePage.specificImageDescription")}</Text>
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
              <Text color="text.error">{t("bulkUploadImagePage.hasImagesWithErrors")}</Text>
            ))}
          <FormActionsContainer>
            <SaveButton
              onClick={onSave}
              showSaved={uploadState?.status === "Complete"}
              loading={!!uploadState && uploadState.status !== "Complete"}
              disabled={!!Object.keys(invalidFiles).length}
            >
              {t("bulkUploadImagePage.createImages")}
            </SaveButton>
          </FormActionsContainer>
          {!!uploadState && !!bulkUploadId && <BulkUploadState state={uploadState} />}
        </>
      )}
    </StyledPageContainer>
  );
};

interface BulkUploadStateProps {
  state: BulkUploadStateDTO;
}

const TextContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
  },
});

const BulkUploadState = ({ state }: BulkUploadStateProps) => {
  const { t } = useTranslation();

  if (state.status === "Pending" || state.status === "Running") {
    return (
      <TextContainer>
        <Text>{t("bulkUploadImagePage.uploadInProgress")}</Text>
        <Text>{t("bulkUploadImagePage.progressText", { completed: state.completed, total: state.total })}</Text>
        {!!state.failed && <Text>{t("bulkUploadImagePage.progressFailed", { failed: state.failed })}</Text>}
      </TextContainer>
    );
  }

  if (state.status === "Failed") {
    return (
      <TextContainer>
        <Text color="text.error">
          {t("bulkUploadImagePage.uploadFailed", {
            completed: state.completed,
            total: state.total,
            failed: state.failed,
          })}
        </Text>
      </TextContainer>
    );
  } else if (state.status === "Complete" && state.failed) {
    return <Text>{t("bulkUploadImagePage.uploadCompletedWithFailed", { failed: state.failed })}</Text>;
  } else if (state.status === "Complete") {
    return <Text>{t("bulkUploadImagePage.uploadCompleted", { total: state.completed })}</Text>;
  }
};
