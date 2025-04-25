/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItem } from './OrderItem.ts';
import type { TeacherVO } from './TeacherVO.ts';
export type Page_TeacherVO_ = {
  countId?: string;
  current?: number;
  maxLimit?: number;
  optimizeCountSql?: boolean;
  orders?: Array<OrderItem>;
  pages?: number;
  records?: Array<TeacherVO>;
  searchCount?: boolean;
  size?: number;
  total?: number;
};
