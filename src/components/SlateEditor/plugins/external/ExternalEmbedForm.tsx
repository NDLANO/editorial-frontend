/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, useFormikContext } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { spacing, colors, shadows, misc, stackOrder } from "@ndla/core";
import { Cross } from "@ndla/icons/action";
import { Information } from "@ndla/icons/common";
import { CheckLine } from "@ndla/icons/editor";
import { ModalCloseButton } from "@ndla/modal";
import {
  Button,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
  FieldTextArea,
  IconButton,
  InputContainer,
} from "@ndla/primitives";
import { IframeEmbedData, OembedEmbedData } from "@ndla/types-embed";
import { DRAFT_ADMIN_SCOPE, EXTERNAL_WHITELIST_PROVIDERS } from "../../../../constants";
import InlineImageSearch from "../../../../containers/ConceptPage/components/InlineImageSearch";
import { useSession } from "../../../../containers/Session/SessionProvider";
import UrlAllowList from "../../../../containers/VisualElement/UrlAllowList";
import { urlTransformers } from "../../../../containers/VisualElement/urlTransformers";
import { WhitelistProvider } from "../../../../interfaces";
import { fetchExternalOembed } from "../../../../util/apiHelpers";
import { getIframeSrcFromHtmlString, urlDomain } from "../../../../util/htmlHelpers";
import { getStartTime, getStopTime, getYoutubeEmbedUrl, removeYoutubeTimeStamps } from "../../../../util/videoUtil";
import { FormField } from "../../../FormField";
import { FormikForm } from "../../../FormikForm";
import validateFormik, { RulesType } from "../../../formikValidationSchema";

const StyledCheckboxRoot = styled(CheckboxRoot)`
  width: fit-content;
`;

const ButtonContainer = styled.div`
  margin-top: ${spacing.small};
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const LinkInputWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  button {
    white-space: nowrap;
  }
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
  overflow: auto;
`;

const StyledPopoverContent = styled(PopoverContent)`
  background-color: ${colors.white};
  padding: ${spacing.small};
  border: 1px solid ${colors.brand.primary};
  border-radius: ${misc.borderRadius};
  box-shadow: ${shadows.levitate1};
  z-index: ${stackOrder.modal + stackOrder.popover};
  overflow: auto;
  max-height: 300px;
`;

const StyledPopoverArrow = styled(PopoverArrow)`
  fill: ${colors.brand.primary};
`;

const InfoButton = styled(PopoverTrigger)`
  all: unset;
  cursor: pointer;
  color: ${colors.brand.primary};
  svg {
    height: ${spacing.normal};
    width: ${spacing.normal};
  }
  &:hover,
  &:focus-within {
    color: ${colors.brand.tertiary};
  }
`;

const IframeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    width: 50%;
  }
`;

const TimeWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  div {
    width: 100%;
  }
`;

interface Props {
  initialData?: OembedEmbedData | IframeEmbedData;
  onSave: (data: OembedEmbedData | IframeEmbedData) => void;
}

interface ExternalFormValues {
  resource: "external" | "iframe";
  url: string;
  title?: string;
  validUrl: string;
  iframeUrl?: string;
  isFullscreen: boolean;
  isDecorative: boolean;
  metaImageAlt?: string;
  metaImageId?: string;
  caption: string;
  height: string;
  startTime?: string;
  stopTime?: string;
}

const getWhitelistedProvider = (url: string): WhitelistProvider | undefined => {
  const domain = urlDomain(url);
  return EXTERNAL_WHITELIST_PROVIDERS.find((provider) => provider.url.includes(domain));
};

const rules: RulesType<ExternalFormValues> = {
  resource: {
    required: true,
  },
  // This is just used to store valid URLs.
  validUrl: {
    required: true,
  },
  url: {
    required: true,
    url: true,
    onlyValidateIf: (values) => values.validUrl !== values.url,
    test: (values) => {
      const hasUrlTransform = urlTransformers.some((rule) => rule.shouldTransform(values.url, rule.domains));
      if (hasUrlTransform) {
        return;
      }
      const provider = getWhitelistedProvider(values.url);
      if (!provider) {
        return { translationKey: "form.content.link.unSupported" };
      }
    },
  },
};

const toInitialValues = (initialData?: OembedEmbedData | IframeEmbedData): ExternalFormValues => {
  let url = initialData?.url,
    startTime,
    stopTime;
  if (url?.includes("youtube")) {
    startTime = getStartTime(url);
    stopTime = getStopTime(url);
    url = removeYoutubeTimeStamps(url);
  }
  return {
    resource: initialData?.resource ?? "iframe",
    url: url ?? "",
    title: initialData?.title ?? "",
    validUrl: url ?? "",
    isFullscreen: initialData?.type === "fullscreen",
    isDecorative: initialData?.alt === "",
    metaImageAlt: initialData?.alt ?? "",
    metaImageId: initialData?.imageid ?? "",
    height: initialData?.height ?? "486px",
    caption: initialData?.caption ?? "",
    startTime: startTime ?? "",
    stopTime: stopTime ?? "",
  };
};

export const ExternalEmbedForm = ({ initialData, onSave }: Props) => {
  const { t } = useTranslation();

  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);

  const onSubmit = useCallback(
    (values: ExternalFormValues) => {
      const url = values.validUrl.includes("youtube")
        ? getYoutubeEmbedUrl(values.validUrl, values.startTime, values.stopTime)
        : values.validUrl;
      if (values.resource === "external") {
        onSave({
          resource: "external",
          url,
          type: values.isFullscreen ? "fullscreen" : "external",
          caption: values.caption,
          imageid: values.metaImageId,
          title: values.title,
          alt: values.isDecorative ? "" : values.metaImageAlt,
        });
      } else {
        onSave({
          resource: "iframe",
          url,
          type: values.isFullscreen ? "fullscreen" : "iframe",
          caption: values.caption,
          imageid: values.metaImageId,
          title: values.title,
          width: values.isFullscreen ? undefined : "708px",
          height: values.isFullscreen ? undefined : values.height,
          alt: values.isDecorative ? "" : values.metaImageAlt,
        });
      }
    },
    [onSave],
  );

  const onValidate = useCallback((values: ExternalFormValues) => validateFormik(values, rules, t), [t]);

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validate={onValidate}>
      <InnerForm />
    </Formik>
  );
};

const InnerForm = () => {
  const { t } = useTranslation();
  const { setFieldValue, setFieldError, setValues, values, dirty, errors, isValid } =
    useFormikContext<ExternalFormValues>();
  const { userPermissions } = useSession();

  const onInsertValidUrl = useCallback(
    async (urlParam: string) => {
      let url = urlParam;
      const rule = urlTransformers.find((rule) => rule.shouldTransform(url, rule.domains));
      if (rule) {
        try {
          url = await rule.transform(url);
        } catch (e) {
          setFieldError("url", t("form.content.link.unSupported"));
          return;
        }
      }
      try {
        const data = await fetchExternalOembed(url);
        const iframeUrl = getIframeSrcFromHtmlString(data.html) ?? "";

        setValues(
          (values) => ({
            ...values,
            validUrl: url,
            url,
            iframeUrl,
            resource: "external",
          }),
          true,
        );
      } catch (e) {
        const provider = getWhitelistedProvider(url);
        setValues(
          (values) => ({ ...values, height: provider?.height ?? "486px", resource: "iframe", validUrl: url, url }),
          true,
        );
      }
    },
    [setFieldError, setValues, t],
  );

  return (
    <FormikForm>
      <FormField name="url">
        {({ field, meta, helpers }) => (
          <FieldRoot required invalid={!!meta.error}>
            <LabelWrapper>
              <FieldLabel>{t("form.name.url")}</FieldLabel>
              <Popover>
                <InfoButton title={t("link.validDomains")} aria-label={t("form.content.link.validDomains")}>
                  <Information />
                </InfoButton>

                <StyledPopoverContent align="start">
                  <StyledPopoverArrow />
                  <UrlAllowList allowList={EXTERNAL_WHITELIST_PROVIDERS} />
                </StyledPopoverContent>
              </Popover>
            </LabelWrapper>
            <LinkInputWrapper data-has-link={!!field.value}>
              <InputContainer>
                <FieldInput {...field} />
                <IconButton
                  aria-label={t("form.content.link.remove")}
                  title={t("form.content.link.remove")}
                  variant="tertiary"
                  size="small"
                  disabled={!field.value}
                  onClick={() => {
                    helpers.setValue("", true);
                    setFieldValue("validUrl", "", true);
                  }}
                >
                  <Cross />
                </IconButton>
              </InputContainer>
              <Button
                variant="secondary"
                disabled={!!meta.error || field.value === values.validUrl}
                onClick={() => onInsertValidUrl(values.url)}
              >
                {!values.url ? t("form.content.link.insert") : t("form.content.link.update")}
              </Button>
            </LinkInputWrapper>
            {meta.initialValue !== field.value && <FieldErrorMessage>{meta.error}</FieldErrorMessage>}
          </FieldRoot>
        )}
      </FormField>
      {!errors.validUrl && !!values.validUrl.length && !values.isFullscreen && (
        <IframeWrapper>
          <iframe src={values.iframeUrl ?? values.validUrl} title={values.title} height="350px" frameBorder="0" />
        </IframeWrapper>
      )}
      {values.validUrl?.includes("youtube.com") && (
        <TimeWrapper>
          <FormField name="startTime">
            {({ field }) => (
              <FieldRoot>
                <FieldLabel>{t("form.video.time.start")}</FieldLabel>
                <FieldInput {...field} placeholder="h:m:s" />
              </FieldRoot>
            )}
          </FormField>
          <FormField name="stopTime">
            {({ field }) => (
              <FieldRoot>
                <FieldLabel>{t("form.video.time.stop")}</FieldLabel>
                <FieldInput {...field} placeholder="h:m:s" />
              </FieldRoot>
            )}
          </FormField>
        </TimeWrapper>
      )}
      {userPermissions?.includes(DRAFT_ADMIN_SCOPE) && (
        <FormField name="isFullscreen">
          {({ field, helpers }) => (
            <FieldRoot>
              <StyledCheckboxRoot
                checked={field.checked}
                onCheckedChange={(details) => helpers.setValue(details.checked, true)}
              >
                <CheckboxLabel>{t("form.content.link.fullscreen")}</CheckboxLabel>
                <CheckboxControl>
                  <CheckboxIndicator asChild>
                    <CheckLine />
                  </CheckboxIndicator>
                </CheckboxControl>
                <CheckboxHiddenInput />
              </StyledCheckboxRoot>
            </FieldRoot>
          )}
        </FormField>
      )}
      <FormField name="title">
        {({ field }) => (
          <FieldRoot>
            <FieldLabel>{t("form.name.title")}</FieldLabel>
            <FieldInput {...field} />
          </FieldRoot>
        )}
      </FormField>
      {values.isFullscreen && (
        <>
          <FormField name="caption">
            {({ field }) => (
              <FieldRoot>
                <FieldLabel>{t("form.name.description")}</FieldLabel>
                <FieldTextArea {...field} />
              </FieldRoot>
            )}
          </FormField>
          <InlineImageSearch name="metaImageId" disableAltEditing hideAltText />
          {values.metaImageId && (
            <>
              <FormField name="isDecorative">
                {({ field, helpers }) => (
                  <FieldRoot>
                    <StyledCheckboxRoot
                      checked={field.value}
                      onCheckedChange={(details) => helpers.setValue(details.checked, true)}
                    >
                      <CheckboxLabel>{t("form.image.isDecorative")}</CheckboxLabel>
                      <CheckboxControl>
                        <CheckboxIndicator asChild>
                          <CheckLine />
                        </CheckboxIndicator>
                      </CheckboxControl>
                      <CheckboxHiddenInput />
                    </StyledCheckboxRoot>
                  </FieldRoot>
                )}
              </FormField>
              <FormField name="metaImageAlt">
                {({ field }) =>
                  !values.isDecorative && (
                    <FieldRoot>
                      <FieldLabel>{t("form.name.alttext")}</FieldLabel>
                      <FieldInput {...field} />
                    </FieldRoot>
                  )
                }
              </FormField>
            </>
          )}
        </>
      )}
      <ButtonContainer>
        <ModalCloseButton>
          <Button variant="secondary">{t("cancel")}</Button>
        </ModalCloseButton>
        <Button type="submit" disabled={!dirty || !isValid}>
          {t("save")}
        </Button>
      </ButtonContainer>
    </FormikForm>
  );
};
