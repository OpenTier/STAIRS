// @ts-check
import { test, expect } from '@playwright/test';

test('basic test', async ({ request }) => {
  const response = await request.get('http://localhost:3001/devices');
  console.log('Response status:', response.status());
  expect(response.status()).toBe(200);
});
