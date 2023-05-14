import mongoose from 'mongoose';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import { connectToMongo } from '../../../src/api/mongo/connection';

const MONGO_PORT = 27017;

export const initializeMongoContainer =
  async (): Promise<StartedTestContainer> => {
    const mongoContainer = await new GenericContainer('mongo')
      .withExposedPorts(MONGO_PORT)
      .withWaitStrategy(Wait.forLogMessage(/Waiting for connections/))
      .start();

    return mongoContainer;
  };

export async function connectMongooseToContainer(
  container: StartedTestContainer
) {
  const uri = `mongodb://${container.getHost()}:${container.getMappedPort(
    MONGO_PORT
  )}`;
  await connectToMongo({ uri });
}

export async function disconnectMongoTest() {
  await mongoose.disconnect();
}
