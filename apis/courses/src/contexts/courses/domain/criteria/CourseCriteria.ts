import { Criteria } from '../../../shared/domain/criteria/Criteria';
import { FilterAsPrimitives } from '../../../shared/domain/criteria/Filter';
import { Operator } from '../../../shared/domain/criteria/FilterOperator';
import { Filters } from '../../../shared/domain/criteria/Filters';
import { Order } from '../../../shared/domain/criteria/Order';
import { AuthorId } from '../AuthorId';
import { CourseId } from '../CourseId';

interface PossibleCourseFilters {
  includingOnTitle?: string;
  havingTags?: string[];
}

export class CourseCriteria extends Criteria {
  constructor(args: {
    filters: Filters;
    order: Order;
    limit?: number;
    offset?: number;
  }) {
    super(args.filters, args.order, args.limit, args.offset);
  }

  static fromAuthorWithFilters({
    authorId,
    filters,
  }: {
    authorId: AuthorId;
    filters: PossibleCourseFilters;
  }): CourseCriteria {
    const criteriaFilters: FilterAsPrimitives[] = [
      { field: 'authorId', operator: Operator.EQUAL, value: authorId.value },
    ];

    if (filters.includingOnTitle) {
      criteriaFilters.push({
        field: 'title',
        operator: Operator.CONTAINS,
        value: filters.includingOnTitle,
      });
    }

    if (filters.havingTags?.length) {
      criteriaFilters.push({
        field: 'tags',
        operator: Operator.INCLUDES,
        value: filters.havingTags,
      });
    }

    return new CourseCriteria({
      filters: Filters.fromValues(criteriaFilters),
      order: Order.desc('updatedAt'),
    });
  }

  static publishedCoursesFiltered({
    filters,
  }: {
    filters: PossibleCourseFilters;
  }): CourseCriteria {
    const criteriaFilters: FilterAsPrimitives[] = [
      { field: 'publishedAt', operator: Operator.EXISTS, value: true },
    ];

    if (filters.includingOnTitle) {
      criteriaFilters.push({
        field: 'title',
        operator: Operator.CONTAINS,
        value: filters.includingOnTitle,
      });
    }

    if (filters.havingTags?.length) {
      criteriaFilters.push({
        field: 'tags',
        operator: Operator.INCLUDES,
        value: filters.havingTags,
      });
    }

    return new CourseCriteria({
      filters: Filters.fromValues(criteriaFilters),
      order: Order.desc('publishedAt'),
    });
  }

  static subscribedCoursesFiltered({
    courseIds,
    filters,
  }: {
    courseIds: CourseId[];
    filters: PossibleCourseFilters;
  }) {
    const criteriaFilters: FilterAsPrimitives[] = [
      {
        field: '_id',
        operator: Operator.INCLUDES,
        value: courseIds.map((courseId) => courseId.value),
      },
    ];

    if (filters.includingOnTitle) {
      criteriaFilters.push({
        field: 'title',
        operator: Operator.CONTAINS,
        value: filters.includingOnTitle,
      });
    }

    if (filters.havingTags?.length) {
      criteriaFilters.push({
        field: 'tags',
        operator: Operator.INCLUDES,
        value: filters.havingTags,
      });
    }

    return new CourseCriteria({
      filters: Filters.fromValues(criteriaFilters),
      order: Order.desc('publishedAt'),
    });
  }
}
