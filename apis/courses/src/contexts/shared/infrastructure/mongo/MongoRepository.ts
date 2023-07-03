import { AggregateRoot } from '../../domain/AggregateRoot';
import { EntitySchemaFactory } from './EntitySchemaFactory';

export abstract class MongoRepository<TSchema, TEntity extends AggregateRoot> {
  constructor(
    protected readonly entitySchemaFactory: EntitySchemaFactory<
      TSchema,
      TEntity
    >
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract model(): any; // Deberia de ser un Model<TSchema>

  protected async persist(id: string, entity: TEntity) {
    const document = this.entitySchemaFactory.createSchemaFromEntity(entity);
    await this.model().updateOne({ _id: id }, document, { upsert: true });
  }
}
