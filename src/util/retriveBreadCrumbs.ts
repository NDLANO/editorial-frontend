import handleError from './handleError';
import { pathToUrnArray } from './taxonomyHelpers';

type Input = {
  topicPath: { name: string; id: string };
  structure: PathArray;
  allTopics: PathArray;
  title: string;
};

type PathArray = Array<{
  name: string;
  id: string;
}>;

const retriveBreadCrumbs = ({
  topicPath,
  structure,
  allTopics,
  title,
}: Input): PathArray => {
  try {
    console.log(topicPath);
    const [subjectPath, ...topicPaths] = pathToUrnArray(topicPath);

    const subject = structure.find(
      structureSubject => structureSubject.id === subjectPath,
    );
    if (!subject) return [];
    const returnPaths = [
      {
        name: subject.name,
        id: subject.id,
      },
    ];
    topicPaths.forEach((pathId: string) => {
      const path = allTopics.find(subtopic => subtopic.id === pathId);
      if (path) {
        returnPaths.push({
          name: path.name,
          id: path.id,
        });
      } else if (title) {
        returnPaths.push({ name: title, id: pathId });
      }
    });
    return returnPaths;
  } catch (err) {
    handleError(err);
    return [];
  }
};

export default retriveBreadCrumbs;
