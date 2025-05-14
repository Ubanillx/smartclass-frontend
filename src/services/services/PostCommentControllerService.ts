/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_PostCommentVO_ } from '../models/BaseResponse_Page_PostCommentVO_';
import type { BaseResponse_PostCommentVO_ } from '../models/BaseResponse_PostCommentVO_';
import type { PostCommentAddRequest } from '../models/PostCommentAddRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PostCommentControllerService {
    /**
     * addPostComment
     * @param postCommentAddRequest postCommentAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addPostCommentUsingPost(
        postCommentAddRequest: PostCommentAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post-comments',
            body: postCommentAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listPostCommentByPage
     * @param content
     * @param current
     * @param pageSize
     * @param postId
     * @param sortField
     * @param sortOrder
     * @param userId
     * @returns BaseResponse_Page_PostCommentVO_ OK
     * @throws ApiError
     */
    public static listPostCommentByPageUsingGet(
        content?: string,
        current?: number,
        pageSize?: number,
        postId?: number,
        sortField?: string,
        sortOrder?: string,
        userId?: number,
    ): CancelablePromise<BaseResponse_Page_PostCommentVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post-comments/page',
            query: {
                'content': content,
                'current': current,
                'pageSize': pageSize,
                'postId': postId,
                'sortField': sortField,
                'sortOrder': sortOrder,
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
     * getPostCommentById
     * @param id id
     * @returns BaseResponse_PostCommentVO_ OK
     * @throws ApiError
     */
    public static getPostCommentByIdUsingGet(
        id: number,
    ): CancelablePromise<BaseResponse_PostCommentVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post-comments/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deletePostComment
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static deletePostCommentUsingDelete(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/post-comments/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * adminDeletePostComment
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static adminDeletePostCommentUsingDelete(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/post-comments/{id}/admin',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
}
