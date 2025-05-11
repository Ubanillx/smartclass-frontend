/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_int_ } from '../models/BaseResponse_int_';
import type { BaseResponse_List_PrivateChatSessionVO_ } from '../models/BaseResponse_List_PrivateChatSessionVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Map_string_object_ } from '../models/BaseResponse_Map_string_object_';
import type { BaseResponse_Page_PrivateMessageVO_ } from '../models/BaseResponse_Page_PrivateMessageVO_';
import type { BaseResponse_PrivateChatSessionVO_ } from '../models/BaseResponse_PrivateChatSessionVO_';
import type { PrivateChatSessionAddRequest } from '../models/PrivateChatSessionAddRequest';
import type { PrivateMessageAddRequest } from '../models/PrivateMessageAddRequest';
import type { SseEmitter } from '../models/SseEmitter';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChatControllerService {
    /**
     * connect
     * @returns SseEmitter OK
     * @throws ApiError
     */
    public static connectUsingGet(): CancelablePromise<SseEmitter> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/private-chat/connect',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * disconnect
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static disconnectUsingPost(): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/private-chat/disconnect',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * markMessagesAsRead
     * @param messageIds messageIds
     * @param sessionId sessionId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static markMessagesAsReadUsingPost(
        messageIds: Array<number>,
        sessionId?: string,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        console.log(`API调用: 批量标记消息已读, messageIds=${messageIds.join(',')}, sessionId=${sessionId}`);
        try {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/private-chat/messages/batch/read',
                query: {
                    'sessionId': sessionId,
                },
                body: messageIds,
                errors: {
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                },
            });
        } catch (error) {
            console.error(`批量标记消息已读API错误: messageIds=${messageIds.join(',')}, sessionId=${sessionId}`, error);
            throw error;
        }
    }
    /**
     * markAllMessagesAsRead
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static markAllMessagesAsReadUsingPost(): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/private-chat/messages/read/all',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * markMessageAsRead
     * @param messageId messageId
     * @param sessionId sessionId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static markMessageAsReadUsingPost(
        messageId: number,
        sessionId?: string,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        console.log(`API调用: 标记消息已读, messageId=${messageId}, sessionId=${sessionId}`);
        try {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/private-chat/messages/{messageId}/read',
                path: {
                    'messageId': messageId,
                },
                query: {
                    'sessionId': sessionId,
                },
                errors: {
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                },
            });
        } catch (error) {
            console.error(`标记消息已读API错误: messageId=${messageId}, sessionId=${sessionId}`, error);
            throw error;
        }
    }
    /**
     * sendSystemNotification
     * @param content content
     * @param data data
     * @param userId userId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendSystemNotificationUsingPost(
        content: string,
        data?: any,
        userId?: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/private-chat/notify',
            query: {
                'content': content,
                'data': data,
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
     * sendMessage
     * @param privateMessageAddRequest privateMessageAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendMessageUsingPost1(
        privateMessageAddRequest: PrivateMessageAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/private-chat/send',
            body: privateMessageAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * createSession
     * @param request request
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static createSessionUsingPost1(
        request: PrivateChatSessionAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/private-chat/sessions',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listUserSessions
     * @param userId userId
     * @returns BaseResponse_List_PrivateChatSessionVO_ OK
     * @throws ApiError
     */
    public static listUserSessionsUsingGet(
        userId?: number,
    ): CancelablePromise<BaseResponse_List_PrivateChatSessionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/private-chat/sessions/list',
            query: {
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
     * getSessionWithUser
     * @param targetUserId targetUserId
     * @returns BaseResponse_PrivateChatSessionVO_ OK
     * @throws ApiError
     */
    public static getSessionWithUserUsingGet(
        targetUserId: number,
    ): CancelablePromise<BaseResponse_PrivateChatSessionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/private-chat/sessions/users/{targetUserId}',
            path: {
                'targetUserId': targetUserId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listSessionMessages
     * @param sessionId sessionId
     * @param current current
     * @param size size
     * @returns BaseResponse_Page_PrivateMessageVO_ OK
     * @throws ApiError
     */
    public static listSessionMessagesUsingGet(
        sessionId: number,
        current: number = 1,
        size: number = 20,
    ): CancelablePromise<BaseResponse_Page_PrivateMessageVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/private-chat/sessions/{sessionId}/messages',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'current': current,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * markSessionMessagesAsRead
     * @param sessionId sessionId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static markSessionMessagesAsReadUsingPost(
        sessionId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/private-chat/sessions/{sessionId}/read/all',
            path: {
                'sessionId': sessionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getSessionUnreadCount
     * @param sessionId sessionId
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getSessionUnreadCountUsingGet(
        sessionId: number,
    ): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/private-chat/sessions/{sessionId}/unread/count',
            path: {
                'sessionId': sessionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getChatStatus
     * @returns BaseResponse_Map_string_object_ OK
     * @throws ApiError
     */
    public static getChatStatusUsingGet(): CancelablePromise<BaseResponse_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/private-chat/status',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getTotalUnreadCount
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getTotalUnreadCountUsingGet(): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/private-chat/unread/count',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
