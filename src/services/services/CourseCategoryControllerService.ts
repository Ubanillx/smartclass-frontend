/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_CourseCategory_ } from '../models/BaseResponse_CourseCategory_';
import type { BaseResponse_List_CourseCategory_ } from '../models/BaseResponse_List_CourseCategory_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { CourseCategory } from '../models/CourseCategory';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CourseCategoryControllerService {
    /**
     * addCategory
     * @param courseCategory courseCategory
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addCategoryUsingPost(
        courseCategory: CourseCategory,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/category/add',
            body: courseCategory,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteCategory
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteCategoryUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/category/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getCategoryById
     * @param id id
     * @returns BaseResponse_CourseCategory_ OK
     * @throws ApiError
     */
    public static getCategoryByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_CourseCategory_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/category/get',
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
     * getSubCategories
     * @param parentId parentId
     * @returns BaseResponse_List_CourseCategory_ OK
     * @throws ApiError
     */
    public static getSubCategoriesUsingGet(
        parentId: number,
    ): CancelablePromise<BaseResponse_List_CourseCategory_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/category/sub',
            query: {
                'parentId': parentId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getTopCategories
     * @returns BaseResponse_List_CourseCategory_ OK
     * @throws ApiError
     */
    public static getTopCategoriesUsingGet(): CancelablePromise<BaseResponse_List_CourseCategory_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/category/top',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateCategory
     * @param courseCategory courseCategory
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateCategoryUsingPost(
        courseCategory: CourseCategory,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/category/update',
            body: courseCategory,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getCategoryWithChildren
     * @param categoryId categoryId
     * @returns BaseResponse_List_CourseCategory_ OK
     * @throws ApiError
     */
    public static getCategoryWithChildrenUsingGet(
        categoryId: number,
    ): CancelablePromise<BaseResponse_List_CourseCategory_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/category/with-children',
            query: {
                'categoryId': categoryId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
