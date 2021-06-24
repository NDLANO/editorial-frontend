import handleError from './handleError';
import { pathToUrnArray } from './taxonomyHelpers';
import { TaxonomyElement } from '../interfaces';

export type Input = {
  topicPath: string;
  structure: PathArray;
  allTopics: PathArray;
  title: string;
};

export type PathArray = Array<TaxonomyElement>;

const retriveBreadCrumbs = ({ topicPath, structure, allTopics, title }: Input): PathArray => {
  try {
    const [subjectPath, ...topicPaths] = pathToUrnArray(topicPath);

    const subject = structure.find(structureSubject => structureSubject.id === subjectPath);
    if (!subject) return [];
    const returnPaths = [
      {
        name: subject.name,
        id: subject.id,
        metadata: subject.metadata,
      },
    ];
    topicPaths.forEach((pathId: string) => {
      const path = allTopics.find(subtopic => subtopic.id === pathId);
      if (path) {
        returnPaths.push({
          name: path.name,
          id: path.id,
          metadata: path.metadata,
        });
      } else if (title) {
        returnPaths.push({
          name: title,
          id: pathId,
          metadata: { visible: true, grepCodes: [], customFields: {} },
        });
      }
    });
    return returnPaths;
  } catch (err) {
    handleError(err);
    return [];
  }
};

export default retriveBreadCrumbs;
