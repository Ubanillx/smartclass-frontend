/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_PostCommentVO_ } from '../models/BaseResponse_Page_PostCommentVO_';
import type { BaseResponse_PostCommentVO_ } from '../models/BaseResponse_PostCommentVO_';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { PostCommentAddRequest } from '../models/PostCommentAddRequest';
import type { PostCommentQueryRequest } from '../models/PostCommentQueryRequest';
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
            url: '/api/post_comment/add',
            body: postCommentAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * adminDeletePostComment
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static adminDeletePostCommentUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post_comment/admin/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deletePostComment
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deletePostCommentUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post_comment/delete',
            body: deleteRequest,
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
        id?: number,
    ): CancelablePromise<BaseResponse_PostCommentVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post_comment/get',
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
     * listPostCommentByPage
     * @param postCommentQueryRequest postCommentQueryRequest
     * @returns BaseResponse_Page_PostCommentVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listPostCommentByPageUsingPost(
        postCommentQueryRequest: PostCommentQueryRequest,
    ): CancelablePromise<BaseResponse_Page_PostCommentVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post_comment/list/page',
            body: postCommentQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
