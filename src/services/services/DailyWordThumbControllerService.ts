/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_int_ } from '../models/BaseResponse_int_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DailyWordThumbControllerService {
    /**
     * thumbWord
     * @param wordId wordId
     * @returns BaseResponse_int_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static thumbWordUsingPost(
        wordId: number,
    ): CancelablePromise<BaseResponse_int_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/daily-word-thumbs/{wordId}',
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
     * cancelThumbWord
     * @param wordId wordId
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static cancelThumbWordUsingDelete(
        wordId: number,
    ): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/daily-word-thumbs/{wordId}',
            path: {
                'wordId': wordId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * isThumbWord
     * @param wordId wordId
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static isThumbWordUsingGet(
        wordId: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/daily-word-thumbs/{wordId}/status',
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
