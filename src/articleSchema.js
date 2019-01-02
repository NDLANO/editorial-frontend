import { isUserProvidedEmbedDataValid } from './util/embedTagHelpers';
import { findNodesByType } from './util/slateHelpers';

export const learningResourceSchema = {
  title: {
    required: true,
  },
  introduction: {
    maxLength: 300,
  },
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
  },
};

export const topicArticleSchema = {
  title: {
    required: true,
  },
  introduction: {
    maxLength: 300,
  },
  content: {
    // TODO: Write test to validate content (see learning resource)
    required: false,
  },
  metaDescription: {
    maxLength: 155,
  },
  visualElement: {
    required: false,
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
  },
};

export default learningResourceSchema;
