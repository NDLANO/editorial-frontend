/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import queryString from "query-string";
import { contributorGroups, contributorTypes, getLicenseByNBTitle } from "@ndla/licenses";
import { ICopyrightDTO } from "@ndla/types-backend/article-api";
import { BrightcoveApiType, BrightcoveCopyright, BrightcoveVideoSource } from "@ndla/types-embed";
import config from "../../config";
import {
  brightcoveApiResourceUrl,
  fetchWithBrightCoveToken,
  resolveJsonOrRejectWithError,
} from "../../util/apiHelpers";

const baseBrightCoveUrlV3 = brightcoveApiResourceUrl(`/v1/accounts/${config.brightcoveAccountId}/videos`);

interface BrightcoveQueryParams {
  query?: string;
  offset?: number;
  limit?: number;
}

export const searchBrightcoveVideos = (query: BrightcoveQueryParams) =>
  fetchWithBrightCoveToken(
    `${baseBrightCoveUrlV3}/?${queryString.stringify({
      q: query.query || "",
      offset: query.offset,
      limit: query.limit,
    })}`,
  ).then((r) => resolveJsonOrRejectWithError<BrightcoveApiType[]>(r));

export const fetchBrightcoveVideo = (videoId: string) =>
  fetchWithBrightCoveToken(`${baseBrightCoveUrlV3}/${videoId}`).then((r) =>
    resolveJsonOrRejectWithError<BrightcoveApiType>(r),
  );

export interface VideoSearchQuery extends BrightcoveQueryParams {
  start?: number;
}

export const fetchBrightcoveSources = async (videoId: string): Promise<BrightcoveVideoSource[]> =>
  fetchWithBrightCoveToken(`${baseBrightCoveUrlV3}/${videoId}/sources`).then((r) => resolveJsonOrRejectWithError(r));

export const searchVideos = async (query: VideoSearchQuery) => {
  return await searchBrightcoveVideos(query);
};

// This is a refactored version of GQL code. It should probably be moved to frontend-packages.

// This is almost equal to `getLicenseByNBTitle` in '@ndla/license',
// but the abbreviation returned in '@ndla/licenses' looks like this: 'CC BY-SA'.
// As such, we have to have a duplicate here.
const brightcoveLicenseToAbbrev: Record<string, string> = {
  "navngivelse-ikkekommersiell-ingenbearbeidelse": "CC-BY-NC-ND-4.0",
  "navngivelse-ikkekommersiell-delpåsammevilkår": "CC-BY-NC-SA-4.0",
  "navngivelse-ikkekommersiell": "CC-BY-NC-4.0",
  "navngivelse-ingenbearbeidelse": "CC-BY-ND-4.0",
  "navngivelse-delpåsammevilkår": "CC-BY-SA-4.0",
  navngivelse: "CC-BY-4.0",
  offentligdomene: "PD",
  publicdomaindedication: "CC0-1.0",
  publicdomainmark: "PD",
  "fristatus-erklæring": "CC0-1.0",
  opphavsrett: "COPYRIGHTED",
};
const getLicenseCodeByNbTitle = (title?: string) => {
  const sanitized = title?.replace(/\s/g, "").toLowerCase() ?? "";
  return brightcoveLicenseToAbbrev[sanitized] ?? title;
};

export const getBrightcoveCopyright = (
  customFields: Record<string, string>,
  locale: string,
): BrightcoveCopyright | undefined => {
  const license = getLicenseByNBTitle(customFields.license, locale);
  const licenseCode = getLicenseCodeByNbTitle(customFields.license);
  if (typeof license === "string" || !licenseCode) {
    return undefined;
  }

  return {
    license: {
      license: licenseCode,
      description: license.description,
      url: license.url,
    },
    ...getContributorGroups(customFields),
  };
};

const brightcoveFallbacks: Record<string, string> = {
  Manus: "Manusforfatter",
  Musikk: "Komponist",
  Opphavsmann: "Opphaver",
};

const keyedContributorTypes = Object.keys(contributorTypes.nb);

const parseContributorsString = (contributorString: string) => {
  const fields = contributorString.split(/: */);
  if (fields.length !== 2) return { type: "", name: fields[0] };
  const [type, name] = [brightcoveFallbacks[fields[0].trim()] ?? fields[0].trim(), fields[1]];
  const contributorType = keyedContributorTypes.find((key) => contributorTypes.nb[key] === type);
  return { type: contributorType || "", name };
};

type CopyrightType = Pick<ICopyrightDTO, "creators" | "processors" | "rightsholders">;

const objectKeys = Object.keys(contributorGroups) as Array<keyof typeof contributorGroups>;

export const getContributorGroups = (fields: Record<string, string>) => {
  const licenseInfoKeys = Object.keys(fields).filter((key) => key.startsWith("licenseinfo"));

  const contributors = licenseInfoKeys.map((key) => parseContributorsString(fields[key]));

  return contributors.reduce<CopyrightType>(
    (groups, c) => {
      const group = objectKeys.find((key) => contributorGroups[key].find((t) => t === c.type));
      groups[group ?? "creators"].push(c);
      return groups;
    },
    { creators: [], processors: [], rightsholders: [] },
  );
};
