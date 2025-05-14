/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_Page_PostVO_ } from '../models/BaseResponse_Page_PostVO_';
import type { PostFavourAddRequest } from '../models/PostFavourAddRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PostFavourControllerService {
    /**
     * addFavour
     * @param postFavourAddRequest postFavourAddRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addFavourUsingPost(
        postFavourAddRequest: PostFavourAddRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post-favours',
            body: postFavourAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listMyFavourPostByPage
     * @param content
     * @param current
     * @param favourUserId
     * @param id
     * @param notId
     * @param orTags
     * @param pageSize
     * @param searchText
     * @param sortField
     * @param sortOrder
     * @param tags
     * @param title
     * @param userId
     * @returns BaseResponse_Page_PostVO_ OK
     * @throws ApiError
     */
    public static listMyFavourPostByPageUsingGet(
        content?: string,
        current?: number,
        favourUserId?: number,
        id?: number,
        notId?: number,
        orTags?: Array<string>,
        pageSize?: number,
        searchText?: string,
        sortField?: string,
        sortOrder?: string,
        tags?: Array<string>,
        title?: string,
        userId?: number,
    ): CancelablePromise<BaseResponse_Page_PostVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post-favours/me/page',
            query: {
                'content': content,
                'current': current,
                'favourUserId': favourUserId,
                'id': id,
                'notId': notId,
                'orTags': orTags,
                'pageSize': pageSize,
                'searchText': searchText,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'tags': tags,
                'title': title,
                'userId': userId,
            },
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
            url: '/api/post-favours/{postId}',
            path: {
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
     * cancelFavour
     * @param postId postId
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static cancelFavourUsingDelete(
        postId: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/post-favours/{postId}',
            path: {
                'postId': postId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
}
