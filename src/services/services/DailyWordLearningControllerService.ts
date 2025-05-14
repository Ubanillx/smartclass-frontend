/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_UserDailyWord_ } from '../models/BaseResponse_UserDailyWord_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DailyWordLearningControllerService {
    /**
     * getUserDailyWord
     * @param wordId wordId
     * @returns BaseResponse_UserDailyWord_ OK
     * @throws ApiError
     */
    public static getUserDailyWordUsingGet(
        wordId: number,
    ): CancelablePromise<BaseResponse_UserDailyWord_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/daily/word/learning/{wordId}',
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
            url: '/api/daily/word/learning/{wordId}/mastery',
            path: {
                'wordId': wordId,
            },
            query: {
                'masteryLevel': masteryLevel,
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
            url: '/api/daily/word/learning/{wordId}/note',
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
            url: '/api/daily/word/learning/{wordId}/study-status',
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
     * cancelWordStudied
     * @param wordId wordId
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static cancelWordStudiedUsingDelete(
        wordId: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/daily/word/learning/{wordId}/study-status',
            path: {
                'wordId': wordId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
}
