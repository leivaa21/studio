import { AggregateRoot } from '../../../src/contexts/shared/domain/AggregateRoot';

export interface Builder<Aggregate extends AggregateRoot> {
  build(): Aggregate;
}
