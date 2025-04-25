/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CourseChapter } from './CourseChapter.ts';
import type { OrderItem } from './OrderItem.ts';
export type Page_CourseChapter_ = {
  countId?: string;
  current?: number;
  maxLimit?: number;
  optimizeCountSql?: boolean;
  orders?: Array<OrderItem>;
  pages?: number;
  records?: Array<CourseChapter>;
  searchCount?: boolean;
  size?: number;
  total?: number;
};
