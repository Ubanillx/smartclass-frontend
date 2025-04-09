/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_.ts';
import type { BaseResponse_List_UserLevelVO_ } from '../models/BaseResponse_List_UserLevelVO_.ts';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_.ts';
import type { BaseResponse_Page_UserLevel_ } from '../models/BaseResponse_Page_UserLevel_.ts';
import type { BaseResponse_Page_UserLevelVO_ } from '../models/BaseResponse_Page_UserLevelVO_.ts';
import type { BaseResponse_UserLevel_ } from '../models/BaseResponse_UserLevel_.ts';
import type { BaseResponse_UserLevelVO_ } from '../models/BaseResponse_UserLevelVO_.ts';
import type { DeleteRequest_1 } from '../models/DeleteRequest_1.ts';
import type { UserLevelAddRequest } from '../models/UserLevelAddRequest.ts';
import type { UserLevelQueryRequest } from '../models/UserLevelQueryRequest.ts';
import type { UserLevelUpdateRequest } from '../models/UserLevelUpdateRequest.ts';
import type { CancelablePromise } from '../core/CancelablePromise.ts';
import { OpenAPI } from '../core/OpenAPI.ts';
import { request as __request } from '../core/request.ts';
export class UserLevelControllerService {
    /**
     * addUserLevel
     * @param userLevelAddRequest userLevelAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addUserLevelUsingPost(
        userLevelAddRequest: UserLevelAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/level/add',
            body: userLevelAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUserLevelByExperience
     * @param experience experience
     * @returns BaseResponse_UserLevelVO_ OK
     * @throws ApiError
     */
    public static getUserLevelByExperienceUsingGet(
        experience?: number,
    ): CancelablePromise<BaseResponse_UserLevelVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/level/by-experience',
            query: {
                'experience': experience,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteUserLevel
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteUserLevelUsingPost(
        deleteRequest: DeleteRequest_1,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/level/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUserLevelById
     * @param id id
     * @returns BaseResponse_UserLevel_ OK
     * @throws ApiError
     */
    public static getUserLevelByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_UserLevel_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/level/get',
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
     * getUserLevelVOById
     * @param id id
     * @returns BaseResponse_UserLevelVO_ OK
     * @throws ApiError
     */
    public static getUserLevelVoByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_UserLevelVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/level/get/vo',
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
     * getAllUserLevels
     * @returns BaseResponse_List_UserLevelVO_ OK
     * @throws ApiError
     */
    public static getAllUserLevelsUsingGet(): CancelablePromise<BaseResponse_List_UserLevelVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/level/list',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listUserLevelByPage
     * @param userLevelQueryRequest userLevelQueryRequest
     * @returns BaseResponse_Page_UserLevel_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listUserLevelByPageUsingPost(
        userLevelQueryRequest: UserLevelQueryRequest,
    ): CancelablePromise<BaseResponse_Page_UserLevel_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/level/list/page',
            body: userLevelQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listUserLevelVOByPage
     * @param userLevelQueryRequest userLevelQueryRequest
     * @returns BaseResponse_Page_UserLevelVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listUserLevelVoByPageUsingPost(
        userLevelQueryRequest: UserLevelQueryRequest,
    ): CancelablePromise<BaseResponse_Page_UserLevelVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/level/list/page/vo',
            body: userLevelQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getNextUserLevel
     * @param currentLevel currentLevel
     * @returns BaseResponse_UserLevelVO_ OK
     * @throws ApiError
     */
    public static getNextUserLevelUsingGet(
        currentLevel?: number,
    ): CancelablePromise<BaseResponse_UserLevelVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/level/next',
            query: {
                'currentLevel': currentLevel,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateUserLevel
     * @param userLevelUpdateRequest userLevelUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateUserLevelUsingPost(
        userLevelUpdateRequest: UserLevelUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/level/update',
            body: userLevelUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
