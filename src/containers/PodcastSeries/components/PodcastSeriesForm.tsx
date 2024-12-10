/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikProps, FormikHelpers, FormikErrors } from "formik";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Descendant } from "slate";
import { Button, PageContent, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { INewSeriesDTO, ISeriesDTO } from "@ndla/types-backend/audio-api";
import PodcastEpisodes from "./PodcastEpisodes";
import PodcastSeriesMetaData from "./PodcastSeriesMetaData";
import FormAccordion from "../../../components/Accordion/FormAccordion";
import FormAccordions from "../../../components/Accordion/FormAccordions";
import { FormActionsContainer } from "../../../components/FormikForm";
import validateFormik, { getWarnings, RulesType } from "../../../components/formikValidationSchema";
import FormWrapper from "../../../components/FormWrapper";
import HeaderWithLanguage from "../../../components/HeaderWithLanguage";
import SaveButton from "../../../components/SaveButton";
import {
  AUDIO_ADMIN_SCOPE,
  ITUNES_STANDARD_MAXIMUM_WIDTH,
  ITUNES_STANDARD_MINIMUM_WIDTH,
  SAVE_BUTTON_ID,
} from "../../../constants";
import { editorValueToPlainText } from "../../../util/articleContentConverter";
import { podcastSeriesTypeToFormType } from "../../../util/audioHelpers";
import { isFormikFormDirty } from "../../../util/formHelper";
import { AlertDialogWrapper } from "../../FormikForm";
import { useSession } from "../../Session/SessionProvider";

const StyledFormActionsContainer = styled(FormActionsContainer, {
  base: {
    marginBlockStart: "xsmall",
  },
});

const StyledText = styled(Text, {
  base: {
    textAlign: "end",
  },
});

const podcastRules: RulesType<PodcastSeriesFormikType, ISeriesDTO> = {
  title: {
    required: true,
    warnings: {
      languageMatch: true,
    },
  },
  description: {
    required: true,
    warnings: {
      languageMatch: true,
    },
  },
  coverPhotoId: {
    required: true,
  },
};

export interface PodcastSeriesFormikType {
  id?: number;
  revision?: number;
  title: Descendant[];
  description: Descendant[];
  language: string;
  coverPhotoId?: string;
  metaImageAlt?: string;
  episodes: number[];
  supportedLanguages: string[];
  hasRSS?: boolean;
}

interface Props {
  podcastSeries?: ISeriesDTO;
  language: string;
  inModal?: boolean;
  isNewlyCreated: boolean;
  formikProps?: FormikProps<PodcastSeriesFormikType>;
  onUpdate: (newPodcastSeries: INewSeriesDTO) => void;
  revision?: number;
  isNewLanguage?: boolean;
  supportedLanguages: string[];
}

const PodcastSeriesForm = ({
  podcastSeries,
  inModal,
  isNewlyCreated,
  onUpdate,
  language,
  isNewLanguage,
  supportedLanguages,
}: Props) => {
  const { t } = useTranslation();
  const [savedToServer, setSavedToServer] = useState(false);
  const { userPermissions } = useSession();
  const navigate = useNavigate();
  const size = useRef<[number, number] | undefined>(undefined);

  const isAudioAdmin = !!userPermissions?.includes(AUDIO_ADMIN_SCOPE);

  const handleSubmit = async (values: PodcastSeriesFormikType, actions: FormikHelpers<PodcastSeriesFormikType>) => {
    if (
      values.title === undefined ||
      values.language === undefined ||
      values.coverPhotoId === undefined ||
      values.metaImageAlt === undefined ||
      values.hasRSS === undefined
    ) {
      actions.setSubmitting(false);
      setSavedToServer(false);
      return;
    }

    actions.setSubmitting(true);
    const title: string = editorValueToPlainText(values.title);
    const description: string = editorValueToPlainText(values.description);
    const newPodcastSeries: INewSeriesDTO = {
      revision: values.revision,
      title,
      description,
      coverPhotoId: values.coverPhotoId,
      coverPhotoAltText: values.metaImageAlt,
      language: values.language,
      episodes: values.episodes,
      hasRSS: values.hasRSS,
    };

    await onUpdate(newPodcastSeries);
    setSavedToServer(true);
  };

  const validateMetaImage = ([width, height]: [number, number]): FormikErrors<PodcastSeriesFormikType> => {
    if (width !== height) {
      return { coverPhotoId: t("validation.podcastImageShape") };
    } else if (width < ITUNES_STANDARD_MINIMUM_WIDTH || width > ITUNES_STANDARD_MAXIMUM_WIDTH) {
      return { coverPhotoId: t("validation.podcastImageSize") };
    }
    return {};
  };

  const initialValues = podcastSeriesTypeToFormType(podcastSeries, language);
  const initialWarnings = getWarnings(initialValues, podcastRules, t, podcastSeries);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validateOnMount
      enableReinitialize
      validate={(values) => {
        const errors = validateFormik(values, podcastRules, t);
        const metaImageErrors = size.current ? validateMetaImage(size.current) : {};
        return { ...errors, ...metaImageErrors };
      }}
      initialStatus={{ warnings: initialWarnings }}
    >
      {(formikProps) => {
        const { values, dirty, isSubmitting, errors, submitForm, validateForm } = formikProps;
        const formIsDirty = isFormikFormDirty({
          values,
          initialValues,
          dirty,
          changed: isNewLanguage,
        });

        return (
          <FormWrapper inModal={inModal}>
            <HeaderWithLanguage
              id={podcastSeries?.id}
              language={language}
              noStatus
              supportedLanguages={supportedLanguages}
              type="podcast-series"
              title={podcastSeries?.title.title}
              hasRSS={podcastSeries?.hasRSS}
            />
            <FormAccordions defaultOpen={["podcast-series-podcastmeta"]}>
              <FormAccordion
                id="podcast-series-podcastmeta"
                title={t("form.podcastSeriesSection")}
                hasError={["title", "coverPhotoId", "metaImageAlt"].some((field) => field in errors)}
              >
                <PageContent variant="content">
                  <PodcastSeriesMetaData
                    language={language}
                    onImageLoad={(width, height) => {
                      size.current = [width, height];
                      validateForm();
                    }}
                  />
                </PageContent>
              </FormAccordion>
              <FormAccordion
                id="podcast-series-podcastepisodes"
                title={t("form.podcastEpisodesSection")}
                hasError={["title", "coverPhotoId", "metaImageAlt"].some((field) => field in errors)}
              >
                <PodcastEpisodes language={language} seriesId={values.id} initialEpisodes={podcastSeries?.episodes} />
              </FormAccordion>
            </FormAccordions>
            <StyledFormActionsContainer>
              <Button variant="secondary" disabled={isSubmitting} onClick={() => navigate(-1)}>
                {t("form.abort")}
              </Button>
              <SaveButton
                id={SAVE_BUTTON_ID}
                disabled={!isAudioAdmin}
                loading={isSubmitting}
                showSaved={!formIsDirty && (savedToServer || isNewlyCreated)}
                formIsDirty={formIsDirty}
                type={!inModal ? "submit" : "button"}
                onClick={(evt) => {
                  evt.preventDefault();
                  submitForm();
                }}
              />
            </StyledFormActionsContainer>
            {!isAudioAdmin ? <StyledText color="text.error">{t("podcastSeriesForm.adminError")}</StyledText> : null}
            <AlertDialogWrapper
              {...formikProps}
              formIsDirty={formIsDirty}
              severity="danger"
              text={t("alertModal.notSaved")}
            />
          </FormWrapper>
        );
      }}
    </Formik>
  );
};

export default PodcastSeriesForm;
