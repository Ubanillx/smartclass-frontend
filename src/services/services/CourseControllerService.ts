/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Course } from '../models/Course.ts';
import type { IPage_Course_ } from '../models/IPage_Course_.ts';
import type { CancelablePromise } from '../core/CancelablePromise.ts';
import { OpenAPI } from '../core/OpenAPI.ts';
import { request as __request } from '../core/request.ts';
export class CourseControllerService {
  /**
   * createCourse
   * @param course course
   * @returns number OK
   * @returns any Created
   * @throws ApiError
   */
  public static createCourseUsingPost(
    course: Course,
  ): CancelablePromise<number | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/api/courses/create',
      body: course,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * deleteCourse
   * @param courseId courseId
   * @returns boolean OK
   * @returns any Created
   * @throws ApiError
   */
  public static deleteCourseUsingPost(
    courseId: number,
  ): CancelablePromise<boolean | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/api/courses/delete',
      query: {
        courseId: courseId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getCourseById
   * @param courseId courseId
   * @returns Course OK
   * @throws ApiError
   */
  public static getCourseByIdUsingGet(
    courseId: number,
  ): CancelablePromise<Course> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/api/courses/get',
      query: {
        courseId: courseId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * pageCourses
   * @param adminId
   * @param categoryId
   * @param courseType
   * @param coverImage
   * @param createTime
   * @param description
   * @param difficulty
   * @param id
   * @param isDelete
   * @param objectives
   * @param originalPrice
   * @param price
   * @param ratingCount
   * @param ratingScore
   * @param requirements
   * @param status
   * @param studentCount
   * @param subtitle
   * @param tags
   * @param targetAudience
   * @param teacherId
   * @param title
   * @param totalChapters
   * @param totalDuration
   * @param totalSections
   * @param updateTime
   * @param current current
   * @param size size
   * @returns IPage_Course_ OK
   * @throws ApiError
   */
  public static pageCoursesUsingGet(
    adminId?: number,
    categoryId?: number,
    courseType?: number,
    coverImage?: string,
    createTime?: string,
    description?: string,
    difficulty?: number,
    id?: number,
    isDelete?: number,
    objectives?: string,
    originalPrice?: number,
    price?: number,
    ratingCount?: number,
    ratingScore?: number,
    requirements?: string,
    status?: number,
    studentCount?: number,
    subtitle?: string,
    tags?: string,
    targetAudience?: string,
    teacherId?: number,
    title?: string,
    totalChapters?: number,
    totalDuration?: number,
    totalSections?: number,
    updateTime?: string,
    current: number = 1,
    size: number = 10,
  ): CancelablePromise<IPage_Course_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/api/courses/page',
      query: {
        adminId: adminId,
        categoryId: categoryId,
        courseType: courseType,
        coverImage: coverImage,
        createTime: createTime,
        description: description,
        difficulty: difficulty,
        id: id,
        isDelete: isDelete,
        objectives: objectives,
        originalPrice: originalPrice,
        price: price,
        ratingCount: ratingCount,
        ratingScore: ratingScore,
        requirements: requirements,
        status: status,
        studentCount: studentCount,
        subtitle: subtitle,
        tags: tags,
        targetAudience: targetAudience,
        teacherId: teacherId,
        title: title,
        totalChapters: totalChapters,
        totalDuration: totalDuration,
        totalSections: totalSections,
        updateTime: updateTime,
        current: current,
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
   * updateCourse
   * @param course course
   * @returns boolean OK
   * @returns any Created
   * @throws ApiError
   */
  public static updateCourseUsingPost(
    course: Course,
  ): CancelablePromise<boolean | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/api/courses/update',
      body: course,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * updateCourseStatus
   * @param courseId courseId
   * @param status status
   * @returns boolean OK
   * @returns any Created
   * @throws ApiError
   */
  public static updateCourseStatusUsingPost(
    courseId: number,
    status: number,
  ): CancelablePromise<boolean | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/api/courses/updateStatus',
      query: {
        courseId: courseId,
        status: status,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
}
