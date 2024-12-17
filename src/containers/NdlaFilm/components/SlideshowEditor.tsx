/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { ThemeMovies } from "./ThemeMovies";
import { FormField } from "../../../components/FormField";

const SlideshowEditor = () => {
  const { t } = useTranslation();

  return (
    <FormField name="slideShow">
      {({ field, helpers }) => (
        <ThemeMovies
          movies={field.value}
          onMoviesUpdated={(movies) => helpers.setValue(movies)}
          placeholder={t("ndlaFilm.editor.addMovieToSlideshow")}
          comboboxLabel={t("ndlaFilm.editor.slideshowTitle")}
        />
      )}
    </FormField>
  );
};

export default SlideshowEditor;
