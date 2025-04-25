/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DailyWord } from './DailyWord.ts';
import type { OrderItem } from './OrderItem.ts';
export type Page_DailyWord_ = {
  countId?: string;
  current?: number;
  maxLimit?: number;
  optimizeCountSql?: boolean;
  orders?: Array<OrderItem>;
  pages?: number;
  records?: Array<DailyWord>;
  searchCount?: boolean;
  size?: number;
  total?: number;
};
