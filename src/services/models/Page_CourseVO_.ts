/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CourseVO } from './CourseVO.ts';
import type { OrderItem } from './OrderItem.ts';
export type Page_CourseVO_ = {
  countId?: string;
  current?: number;
  maxLimit?: number;
  optimizeCountSql?: boolean;
  orders?: Array<OrderItem>;
  pages?: number;
  records?: Array<CourseVO>;
  searchCount?: boolean;
  size?: number;
  total?: number;
};
