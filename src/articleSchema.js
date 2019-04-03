import { isUserProvidedEmbedDataValid } from './util/embedTagHelpers';
import { findNodesByType } from './util/slateHelpers';

const commonArticleSchema = {
  title: {
    required: true,
  },
  introduction: {
    maxLength: 300,
  },
  metaDescription: {
    maxLength: 155,
  },
  tags: {
    required: false,
  },
  creators: {
    allObjectFieldsRequired: true,
  },
  processors: {
    allObjectFieldsRequired: true,
  },
  rightsholders: {
    allObjectFieldsRequired: true,
  },
  license: {
    required: false,
  },
  notes: {
    required: false,
    test: (value, model, setError) => {
      const emptyNote = value.find(note => note.length === 0);
      if (emptyNote !== undefined) {
        setError('learningResourceForm.validation.noEmptyNote');
      }
    },
  },
};

export const learningResourceSchema = {
  ...commonArticleSchema,
  metaImageAlt: {
    required: true,
    onlyValidateIf: model => model.metaImageId,
  },
  content: {
    required: true,
    test: (value, model, setError) => {
      const embedsHasErrors = value.find(block => {
        const embeds = findNodesByType(block.value.document, 'embed').map(
          node => node.get('data').toJS(),
        );
        const notValidEmbeds = embeds.filter(
          embed => !isUserProvidedEmbedDataValid(embed),
        );
        return notValidEmbeds.length > 0;
      });

      if (embedsHasErrors) {
        setError('learningResourceForm.validation.missingEmbedData');
      }
    },
  },
};

export const topicArticleSchema = {
  ...commonArticleSchema,
  content: {
    // TODO: Write test to validate content (see learning resource)
    required: false,
  },
  visualElement: {
    required: false,
  },
  metaImageAlt: {
    required: true,
    onlyValidateIf: model => model.metaImageId,
  },
  'visualElement.alt': {
    required: true,
    onlyValidateIf: model =>
      model.visualElement && model.visualElement.resource === 'image',
  },
  'visualElement.caption': {
    required: true,
    onlyValidateIf: model =>
      model.visualElement &&
      (model.visualElement.resource === 'image' ||
        model.visualElement.resource === 'brightcove'),
  },
};

export default learningResourceSchema;
