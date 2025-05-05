/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_int_ } from '../models/BaseResponse_int_';
import type { BaseResponse_Page_PostVO_ } from '../models/BaseResponse_Page_PostVO_';
import type { PostFavourAddRequest } from '../models/PostFavourAddRequest';
import type { PostQueryRequest } from '../models/PostQueryRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PostFavourControllerService {
    /**
     * doFavour
     * @param postFavourAddRequest postFavourAddRequest
     * @returns BaseResponse_int_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static doFavourUsingPost(
        postFavourAddRequest: PostFavourAddRequest,
    ): CancelablePromise<BaseResponse_int_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post_favour/',
            body: postFavourAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * hasFavour
     * @param postId postId
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static hasFavourUsingGet(
        postId: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post_favour/has_favour',
            query: {
                'postId': postId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listMyFavourPostByPage
     * @param postQueryRequest postQueryRequest
     * @returns BaseResponse_Page_PostVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listMyFavourPostByPageUsingPost(
        postQueryRequest: PostQueryRequest,
    ): CancelablePromise<BaseResponse_Page_PostVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post_favour/my/list/page',
            body: postQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
