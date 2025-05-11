/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_UserFeedbackReplyVO_ } from '../models/BaseResponse_List_UserFeedbackReplyVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_UserFeedbackReplyVO_ } from '../models/BaseResponse_Page_UserFeedbackReplyVO_';
import type { UserFeedbackReplyAddRequest } from '../models/UserFeedbackReplyAddRequest';
import type { UserFeedbackReplyQueryRequest } from '../models/UserFeedbackReplyQueryRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserFeedbackReplyControllerService {
    /**
     * addReply
     * @param userFeedbackReplyAddRequest userFeedbackReplyAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addReplyUsingPost(
        userFeedbackReplyAddRequest: UserFeedbackReplyAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/feedback/reply/add',
            body: userFeedbackReplyAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listReplies
     * @param feedbackId feedbackId
     * @returns BaseResponse_List_UserFeedbackReplyVO_ OK
     * @throws ApiError
     */
    public static listRepliesUsingGet(
        feedbackId: number,
    ): CancelablePromise<BaseResponse_List_UserFeedbackReplyVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/feedback/reply/list',
            query: {
                'feedbackId': feedbackId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listReplyByPage
     * @param userFeedbackReplyQueryRequest userFeedbackReplyQueryRequest
     * @returns BaseResponse_Page_UserFeedbackReplyVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listReplyByPageUsingPost(
        userFeedbackReplyQueryRequest: UserFeedbackReplyQueryRequest,
    ): CancelablePromise<BaseResponse_Page_UserFeedbackReplyVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/feedback/reply/list/page',
            body: userFeedbackReplyQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * markAsRead
     * @param replyId replyId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static markAsReadUsingPost(
        replyId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/feedback/reply/read',
            query: {
                'replyId': replyId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
