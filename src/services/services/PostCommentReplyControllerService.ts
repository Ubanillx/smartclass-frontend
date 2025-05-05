/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_PostCommentReplyVO_ } from '../models/BaseResponse_Page_PostCommentReplyVO_';
import type { BaseResponse_PostCommentReplyVO_ } from '../models/BaseResponse_PostCommentReplyVO_';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { PostCommentReplyAddRequest } from '../models/PostCommentReplyAddRequest';
import type { PostCommentReplyQueryRequest } from '../models/PostCommentReplyQueryRequest';
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
            url: '/api/post_comment_reply/add',
            body: postCommentReplyAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * adminDeletePostCommentReply
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static adminDeletePostCommentReplyUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post_comment_reply/admin/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deletePostCommentReply
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deletePostCommentReplyUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post_comment_reply/delete',
            body: deleteRequest,
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
        id?: number,
    ): CancelablePromise<BaseResponse_PostCommentReplyVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post_comment_reply/get',
            query: {
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
     * listPostCommentReplyByPage
     * @param postCommentReplyQueryRequest postCommentReplyQueryRequest
     * @returns BaseResponse_Page_PostCommentReplyVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listPostCommentReplyByPageUsingPost(
        postCommentReplyQueryRequest: PostCommentReplyQueryRequest,
    ): CancelablePromise<BaseResponse_Page_PostCommentReplyVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post_comment_reply/list/page',
            body: postCommentReplyQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
