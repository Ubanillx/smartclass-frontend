/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_int_ } from '../models/BaseResponse_int_';
import type { BaseResponse_List_PrivateChatSessionVO_ } from '../models/BaseResponse_List_PrivateChatSessionVO_';
import type { BaseResponse_List_PrivateMessageVO_ } from '../models/BaseResponse_List_PrivateMessageVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_PrivateChatSession_ } from '../models/BaseResponse_Page_PrivateChatSession_';
import type { BaseResponse_Page_PrivateChatSessionVO_ } from '../models/BaseResponse_Page_PrivateChatSessionVO_';
import type { BaseResponse_Page_PrivateMessage_ } from '../models/BaseResponse_Page_PrivateMessage_';
import type { BaseResponse_Page_PrivateMessageVO_ } from '../models/BaseResponse_Page_PrivateMessageVO_';
import type { BaseResponse_PrivateChatSessionVO_ } from '../models/BaseResponse_PrivateChatSessionVO_';
import type { BaseResponse_WebSocketConfigVO_ } from '../models/BaseResponse_WebSocketConfigVO_';
import type { PrivateChatSessionAddRequest } from '../models/PrivateChatSessionAddRequest';
import type { PrivateChatSessionQueryRequest } from '../models/PrivateChatSessionQueryRequest';
import type { PrivateMessageAddRequest } from '../models/PrivateMessageAddRequest';
import type { PrivateMessageQueryRequest } from '../models/PrivateMessageQueryRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChatControllerService {
    /**
     * sendMessage
     * @param messageRequest messageRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendMessageUsingPost1(
        messageRequest: PrivateMessageAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/messages',
            body: messageRequest,
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
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static markMessagesAsReadUsingPost(
        messageIds: Array<number>,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/messages/batch/read',
            body: messageIds,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listMessagesByPage
     * @param messageQueryRequest messageQueryRequest
     * @returns BaseResponse_Page_PrivateMessage_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listMessagesByPageUsingPost(
        messageQueryRequest: PrivateMessageQueryRequest,
    ): CancelablePromise<BaseResponse_Page_PrivateMessage_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/messages/page',
            body: messageQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listMessageVOsByPage
     * @param messageQueryRequest messageQueryRequest
     * @returns BaseResponse_Page_PrivateMessageVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listMessageVOsByPageUsingPost(
        messageQueryRequest: PrivateMessageQueryRequest,
    ): CancelablePromise<BaseResponse_Page_PrivateMessageVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/messages/page/vo',
            body: messageQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
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
            url: '/api/chat/messages/read/all',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getRecentMessages
     * @returns BaseResponse_List_PrivateMessageVO_ OK
     * @throws ApiError
     */
    public static getRecentMessagesUsingGet(): CancelablePromise<BaseResponse_List_PrivateMessageVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/messages/recent',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUnreadMessages
     * @param current current
     * @param size size
     * @returns BaseResponse_Page_PrivateMessageVO_ OK
     * @throws ApiError
     */
    public static getUnreadMessagesUsingGet(
        current: number = 1,
        size: number = 20,
    ): CancelablePromise<BaseResponse_Page_PrivateMessageVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/messages/unread',
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
     * getMessagesBetweenUsers
     * @param userId userId
     * @param current current
     * @param size size
     * @returns BaseResponse_Page_PrivateMessageVO_ OK
     * @throws ApiError
     */
    public static getMessagesBetweenUsersUsingGet(
        userId: number,
        current: number = 1,
        size: number = 20,
    ): CancelablePromise<BaseResponse_Page_PrivateMessageVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/messages/users/{userId}',
            path: {
                'userId': userId,
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
     * markMessageAsRead
     * @param messageId messageId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static markMessageAsReadUsingPost(
        messageId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/messages/{messageId}/read',
            path: {
                'messageId': messageId,
            },
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
            url: '/api/chat/private-sessions',
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
            url: '/api/chat/sessions',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listSessionsByPage
     * @param request request
     * @returns BaseResponse_Page_PrivateChatSession_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listSessionsByPageUsingPost(
        request: PrivateChatSessionQueryRequest,
    ): CancelablePromise<BaseResponse_Page_PrivateChatSession_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/sessions/page',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listSessionVOsByPage
     * @param request request
     * @returns BaseResponse_Page_PrivateChatSessionVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listSessionVOsByPageUsingPost(
        request: PrivateChatSessionQueryRequest,
    ): CancelablePromise<BaseResponse_Page_PrivateChatSessionVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/sessions/page/vo',
            body: request,
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
            url: '/api/chat/sessions/users/{targetUserId}',
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
            url: '/api/chat/sessions/{sessionId}/messages',
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
            url: '/api/chat/sessions/{sessionId}/read/all',
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
            url: '/api/chat/sessions/{sessionId}/unread/count',
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
     * getTotalUnreadCount
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getTotalUnreadCountUsingGet(): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/unread/count',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getWebSocketConfig
     * @returns BaseResponse_WebSocketConfigVO_ OK
     * @throws ApiError
     */
    public static getWebSocketConfigUsingGet(): CancelablePromise<BaseResponse_WebSocketConfigVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/websocket/config',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
