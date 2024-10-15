/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FastField, FieldProps } from "formik";
import { useTranslation } from "react-i18next";
import { ThemeMovies } from "./ThemeMovies";
import FieldHeader from "../../../components/Field/FieldHeader";

const SlideshowEditorField = () => {
  const { t } = useTranslation();
  return (
    <FastField name="slideshow">
      {({ field, form }: FieldProps<string[]>) => (
        <>
          <FieldHeader title={t("ndlaFilm.editor.slideshowTitle")} subTitle={t("ndlaFilm.editor.slideshowSubTitle")} />
          <ThemeMovies
            movies={field.value}
            onMoviesUpdated={(movies) => form.setFieldValue(field.name, movies)}
            placeholder={t("ndlaFilm.editor.addMovieToSlideshow")}
          />
        </>
      )}
    </FastField>
  );
};

export default SlideshowEditorField;
