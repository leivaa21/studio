import { Filter, FilterAsPrimitives } from './Filter';

export class Filters {
  readonly filters: Filter[];

  constructor(filters: Filter[]) {
    this.filters = filters;
  }

  static fromValues(filters: Array<FilterAsPrimitives>): Filters {
    return new Filters(filters.map(Filter.fromValues));
  }

  static none(): Filters {
    return new Filters([]);
  }
}
