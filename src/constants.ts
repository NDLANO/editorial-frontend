/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "./config";
import { WhitelistProvider } from "./interfaces";

export const SAVE_BUTTON_ID = "editor-save-button";
export const BLOCK_PICKER_TRIGGER_ID = "block-picker-trigger";

export const RESOURCE_TYPE_LEARNING_PATH = "urn:resourcetype:learningPath";
export const RESOURCE_TYPE_SUBJECT_MATERIAL = "urn:resourcetype:subjectMaterial";
export const RESOURCE_TYPE_TASKS_AND_ACTIVITIES = "urn:resourcetype:tasksAndActivities";
export const RESOURCE_TYPE_ASSESSMENT_RESOURCES = "urn:resourcetype:reviewResource";
export const RESOURCE_TYPE_SOURCE_MATERIAL = "urn:resourcetype:SourceMaterial";
export const RESOURCE_TYPE_CONCEPT = "urn:resourcetype:concept";

export const ITUNES_STANDARD_MINIMUM_WIDTH = 1400;
export const ITUNES_STANDARD_MAXIMUM_WIDTH = 3000;

export const STORED_LANGUAGE_KEY = "language";

export const REMEMBER_FAVOURITE_SUBJECTS = "rememberFavouriteSubjects";
export const REMEMBER_FAVORITE_NODES = "rememberFavoriteNodes";
export const REMEMBER_LMA_SUBJECTS = "rememberLMASubjects";
export const REMEMBER_DA_SUBJECTS = "rememberDASubjects";
export const REMEMBER_SA_SUBJECTS = "rememberSASubjects";
export const REMEMBER_QUALITY = "rememberQuality";
export const FAVOURITES_SUBJECT_ID = "urn:favourites";
export const LMA_SUBJECT_ID = "urn:lmaSubjects";
export const SA_SUBJECT_ID = "urn:saSubjects";
export const DA_SUBJECT_ID = "urn:daSubjects";
// Relevances
export const RESOURCE_FILTER_CORE = "urn:relevance:core";
export const RESOURCE_FILTER_SUPPLEMENTARY = "urn:relevance:supplementary";

export const NDLA_FILM_SUBJECT = "urn:subject:20";

export const DRAFT_ADMIN_SCOPE = "drafts:admin";
export const DRAFT_WRITE_SCOPE = "drafts:write";
export const DRAFT_HTML_SCOPE = "drafts:html";
export const DRAFT_PUBLISH_SCOPE = "drafts:publish";
export const DRAFT_RESPONSIBLE = "drafts:responsible";

export const CONCEPT_ADMIN_SCOPE = "concept:admin";
export const CONCEPT_WRITE_SCOPE = "concept:write";
export const CONCEPT_RESPONSIBLE = "concept:responsible";

export const TAXONOMY_WRITE_SCOPE = "taxonomy:write";
export const TAXONOMY_ADMIN_SCOPE = "taxonomy:admin";

export const TAXONOMY_VERSION_DEFAULT = "default";

export const FRONTPAGE_ADMIN_SCOPE = "frontpage:admin";

export const AUDIO_ADMIN_SCOPE = "audio:admin";

export const TAXONOMY_CUSTOM_FIELD_LANGUAGE = "language";
export const TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES = "topic-resources";
export const TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE = "grouped";
export const TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE = "ungrouped";
export const TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT = "forklaringsfag";
export const TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID = "old-subject-id";
export const TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY = "subjectCategory";
export const TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE = "subjectType";
export const TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA = "subjectLMA";
export const TAXONOMY_CUSTOM_FIELD_SUBJECT_SA = "subjectSA";
export const TAXONOMY_CUSTOM_FIELD_SUBJECT_DA = "subjectDA";
export const TAXONOMY_CUSTOM_FIELD_PROGRAMME_SUBJECT = "programfag";

export const MAX_IMAGE_UPLOAD_SIZE = 1024 * 1024 * 40; // 40MB.
export const LAST_UPDATED_SIZE = 50;

export const LOCALE_VALUES = ["nb", "nn", "en", "se", "sma", "ukr"] as const;

export const ARCHIVED = "ARCHIVED";
export const END_CONTROL = "END_CONTROL";
export const IMPORTED = "IMPORTED";
export const IN_PROGRESS = "IN_PROGRESS";
export const PLANNED = "PLANNED";
export const PUBLISHED = "PUBLISHED";
export const UNPUBLISHED = "UNPUBLISHED";
export const EXTERNAL_REVIEW = "EXTERNAL_REVIEW";
export const INTERNAL_REVIEW = "INTERNAL_REVIEW";
export const QUALITY_ASSURANCE = "QUALITY_ASSURANCE";
export const LANGUAGE = "LANGUAGE";
export const FOR_APPROVAL = "FOR_APPROVAL";
export const PUBLISH_DELAYED = "PUBLISH_DELAYED";
export const REPUBLISH = "REPUBLISH";

export const STATUS_ORDER = [
  PLANNED,
  IN_PROGRESS,
  EXTERNAL_REVIEW,
  INTERNAL_REVIEW,
  QUALITY_ASSURANCE,
  LANGUAGE,
  FOR_APPROVAL,
  END_CONTROL,
  PUBLISH_DELAYED,
  REPUBLISH,
];

export const STORED_PAGE_SIZE = "STORED_PAGE_SIZE";
export const STORED_PAGE_SIZE_CONCEPT = "STORED_PAGE_SIZE_CONCEPT";
export const STORED_PAGE_SIZE_ON_HOLD = "STORED_PAGE_SIZE_ON_HOLD";
export const STORED_PAGE_SIZE_LAST_UPDATED = "STORED_PAGE_SIZE_LAST_UPDATED";
export const STORED_PAGE_SIZE_LAST_UPDATED_CONCEPT = "STORED_PAGE_SIZE_LAST_UPDATED_CONCEPT";
export const STORED_PAGE_SIZE_REVISION = "STORED_PAGE_SIZE_REVISION";
export const STORED_PAGE_SIZE_SUBJECT_VIEW_FAVORITES = "STORED_PAGE_SIZE_SUBJECT_VIEW_FAVORITES";
export const STORED_PAGE_SIZE_SUBJECT_VIEW_LMA = "STORED_PAGE_SIZE_SUBJECT_VIEW_LMA";
export const STORED_PAGE_SIZE_SUBJECT_VIEW_DA = "STORED_PAGE_SIZE_SUBJECT_VIEW_DA";
export const STORED_PAGE_SIZE_SUBJECT_VIEW_SA = "STORED_PAGE_SIZE_SUBJECT_VIEW_SA";

export const STORED_SORT_OPTION_WORKLIST = "STORED_SORT_OPTION_WORKLIST";
export const STORED_SORT_OPTION_WORKLIST_CONCEPT = "STORED_SORT_OPTION_WORKLIST_CONCEPT";
export const STORED_SORT_OPTION_WORKLIST_ON_HOLD = "STORED_SORT_OPTION_WORKLIST_ON_HOLD";
export const STORED_SORT_OPTION_LAST_USED = "STORED_SORT_OPTION_LAST_USED";
export const STORED_SORT_OPTION_LAST_USED_CONCEPT = "STORED_SORT_OPTION_LAST_USED_CONCEPT";
export const STORED_SORT_OPTION_REVISION = "STORED_SORT_OPTION_REVISION";
export const STORED_FILTER_WORKLIST = "STORED_FILTER_WORKLIST";
export const STORED_FILTER_WORKLIST_CONCEPT = "STORED_FILTER_WORKLIST_CONCEPT";
export const STORED_FILTER_REVISION = "STORED_FILTER_WORKLIST_REVISION";
export const STORED_FILTER_LMA_SUBJECT = "STORED_FILTER_LMA_SUBJECT";
export const STORED_FILTER_DA_SUBJECT = "STORED_FILTER_DA_SUBJECT";
export const STORED_FILTER_SA_SUBJECT = "STORED_FILTER_SA_SUBJECT";
export const STORED_FILTER_FAVORITES = "STORED_FILTER_FAVORITES";
export const STORED_PRIORITIZED = "STORED_PRIORITIZED";
export const STORED_PRIMARY_CONNECTION = "STORED_PRIMARY_CONNECTION";
export const STORED_ON_HOLD_LMA_SUBJECT = "STORED_ON_HOLD_LMA_SUBJECT";
export const STORED_ON_HOLD_DA_SUBJECT = "STORED_ON_HOLD_DA_SUBJECT";
export const STORED_ON_HOLD_SA_SUBJECT = "STORED_ON_HOLD_SA_SUBJECT";
export const STORED_ON_HOLD_FAVORITES = "STORED_ON_HOLD_FAVORITES";
export const STORED_HIDE_COMMENTS = "STORED_HIDE_COMMENTS";

export const EXTERNAL_WHITELIST_PROVIDERS: WhitelistProvider[] = [
  { name: "H5P", url: ["h5p"] },
  { name: "YouTube", url: ["youtube.com", "youtu.be", "www.youtube.com"], height: "486px" },
  { name: "NRK", url: ["static.nrk.no"], height: "398px" },
  { name: "Vimeo", url: ["player.vimeo.com", "vimeo.com", "vimeopro.com"], height: "486px" },
  { name: "Norgesfilm", url: ["ndla.filmiundervisning.no"] },
  { name: "TED", url: ["ted.com", "embed.ted.com"] },
  {
    name: "TV2 Skole",
    url: ["www.tv2skole.no", "app.elevkanalen.no"],
    height: "560px",
  },
  {
    name: "Khan Academy",
    url: ["nb.khanacademy.org", "www.khanacademy.org"],
    height: "486px",
  },
  { name: "Prezi", url: ["prezi.com"] },
  { name: "SlideShare", url: ["www.slideshare.net"], height: "500px" },
  { name: "Scribd", url: ["scribd.com"] },
  { name: "Geogebra", url: ["geogebra.org", "www.geogebra.org", "ggbm.at"] },
  { name: "IMDB", url: ["www.imdb.com", "imdb.com"], height: "398px" },
  { name: "Tom Knudsen", url: ["www.tomknudsen.no", "tomknudsen.no"] },
  { name: "Phet", url: ["phet.colorado.edu"] },
  {
    name: "Worldbank",
    url: ["worldbank.org", "data.worldbank.org", "*.worldbank.org"],
  },
  { name: "Concord", url: ["lab.concord.org"] },
  {
    name: "Miljøstatus",
    url: ["www.miljostatus.no", "miljostatus.no", "miljoatlas.miljodirektoratet.no"],
    height: "398px",
  },
  { name: "MolView", url: ["embed.molview.org"] },
  { name: "NDLA Statisk", url: [`statisk.${config.ndlaBaseUrl}`] },
  { name: "NDLA Explore", url: ["xerte.explore.ndla.no"] },
  { name: "Ebok", url: ["ebok.no"] },
  { name: "VG", url: ["www.vg.no"] },
  { name: "Trinket", url: ["trinket.io"], height: "700px" },
  { name: "Codepen", url: ["codepen.io"], height: "500px" },
  {
    name: "Flourish studio",
    url: ["public.flourish.studio", "flo.uri.sh"],
    height: "650px",
  },
  { name: "Our World in Data", url: ["ourworldindata.org"] },
  { name: "SketchUp 3D Warehouse", url: ["3dwarehouse.sketchup.com"] },
  { name: "Gapminder", url: ["www.gapminder.org"] },
  { name: "Facebook", url: ["www.facebook.com", "fb.watch"] },
  { name: "Sketchfab", url: ["sketchfab.com"] },
  { name: "JeopardyLabs", url: ["jeopardylabs.com"] },
  { name: "Brightcove", url: ["players.brightcove.net"] },
  { name: "UIO", url: ["vrtx.uio.no", "www.mn.uio.no"] },
  { name: "Geodata", url: ["geodata.maps.arcgis.com", "ndla.maps.arcgis.com", "arcg.is"] },
  { name: "Norgeskart", url: ["norgeskart.no"] },
  { name: "Kart i skolen", url: ["kartiskolen.no"] },
  { name: "Norge i bilder", url: ["norgeibilder.no"] },
  { name: "Qbrick", url: ["video.qbrick.com"] },
];

export const SearchTypeValues = [
  // Available search types, there is a type equivalent in `interfaces.ts`
  "content",
  "audio",
  "image",
  "concept",
  "podcast-series",
] as const;

export type RevisionTypes = "revised" | "needs-revision";
export const Revision = {
  revised: "revised" as RevisionTypes,
  needsRevision: "needs-revision" as RevisionTypes,
};
