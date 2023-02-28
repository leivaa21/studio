import 'dotenv/config';

const { MONGO_HOST, MONGO_DATABASE, MONGO_USER, MONGO_PASS } = process.env;

export default {
  host: MONGO_HOST || 'localhost',
  db: MONGO_DATABASE,
  user: MONGO_USER,
  pass: MONGO_PASS,
};
