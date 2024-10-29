/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { useTranslation } from "react-i18next";
import { ComboboxLabel } from "@ndla/primitives";
import { IAudioSummary, IAudioMetaInformation } from "@ndla/types-backend/audio-api";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../components/abstractions/Combobox";
import { GenericSearchCombobox } from "../../../components/Form/GenericSearchCombobox";
import ListResource from "../../../components/Form/ListResource";
import { FormContent } from "../../../components/FormikForm";
import { fetchAudio } from "../../../modules/audio/audioApi";
import { useSearchAudio } from "../../../modules/audio/audioQueries";
import { routes } from "../../../util/routeHelpers";
import { usePaginatedQuery } from "../../../util/usePaginatedQuery";

interface Props {
  language: string;
  seriesId: number | undefined;
}

const PodcastEpisodes = ({ language, seriesId }: Props) => {
  const { query, delayedQuery, setQuery, page, setPage } = usePaginatedQuery();
  const { t } = useTranslation();
  const [field, _meta, helpers] = useField<IAudioMetaInformation[]>("episodes");

  const searchQuery = useSearchAudio(
    { query: delayedQuery, language, page, audioType: "podcast" },
    {
      placeholderData: (prev) => prev,
    },
  );

  const onValueChange = async (audio: (IAudioSummary | IAudioMetaInformation)[]) => {
    // Element is added
    if (audio.length > field.value.length) {
      const addedElement = audio[audio.length - 1];
      const newAudio = await fetchAudio(addedElement.id, language);
      helpers.setValue([...field.value, newAudio]);
      return;
    }
    // Element is deleted
    if (audio.length < field.value.length) {
      helpers.setValue(audio as IAudioMetaInformation[]);
      return;
    }
  };

  return (
    <FormContent>
      <GenericSearchCombobox
        value={field.value.map((c) => c.id.toString())}
        onValueChange={(details) => {
          onValueChange(details.items);
        }}
        items={searchQuery.data?.results ?? []}
        itemToValue={(item) => item.id.toString()}
        itemToString={(item) => item.title.title}
        isItemDisabled={(item) =>
          // Disable item if it exists in the list or exists in another series
          field.value.some((valueItem) => valueItem.id === item.id) ||
          (item.series?.id !== undefined && item.series.id !== seriesId)
        }
        multiple
        isSuccess={searchQuery.isSuccess}
        paginationData={searchQuery.data}
        inputValue={query}
        onInputValueChange={(details) => setQuery(details.inputValue)}
        onPageChange={(details) => setPage(details.page)}
        renderItem={(item) => (
          <GenericComboboxItemContent title={item.title.title} image={item.podcastMeta?.coverPhoto} useFallbackImage />
        )}
      >
        <ComboboxLabel>{t("form.relatedConcepts.articlesTitle")}</ComboboxLabel>
        <GenericComboboxInput
          placeholder={t("form.content.relatedArticle.placeholder")}
          isFetching={searchQuery.isFetching}
        />
      </GenericSearchCombobox>
      <div>
        {field.value.map((element) => (
          <ListResource
            key={element.id}
            title={element.title.title}
            metaImage={element.podcastMeta?.coverPhoto}
            url={routes.audio.edit(element.id, language)}
            onDelete={() => {
              const filtered = field.value.filter((el) => el.id !== element.id);
              helpers.setValue(filtered);
            }}
            removeElementTranslation={t("conceptpageForm.removeArticle")}
          />
        ))}
      </div>
    </FormContent>
  );
};

export default PodcastEpisodes;
