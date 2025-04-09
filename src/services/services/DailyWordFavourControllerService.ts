/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_.ts';
import type { BaseResponse_int_ } from '../models/BaseResponse_int_.ts';
import type { BaseResponse_Page_DailyWordVO_ } from '../models/BaseResponse_Page_DailyWordVO_.ts';
import type { DailyWordQueryRequest } from '../models/DailyWordQueryRequest.ts';
import type { CancelablePromise } from '../core/CancelablePromise.ts';
import { OpenAPI } from '../core/OpenAPI.ts';
import { request as __request } from '../core/request.ts';
export class DailyWordFavourControllerService {
    /**
     * isFavourWord
     * @param wordId wordId
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static isFavourWordUsingGet(
        wordId: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dailyWord/favour/check/{wordId}',
            path: {
                'wordId': wordId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listMyFavourWordByPage
     * @param dailyWordQueryRequest dailyWordQueryRequest
     * @returns BaseResponse_Page_DailyWordVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listMyFavourWordByPageUsingPost(
        dailyWordQueryRequest: DailyWordQueryRequest,
    ): CancelablePromise<BaseResponse_Page_DailyWordVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dailyWord/favour/list/page/my',
            body: dailyWordQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateMasteryLevel
     * @param masteryLevel masteryLevel
     * @param wordId wordId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateMasteryLevelUsingPost(
        masteryLevel: number,
        wordId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dailyWord/favour/mastery/{wordId}/{masteryLevel}',
            path: {
                'masteryLevel': masteryLevel,
                'wordId': wordId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * saveWordNote
     * @param noteContent noteContent
     * @param wordId wordId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static saveWordNoteUsingPost(
        noteContent: string,
        wordId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dailyWord/favour/note/{wordId}',
            path: {
                'wordId': wordId,
            },
            query: {
                'noteContent': noteContent,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * markWordAsStudied
     * @param wordId wordId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static markWordAsStudiedUsingPost(
        wordId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dailyWord/favour/study/{wordId}',
            path: {
                'wordId': wordId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * doWordFavour
     * @param wordId wordId
     * @returns BaseResponse_int_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static doWordFavourUsingPost(
        wordId: number,
    ): CancelablePromise<BaseResponse_int_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dailyWord/favour/{wordId}',
            path: {
                'wordId': wordId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
