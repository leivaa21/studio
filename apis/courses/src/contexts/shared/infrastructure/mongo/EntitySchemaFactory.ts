export interface EntitySchemaFactory<TSchema, TEntity> {
  createSchemaFromEntity(entity: TEntity): TSchema;
  createEntityFromSchema(schema: TSchema): TEntity;
}
