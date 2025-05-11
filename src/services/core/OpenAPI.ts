/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from './ApiRequestOptions';

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;
type Headers = Record<string, string>;

export type OpenAPIConfig = {
    BASE: string;
    VERSION: string;
    WITH_CREDENTIALS: boolean;
    CREDENTIALS: 'include' | 'omit' | 'same-origin';
    TOKEN?: string | Resolver<string> | undefined;
    USERNAME?: string | Resolver<string> | undefined;
    PASSWORD?: string | Resolver<string> | undefined;
    HEADERS?: Headers | Resolver<Headers> | undefined;
    ENCODE_PATH?: ((path: string) => string) | undefined;
};

// 根据当前环境确定API基础URL
const isDevelopment = import.meta.env.MODE === 'development';
// 在开发环境中使用/api作为前缀，在生产环境中不使用前缀，因为OpenAPI生成的服务路径已经包含/api前缀
const API_BASE = isDevelopment
  ? '/api' // 开发环境使用/api前缀，会被代理到后端服务器
  : (import.meta.env.VITE_APP_PROD_API_BASE_URL || 'http://backend.smartclass.ubanillx.cn:8081');

// 只在开发环境中输出调试信息
if (isDevelopment) {
  console.log('OpenAPI - 当前环境:', import.meta.env.MODE);
  console.log('OpenAPI - 使用的API基础URL:', API_BASE);
}

export const OpenAPI: OpenAPIConfig = {
    BASE: API_BASE,
    VERSION: '1.0',
    WITH_CREDENTIALS: true,
    CREDENTIALS: 'include',
    TOKEN: undefined,
    USERNAME: undefined,
    PASSWORD: undefined,
    HEADERS: undefined,
    ENCODE_PATH: undefined,
};
