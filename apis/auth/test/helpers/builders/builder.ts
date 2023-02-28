import { AggregateRoot } from '../../contexts/shared/domain/AggregateRoot';

export interface Builder<Aggregate extends AggregateRoot> {
  build(): Aggregate;
}
