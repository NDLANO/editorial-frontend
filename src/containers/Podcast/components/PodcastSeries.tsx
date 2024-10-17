/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { colors, fonts, spacing } from "@ndla/core";
import { DeleteForever } from "@ndla/icons/editor";
import { ComboboxLabel, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../components/abstractions/Combobox";
import FieldHeader from "../../../components/Field/FieldHeader";
import { GenericSearchCombobox } from "../../../components/Form/GenericSearchCombobox";
import { FormField } from "../../../components/FormField";
import { useSearchSeries } from "../../../modules/audio/audioQueries";
import { toEditPodcastSeries } from "../../../util/routeHelpers";
import { usePaginatedQuery } from "../../../util/usePaginatedQuery";
import ElementImage from "../../FormikForm/components/ElementImage";

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const PodcastSeriesElement = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.xxsmall};
  background: ${colors.brand.greyLighter};
`;

const StyledSafeLink = styled(SafeLink)`
  color: ${colors.brand.primary};
  font-weight: ${fonts.weight.semibold};
`;

const PodcastSeries = () => {
  const { t, i18n } = useTranslation();
  const { query, delayedQuery, page, setPage, setQuery } = usePaginatedQuery();

  const searchQuery = useSearchSeries({ query: delayedQuery, page: page }, { placeholderData: (prev) => prev });

  return (
    <FormField name="series">
      {({ field, helpers }) => (
        <StyledWrapper>
          <FieldHeader title={t("podcastForm.fields.series")} />
          {field.value ? (
            <PodcastSeriesElement>
              <div>
                <ElementImage url={field.value?.coverPhoto?.url} alt={field.value?.coverPhoto?.altText} />
                {field.value.id && (
                  <StyledSafeLink to={toEditPodcastSeries(field.value.id, i18n.language)} target="_blank">
                    {field.value.title.title}
                  </StyledSafeLink>
                )}
              </div>
              <IconButtonV2
                aria-label={t("podcastForm.information.removeSeries")}
                title={t("podcastForm.information.removeSeries")}
                variant="ghost"
                colorTheme="danger"
                onClick={() => helpers.setValue(null, true)}
              >
                <DeleteForever />
              </IconButtonV2>
            </PodcastSeriesElement>
          ) : (
            <Text>{t("podcastForm.information.noSeries")}</Text>
          )}

          <GenericSearchCombobox
            items={searchQuery.data?.results ?? []}
            itemToString={(item) => item.title.title}
            itemToValue={(item) => item.id.toString()}
            inputValue={query}
            isSuccess={searchQuery.isSuccess}
            paginationData={searchQuery.data}
            onInputValueChange={(details) => setQuery(details.inputValue)}
            onPageChange={(details) => setPage(details.page)}
            value={field.value ? [field.value.id.toString()] : []}
            onValueChange={(details) => {
              const series = details.items[0];
              if (!series) return;
              // Delete episodes from series object, keep remaining
              const { episodes: _, ...remaining } = series;
              helpers.setValue(remaining);
            }}
            renderItem={(item) => (
              <GenericComboboxItemContent
                title={item.title.title}
                description={item.description.description}
                image={item.coverPhoto}
                useFallbackImage
              />
            )}
          >
            <ComboboxLabel>{t("podcastForm.fields.series")}</ComboboxLabel>
            <GenericComboboxInput
              placeholder={t("form.content.relatedArticle.placeholder")}
              isFetching={searchQuery.isFetching}
            />
          </GenericSearchCombobox>
        </StyledWrapper>
      )}
    </FormField>
  );
};

export default PodcastSeries;
