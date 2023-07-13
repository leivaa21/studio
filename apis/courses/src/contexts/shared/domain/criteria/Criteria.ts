import { Filters } from './Filters';
import { Order } from './Order';

export class Criteria {
  constructor(
    public readonly filters: Filters,
    public readonly order: Order,
    public readonly limit?: number,
    public readonly offset?: number
  ) {}

  public hasFilters(): boolean {
    return this.filters.filters.length > 0;
  }
}
