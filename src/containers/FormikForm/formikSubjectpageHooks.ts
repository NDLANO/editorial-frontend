import {useEffect, useState} from "react";
import * as taxonomyApi from '../../modules/taxonomy/taxonomyApi';
import * as frontpageApi from '../../modules/frontpage/frontpageApi';
import * as draftApi from '../../modules/draft/draftApi';
import * as articleApi from '../../modules/article/articleApi';
import handleError from '../../util/handleError';
import {transformSubjectFromApiVersion} from "../../util/subjectHelpers";
import {ArticleType, SubjectpageType} from "../../interfaces";

export function useFetchSubjectpageData(subjectId: number, locale: string){
    const [subjectpage, setSubjectpage] = useState<SubjectpageType>();
    const [loading, setLoading] = useState(false);

    const fetchEditorsChoices = async (articleIds : string[]) => {
        //TODO: Are all references from editors choices referenced with external ids?
        const externalIds = articleIds.map((x: string) => x.split(':').pop());

        var newIds: string[] = [];
        var articleList: ArticleType[] = [];

        await Promise.all(
            externalIds.map(async externalId => {
                try {
                    const id = await draftApi.fetchNewArticleId(externalId);
                    newIds.push(id.id);
                } catch (e) { handleError(e) }
            }),
        )

        await Promise.all(newIds.map(async newId => {
            try{
                const article : ArticleType = await articleApi.getArticle(newId);
                articleList.push(article);
            } catch(e) { handleError(e) }
            }
        ))

        return articleList;
    }


    const fetchSubject = async () => {
        if (subjectId) {
            setLoading(true);
            const subject = await taxonomyApi.fetchSubject(subjectId);
            const subjectpageId = subject.contentUri.split(':').pop() || '';
            try {
                const subjectpage = await frontpageApi.fetchSubjectFrontpage(subjectpageId);
                const editorsChoices: ArticleType[] = await fetchEditorsChoices(subjectpage.editorsChoices);

                setSubjectpage(
                    transformSubjectFromApiVersion(subjectpage, editorsChoices)
                );
                setLoading(false);
            } catch(e) { handleError(e) }
        }
    }

    useEffect(() => {
        fetchSubject();
    }, [subjectId])

    return {
        subjectpage,
        loading,
    }
}