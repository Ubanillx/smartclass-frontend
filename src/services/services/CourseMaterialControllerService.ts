/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_CourseMaterial_ } from '../models/BaseResponse_CourseMaterial_';
import type { BaseResponse_List_CourseMaterial_ } from '../models/BaseResponse_List_CourseMaterial_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_CourseMaterial_ } from '../models/BaseResponse_Page_CourseMaterial_';
import type { CourseMaterial } from '../models/CourseMaterial';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CourseMaterialControllerService {
    /**
     * addMaterial
     * @param courseMaterial courseMaterial
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addMaterialUsingPost(
        courseMaterial: CourseMaterial,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/material/add',
            body: courseMaterial,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteMaterial
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteMaterialUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/material/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * incrementDownloadCount
     * @param materialId materialId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static incrementDownloadCountUsingPost(
        materialId?: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/material/download/count',
            query: {
                'materialId': materialId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getMaterialById
     * @param id id
     * @returns BaseResponse_CourseMaterial_ OK
     * @throws ApiError
     */
    public static getMaterialByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_CourseMaterial_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/material/get',
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
     * listMaterialsByCourse
     * @param courseId courseId
     * @returns BaseResponse_List_CourseMaterial_ OK
     * @throws ApiError
     */
    public static listMaterialsByCourseUsingGet(
        courseId?: number,
    ): CancelablePromise<BaseResponse_List_CourseMaterial_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/material/list',
            query: {
                'courseId': courseId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listMaterialsByPage
     * @param courseId courseId
     * @param current current
     * @param pageSize pageSize
     * @returns BaseResponse_Page_CourseMaterial_ OK
     * @throws ApiError
     */
    public static listMaterialsByPageUsingGet(
        courseId?: number,
        current?: number,
        pageSize?: number,
    ): CancelablePromise<BaseResponse_Page_CourseMaterial_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/material/list/page',
            query: {
                'courseId': courseId,
                'current': current,
                'pageSize': pageSize,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateMaterial
     * @param courseMaterial courseMaterial
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateMaterialUsingPost(
        courseMaterial: CourseMaterial,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/material/update',
            body: courseMaterial,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateMaterialFile
     * @param file file
     * @param materialId materialId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateMaterialFileUsingPost(
        file: Blob,
        materialId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/material/update/file',
            query: {
                'materialId': materialId,
            },
            formData: {
                'file': file,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * uploadAndAddMaterial
     * @param courseId courseId
     * @param file file
     * @param title title
     * @param description description
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static uploadAndAddMaterialUsingPost(
        courseId: number,
        file: Blob,
        title: string,
        description?: string,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/material/upload',
            query: {
                'courseId': courseId,
                'description': description,
                'title': title,
            },
            formData: {
                'file': file,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
