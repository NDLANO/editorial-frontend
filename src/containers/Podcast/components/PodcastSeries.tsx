/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { colors, fonts, spacing } from '@ndla/core';
import { FieldHeader } from '@ndla/forms';
import { DeleteForever } from '@ndla/icons/editor';
import SafeLink from '@ndla/safelink';
import { ISeriesSummary } from '@ndla/types-backend/audio-api';
import { Text } from '@ndla/typography';
import AsyncDropdown from '../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import FormikField from '../../../components/FormikField';
import { SearchResultBase } from '../../../interfaces';
import { searchSeries } from '../../../modules/audio/audioApi';
import { toEditPodcastSeries } from '../../../util/routeHelpers';
import { ElementImage } from '../../FormikForm/components/ElementListItem';

interface SeriesType extends Omit<ISeriesSummary, 'coverPhoto'> {
  metaImage: { id: string; url: string; alt: string };
}

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

const StyledFormikField = styled(FormikField)`
  margin: 0;
`;

const PodcastSeries = () => {
  const { t, i18n } = useTranslation();

  const searchForSeries = async (
    query: string,
    page: number | undefined,
  ): Promise<SearchResultBase<SeriesType>> => {
    const searchResult = await searchSeries({
      query,
      page,
    });
    const results = searchResult.results.map((result) => ({
      ...result,
      metaImage: { ...result.coverPhoto, alt: result.coverPhoto.altText },
    }));
    return { ...searchResult, results };
  };
  return (
    <StyledFormikField name="series">
      {({ field }) => (
        <StyledWrapper>
          <FieldHeader title={t('podcastForm.fields.series')} />
          {field.value ? (
            <PodcastSeriesElement>
              <div>
                <ElementImage element={{ ...field.value, metaImage: field.value.coverPhoto }} />
                {field.value.id && (
                  <StyledSafeLink
                    to={toEditPodcastSeries(field.value.id, i18n.language)}
                    target="_blank"
                  >
                    {field.value.title.title}
                  </StyledSafeLink>
                )}
              </div>
              <IconButtonV2
                aria-label={t('podcastForm.information.removeSeries')}
                title={t('podcastForm.information.removeSeries')}
                variant="ghost"
                colorTheme="danger"
                onClick={() => field.onChange({ target: { name: field.name, value: null } })}
              >
                <DeleteForever />
              </IconButtonV2>
            </PodcastSeriesElement>
          ) : (
            <Text textStyle="content-alt">{t('podcastForm.information.noSeries')}</Text>
          )}
          <AsyncDropdown<SeriesType>
            selectedItems={field.value ? [field.value] : []}
            idField="id"
            labelField="title"
            placeholder={t('form.content.relatedArticle.placeholder')}
            apiAction={searchForSeries}
            onClick={(e) => e.stopPropagation()}
            onChange={(series) => {
              // Delete episodes from series object, keep remaining
              const { episodes: _, ...remaining } = series;
              field.onChange({ target: { name: field.name, value: remaining } });
            }}
            multiSelect
            disableSelected
            clearInputField
            showPagination
          />
        </StyledWrapper>
      )}
    </StyledFormikField>
  );
};

export default PodcastSeries;
