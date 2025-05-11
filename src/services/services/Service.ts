/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_List_Map_string_object_ } from '../models/BaseResponse_List_Map_string_object_';
import type { BaseResponse_Map_string_string_ } from '../models/BaseResponse_Map_string_string_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Service {
    /**
     * 导出Postman Collection
     * 生成可导入Postman的接口文档，包含REST和WebSocket接口
     * @returns any OK
     * @throws ApiError
     */
    public static generatePostmanCollectionUsingGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doc/postman-collection',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 动态生成Postman Collection
     * 实时生成最新的Postman Collection文件，包含最新的REST和WebSocket接口
     * @returns any OK
     * @throws ApiError
     */
    public static generateDynamicPostmanCollectionUsingGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doc/postman-collection-dynamic',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取服务器信息
     * 返回服务器Host、Port等信息，用于Postman配置
     * @returns BaseResponse_Map_string_string_ OK
     * @throws ApiError
     */
    public static getServerInfoUsingGet(): CancelablePromise<BaseResponse_Map_string_string_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doc/server-info',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取WebSocket接口列表
     * 返回所有注册的WebSocket消息类型及其接口定义
     * @returns BaseResponse_List_Map_string_object_ OK
     * @throws ApiError
     */
    public static getWebSocketEndpointsListUsingGet(): CancelablePromise<BaseResponse_List_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doc/websocket-endpoints',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
