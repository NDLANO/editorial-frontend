import handleError from './handleError';
import { pathToUrnArray } from './taxonomyHelpers';

const retriveBreadCrumbs = ({ topicPath, structure, allTopics, title }) => {
  try {
    const [subjectPath, ...topicPaths] = pathToUrnArray(topicPath);

    const subject = structure.find(
      structureSubject => structureSubject.id === subjectPath,
    );
    const returnPaths = [];
    returnPaths.push({
      name: subject.name,
      id: subject.id,
    });
    topicPaths.forEach(pathId => {
      const topicPath = allTopics.find(subtopic => subtopic.id === pathId);
      if (topicPath) {
        returnPaths.push({
          name: topicPath.name,
          id: topicPath.id,
        });
      } else if (title) {
        returnPaths.push({ name: title, id: pathId });
      }
    });
    return returnPaths;
  } catch (err) {
    handleError(err);
    return false;
  }
};

export default retriveBreadCrumbs;
