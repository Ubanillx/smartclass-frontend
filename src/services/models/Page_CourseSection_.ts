/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CourseSection } from './CourseSection.ts';
import type { OrderItem } from './OrderItem.ts';
export type Page_CourseSection_ = {
  countId?: string;
  current?: number;
  maxLimit?: number;
  optimizeCountSql?: boolean;
  orders?: Array<OrderItem>;
  pages?: number;
  records?: Array<CourseSection>;
  searchCount?: boolean;
  size?: number;
  total?: number;
};
