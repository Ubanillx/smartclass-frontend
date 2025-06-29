/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_PostCommentReplyVO_ } from '../models/BaseResponse_Page_PostCommentReplyVO_';
import type { BaseResponse_PostCommentReplyVO_ } from '../models/BaseResponse_PostCommentReplyVO_';
import type { PostCommentReplyAddRequest } from '../models/PostCommentReplyAddRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PostCommentReplyControllerService {
    /**
     * addPostCommentReply
     * @param postCommentReplyAddRequest postCommentReplyAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addPostCommentReplyUsingPost(
        postCommentReplyAddRequest: PostCommentReplyAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post-comment-replies',
            body: postCommentReplyAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listPostCommentReplyByPage
     * @param commentId
     * @param content
     * @param current
     * @param pageSize
     * @param postId
     * @param sortField
     * @param sortOrder
     * @param userId
     * @returns BaseResponse_Page_PostCommentReplyVO_ OK
     * @throws ApiError
     */
    public static listPostCommentReplyByPageUsingGet(
        commentId?: number,
        content?: string,
        current?: number,
        pageSize?: number,
        postId?: number,
        sortField?: string,
        sortOrder?: string,
        userId?: number,
    ): CancelablePromise<BaseResponse_Page_PostCommentReplyVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post-comment-replies/page',
            query: {
                'commentId': commentId,
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
     * getPostCommentReplyById
     * @param id id
     * @returns BaseResponse_PostCommentReplyVO_ OK
     * @throws ApiError
     */
    public static getPostCommentReplyByIdUsingGet(
        id: number,
    ): CancelablePromise<BaseResponse_PostCommentReplyVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post-comment-replies/{id}',
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
     * deletePostCommentReply
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static deletePostCommentReplyUsingDelete(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/post-comment-replies/{id}',
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
     * adminDeletePostCommentReply
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static adminDeletePostCommentReplyUsingDelete(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/post-comment-replies/{id}/admin',
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
