import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as celery from 'celery-node';

describe('Celery Client', () => {
  it('call Celery Test', async () => {
    const broker = 'redis://localhost:6379/0';
    const client = celery.createClient(broker, broker);
    const task = client.createTask('core_test_add_task');
    const result = task.delay(100, 55);

    console.log('Result: ', result);
    expect(result).is.an('object');
  });
});
