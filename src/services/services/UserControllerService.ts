/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_.ts';
import type { BaseResponse_LoginUserVO_ } from '../models/BaseResponse_LoginUserVO_.ts';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_.ts';
import type { BaseResponse_Page_User_ } from '../models/BaseResponse_Page_User_.ts';
import type { BaseResponse_Page_UserVO_ } from '../models/BaseResponse_Page_UserVO_.ts';
import type { BaseResponse_User_ } from '../models/BaseResponse_User_.ts';
import type { BaseResponse_UserVO_ } from '../models/BaseResponse_UserVO_.ts';
import type { DeleteRequest_1 } from '../models/DeleteRequest_1.ts';
import type { UserAddRequest } from '../models/UserAddRequest.ts';
import type { UserLoginByPhoneRequest } from '../models/UserLoginByPhoneRequest.ts';
import type { UserLoginRequest } from '../models/UserLoginRequest.ts';
import type { UserQueryRequest } from '../models/UserQueryRequest.ts';
import type { UserRegisterByPhoneRequest } from '../models/UserRegisterByPhoneRequest.ts';
import type { UserRegisterRequest } from '../models/UserRegisterRequest.ts';
import type { UserUpdateMyRequest } from '../models/UserUpdateMyRequest.ts';
import type { UserUpdateRequest } from '../models/UserUpdateRequest.ts';
import type { CancelablePromise } from '../core/CancelablePromise.ts';
import { OpenAPI } from '../core/OpenAPI.ts';
import { request as __request } from '../core/request.ts';
export class UserControllerService {
  /**
   * addUser
   * @param userAddRequest userAddRequest
   * @returns BaseResponse_long_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static addUserUsingPost(
    userAddRequest: UserAddRequest,
  ): CancelablePromise<BaseResponse_long_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/add',
      body: userAddRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * deleteUser
   * @param deleteRequest deleteRequest
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static deleteUserUsingPost(
    deleteRequest: DeleteRequest_1,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/delete',
      body: deleteRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getUserById
   * @param id id
   * @returns BaseResponse_User_ OK
   * @throws ApiError
   */
  public static getUserByIdUsingGet(
    id?: number,
  ): CancelablePromise<BaseResponse_User_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/user/get',
      query: {
        id: id,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getLoginUser
   * @returns BaseResponse_LoginUserVO_ OK
   * @throws ApiError
   */
  public static getLoginUserUsingGet(): CancelablePromise<BaseResponse_LoginUserVO_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/user/get/login',
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getUserVOById
   * @param id id
   * @returns BaseResponse_UserVO_ OK
   * @throws ApiError
   */
  public static getUserVoByIdUsingGet(
    id?: number,
  ): CancelablePromise<BaseResponse_UserVO_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/user/get/vo',
      query: {
        id: id,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * listUserByPage
   * @param userQueryRequest userQueryRequest
   * @returns BaseResponse_Page_User_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static listUserByPageUsingPost(
    userQueryRequest: UserQueryRequest,
  ): CancelablePromise<BaseResponse_Page_User_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/list/page',
      body: userQueryRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * listUserVOByPage
   * @param userQueryRequest userQueryRequest
   * @returns BaseResponse_Page_UserVO_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static listUserVoByPageUsingPost(
    userQueryRequest: UserQueryRequest,
  ): CancelablePromise<BaseResponse_Page_UserVO_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/list/page/vo',
      body: userQueryRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * userLogin
   * @param userLoginRequest userLoginRequest
   * @returns BaseResponse_LoginUserVO_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static userLoginUsingPost(
    userLoginRequest: UserLoginRequest,
  ): CancelablePromise<BaseResponse_LoginUserVO_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/login',
      body: userLoginRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * userLoginByPhone
   * @param userLoginByPhoneRequest userLoginByPhoneRequest
   * @returns BaseResponse_LoginUserVO_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static userLoginByPhoneUsingPost(
    userLoginByPhoneRequest: UserLoginByPhoneRequest,
  ): CancelablePromise<BaseResponse_LoginUserVO_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/login/phone',
      body: userLoginByPhoneRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * userLoginByWxOpen
   * @param code code
   * @returns BaseResponse_LoginUserVO_ OK
   * @throws ApiError
   */
  public static userLoginByWxOpenUsingGet(
    code: string,
  ): CancelablePromise<BaseResponse_LoginUserVO_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/user/login/wx_open',
      query: {
        code: code,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * userLogout
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static userLogoutUsingPost(): CancelablePromise<
    BaseResponse_boolean_ | any
  > {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/logout',
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * userRegister
   * @param userRegisterRequest userRegisterRequest
   * @returns BaseResponse_long_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static userRegisterUsingPost(
    userRegisterRequest: UserRegisterRequest,
  ): CancelablePromise<BaseResponse_long_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/register',
      body: userRegisterRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * userRegisterByPhone
   * @param userRegisterByPhoneRequest userRegisterByPhoneRequest
   * @returns BaseResponse_long_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static userRegisterByPhoneUsingPost(
    userRegisterByPhoneRequest: UserRegisterByPhoneRequest,
  ): CancelablePromise<BaseResponse_long_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/register/phone',
      body: userRegisterByPhoneRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * updateUser
   * @param userUpdateRequest userUpdateRequest
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static updateUserUsingPost(
    userUpdateRequest: UserUpdateRequest,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/update',
      body: userUpdateRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * updateMyUser
   * @param userUpdateMyRequest userUpdateMyRequest
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static updateMyUserUsingPost(
    userUpdateMyRequest: UserUpdateMyRequest,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/update/my',
      body: userUpdateMyRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
}
