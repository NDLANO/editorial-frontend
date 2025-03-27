/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FieldsetLegend, FieldsetRoot } from "@ndla/primitives";
import { IImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import { ImagePicker } from "../../../components/ImagePicker";
import { LocaleType } from "../../../interfaces";
import { fetchImage } from "../../../modules/image/imageApi";
import MetaImageField from "../../FormikForm/components/MetaImageField";

interface FormValues {
  metaImageId?: string;
}

interface Props {
  name: string;
  disableAltEditing?: boolean;
  hideAltText?: boolean;
  values: FormValues;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
}

const InlineImageSearch = ({ name, disableAltEditing, hideAltText, setFieldValue, values, setFieldTouched }: Props) => {
  const { t, i18n } = useTranslation();
  const [image, setImage] = useState<IImageMetaInformationV3DTO | undefined>();
  const locale: LocaleType = i18n.language;
  const fetchImageWithLocale = (id: number) => fetchImage(id, locale);

  useEffect(() => {
    (async () => {
      if (values.metaImageId) {
        const image = await fetchImageWithLocale(parseInt(values.metaImageId));
        setImage(image);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (image) {
    return (
      <MetaImageField
        disableAltEditing={disableAltEditing}
        hideAltText={hideAltText}
        image={image}
        onImageRemove={() => {
          setFieldValue(name, undefined);
          setFieldValue("metaImageAlt", undefined, true);
          setImage(undefined);
        }}
        showRemoveButton
      />
    );
  }
  return (
    <FieldsetRoot>
      <FieldsetLegend textStyle="label.medium">{t("form.metaImage.title")}</FieldsetLegend>
      <ImagePicker
        onImageSelect={(image) => {
          setFieldValue(name, image.id);
          setFieldValue("metaImageAlt", image.alttext.alttext.trim(), true);
          setImage(image);
          setTimeout(() => {
            setFieldTouched("metaImageAlt", true, true);
            setFieldTouched(name, true, true);
          }, 0);
        }}
      />
    </FieldsetRoot>
  );
};

export default InlineImageSearch;
