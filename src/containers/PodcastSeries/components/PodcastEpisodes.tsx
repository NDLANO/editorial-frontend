/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ComboboxLabel } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IAudioMetaInformation } from "@ndla/types-backend/audio-api";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../components/abstractions/Combobox";
import { GenericSearchCombobox } from "../../../components/Form/GenericSearchCombobox";
import ListResource from "../../../components/Form/ListResource";
import { FormContent } from "../../../components/FormikForm";
import { fetchAudio } from "../../../modules/audio/audioApi";
import { useSearchAudio } from "../../../modules/audio/audioQueries";
import { routes } from "../../../util/routeHelpers";
import { usePaginatedQuery } from "../../../util/usePaginatedQuery";

const StyledList = styled("ul", {
  base: { listStyle: "none" },
});

interface Props {
  language: string;
  seriesId: number | undefined;
  initialEpisodes: IAudioMetaInformation[] | undefined;
}

const PodcastEpisodes = ({ language, seriesId, initialEpisodes = [] }: Props) => {
  const { query, delayedQuery, setQuery, page, setPage } = usePaginatedQuery();
  const { t } = useTranslation();
  const [field, _meta, helpers] = useField<number[]>("episodes");
  const [apiEpisodes, setApiEpisodes] = useState<IAudioMetaInformation[]>(initialEpisodes);

  const searchQuery = useSearchAudio(
    { query: delayedQuery, language, page, audioType: "podcast" },
    {
      placeholderData: (prev) => prev,
    },
  );

  const onValueChange = async (audio: number[]) => {
    // Element is added
    if (audio.length > field.value.length) {
      const addedElement = audio[audio.length - 1];
      const newAudio = await fetchAudio(addedElement, language);
      setApiEpisodes([...apiEpisodes, newAudio]);
      helpers.setValue(audio);
      return;
    }
    // Element is deleted
    if (audio.length < field.value.length) {
      const filteredApiEpisodes = apiEpisodes.filter((element) => audio.includes(element.id));
      setApiEpisodes(filteredApiEpisodes);
      helpers.setValue(audio);
      return;
    }
  };

  return (
    <FormContent>
      <GenericSearchCombobox
        value={field.value.map((c) => c.toString())}
        onValueChange={(details) => {
          onValueChange(details.items.map((i) => i.id));
        }}
        items={searchQuery.data?.results ?? []}
        itemToValue={(item) => item.id.toString()}
        itemToString={(item) => item.title.title}
        isItemDisabled={(item) =>
          // Disable item if it exists in the list or exists in another series
          field.value.some((valueItem) => valueItem === item.id) ||
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
      <StyledList>
        {apiEpisodes.map((element) => (
          <li key={element.id}>
            <ListResource
              title={element.title.title}
              metaImage={element.podcastMeta?.coverPhoto}
              url={routes.audio.edit(element.id, language)}
              onDelete={() => {
                const filtered = field.value.filter((el) => el !== element.id);
                onValueChange(filtered);
              }}
              removeElementTranslation={t("conceptpageForm.removeArticle")}
            />
          </li>
        ))}
      </StyledList>
    </FormContent>
  );
};

export default PodcastEpisodes;
