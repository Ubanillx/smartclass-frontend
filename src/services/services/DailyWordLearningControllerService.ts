/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_.ts';
import type { BaseResponse_UserDailyWord_ } from '../models/BaseResponse_UserDailyWord_.ts';
import type { CancelablePromise } from '../core/CancelablePromise.ts';
import { OpenAPI } from '../core/OpenAPI.ts';
import { request as __request } from '../core/request.ts';
export class DailyWordLearningControllerService {
  /**
   * getUserDailyWord
   * @param wordId wordId
   * @returns BaseResponse_UserDailyWord_ OK
   * @throws ApiError
   */
  public static getUserDailyWordUsingGet(
    wordId: number,
  ): CancelablePromise<BaseResponse_UserDailyWord_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/daily/word/learning/get/{wordId}',
      path: {
        wordId: wordId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * markWordAsStudied
   * @param wordId wordId
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static markWordAsStudiedUsingPost1(
    wordId: number,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/daily/word/learning/mark-studied/{wordId}',
      path: {
        wordId: wordId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * saveWordNote
   * @param noteContent noteContent
   * @param wordId wordId
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static saveWordNoteUsingPost1(
    noteContent: string,
    wordId: number,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/daily/word/learning/save-note/{wordId}',
      path: {
        wordId: wordId,
      },
      query: {
        noteContent: noteContent,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * updateMasteryLevel
   * @param masteryLevel masteryLevel
   * @param wordId wordId
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static updateMasteryLevelUsingPost1(
    masteryLevel: number,
    wordId: number,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/daily/word/learning/update-mastery/{wordId}',
      path: {
        wordId: wordId,
      },
      query: {
        masteryLevel: masteryLevel,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
}
