/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_WebSocketConfigVO_ } from '../models/BaseResponse_WebSocketConfigVO_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebSocketService {
    /**
     * 获取WebSocket配置
     * 返回WebSocket服务器配置信息，用于客户端连接
     * @returns BaseResponse_WebSocketConfigVO_ OK
     * @throws ApiError
     */
    public static getWebSocketConfigUsingGet(): CancelablePromise<BaseResponse_WebSocketConfigVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/websocket/config',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取WebSocket配置(旧版)
     * 旧版配置获取方式，保留向后兼容
     * @returns BaseResponse_WebSocketConfigVO_ OK
     * @throws ApiError
     */
    public static getOldWebSocketConfigUsingGet(): CancelablePromise<BaseResponse_WebSocketConfigVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/websocket/old-config',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
