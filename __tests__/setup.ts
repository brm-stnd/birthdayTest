import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

import { Mongo } from '@config/mongo';
import { TestMongo } from './fixtures/mongo';

jest.setTimeout(600000);

// enable dayjs with timezone awareness
dayjs.extend(utc);
dayjs.extend(timezone);
// enable dayjs with custom parse format
dayjs.extend(customParseFormat);

// mocks app's start connection to prevent multiple attempt to connect to MongoDB
Mongo.startConnection = jest.fn();

beforeAll(async () => {
  await TestMongo.start();
});

beforeEach(async () => {
  await TestMongo.clearAll();
});

afterAll(async () => {
  await TestMongo.stop();
});
