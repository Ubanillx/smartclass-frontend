/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItem } from './OrderItem.ts';
import type { UserLearningRecordVO } from './UserLearningRecordVO.ts';
export type Page_UserLearningRecordVO_ = {
  countId?: string;
  current?: number;
  maxLimit?: number;
  optimizeCountSql?: boolean;
  orders?: Array<OrderItem>;
  pages?: number;
  records?: Array<UserLearningRecordVO>;
  searchCount?: boolean;
  size?: number;
  total?: number;
};
