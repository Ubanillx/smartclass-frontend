/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_UserFeedbackReplyVO_ } from '../models/BaseResponse_List_UserFeedbackReplyVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_UserFeedbackReplyVO_ } from '../models/BaseResponse_Page_UserFeedbackReplyVO_';
import type { UserFeedbackReplyAddRequest } from '../models/UserFeedbackReplyAddRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserFeedbackReplyControllerService {
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
            url: '/api/user-feedback-replies',
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
            url: '/api/user-feedback-replies',
            body: userFeedbackReplyAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listReplyByPage
     * @param current
     * @param feedbackId
     * @param isRead
     * @param pageSize
     * @param senderId
     * @param senderRole
     * @param sortField
     * @param sortOrder
     * @returns BaseResponse_Page_UserFeedbackReplyVO_ OK
     * @throws ApiError
     */
    public static listReplyByPageUsingGet(
        current?: number,
        feedbackId?: number,
        isRead?: number,
        pageSize?: number,
        senderId?: number,
        senderRole?: number,
        sortField?: string,
        sortOrder?: string,
    ): CancelablePromise<BaseResponse_Page_UserFeedbackReplyVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user-feedback-replies/page',
            query: {
                'current': current,
                'feedbackId': feedbackId,
                'isRead': isRead,
                'pageSize': pageSize,
                'senderId': senderId,
                'senderRole': senderRole,
                'sortField': sortField,
                'sortOrder': sortOrder,
            },
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
    public static markAsReadUsingPut(
        replyId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/user-feedback-replies/{replyId}/read',
            path: {
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
