/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AiAvatarChatRequest } from '../models/AiAvatarChatRequest.ts';
import type { BaseResponse_AiAvatarChatVO_ } from '../models/BaseResponse_AiAvatarChatVO_.ts';
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_.ts';
import type { BaseResponse_List_string_ } from '../models/BaseResponse_List_string_.ts';
import type { BaseResponse_Page_AiAvatarChatVO_ } from '../models/BaseResponse_Page_AiAvatarChatVO_.ts';
import type { CancelablePromise } from '../core/CancelablePromise.ts';
import { OpenAPI } from '../core/OpenAPI.ts';
import { request as __request } from '../core/request.ts';
export class AiAvatarChatControllerService {
  /**
   * clearChatHistory
   * @param aiAvatarId aiAvatarId
   * @param sessionId sessionId
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static clearChatHistoryUsingPost(
    aiAvatarId: number,
    sessionId?: string,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/ai/chat/clear',
      query: {
        aiAvatarId: aiAvatarId,
        sessionId: sessionId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getChatHistory
   * @param aiAvatarId aiAvatarId
   * @param sessionId sessionId
   * @param current current
   * @param size size
   * @returns BaseResponse_Page_AiAvatarChatVO_ OK
   * @throws ApiError
   */
  public static getChatHistoryUsingGet(
    aiAvatarId: number,
    sessionId: string,
    current: number = 1,
    size: number = 20,
  ): CancelablePromise<BaseResponse_Page_AiAvatarChatVO_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/ai/chat/history',
      query: {
        aiAvatarId: aiAvatarId,
        current: current,
        sessionId: sessionId,
        size: size,
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
   * @param chatRequest chatRequest
   * @returns BaseResponse_AiAvatarChatVO_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static sendMessageUsingPost(
    chatRequest: AiAvatarChatRequest,
  ): CancelablePromise<BaseResponse_AiAvatarChatVO_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/ai/chat/send',
      body: chatRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getSessionList
   * @param aiAvatarId aiAvatarId
   * @returns BaseResponse_List_string_ OK
   * @throws ApiError
   */
  public static getSessionListUsingGet(
    aiAvatarId: number,
  ): CancelablePromise<BaseResponse_List_string_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/ai/chat/sessions',
      query: {
        aiAvatarId: aiAvatarId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
}
