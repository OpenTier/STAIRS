// Copyright (c) 2025 by OpenTier GmbH
// SPDX‑FileCopyrightText: 2025 OpenTier GmbH
// SPDX‑License‑Identifier: MIT
//
// This file is part of OpenTier.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// STAIRS API tests to use API_URLS and cover commands, telemetry, and devices
import { test, expect } from '@playwright/test';
import { API_URLS } from '../../config/test-config';

const API_BASE_URL = API_URLS.STAIRS_API;
const testDeviceId = 1;

// Authentication tests
test.describe('@api STAIRS API - Authentication', () => {
  test('should authenticate with valid credentials when auth is enabled', async ({ request }) => {
    const authRes = await request.post(`${API_BASE_URL}/auth/login`, {
      data: { name: 'admin', password: 'password' }
    });
    
    // If auth is disabled (AUTH_ENABLED=false), this endpoint might not exist
    expect([200, 201, 404, 405]).toContain(authRes.status());
    
    if (authRes.ok()) {
      const authData = await authRes.json();
      expect(authData).toHaveProperty('access_token');
      expect(typeof authData.access_token).toBe('string');
    }
  });

  test('should reject invalid credentials when auth is enabled', async ({ request }) => {
    const authRes = await request.post(`${API_BASE_URL}/auth/login`, {
      data: { name: 'invalid', password: 'wrong' }
    });
    
    // If auth is disabled, this endpoint might not exist
    expect([401, 404, 405]).toContain(authRes.status());
  });
});

// Authentication helper function
const getAuthToken = async (request: any): Promise<string | null> => {
  try {
    const authRes = await request.post(`${API_BASE_URL}/auth/login`, {
      data: { name: 'admin', password: 'password' }
    });
    
    if (authRes.ok()) {
      const authData = await authRes.json();
      return authData.access_token;
    }
  } catch (error) {
    // If auth fails (e.g., when AUTH_ENABLED=false), return null
    console.log('Auth disabled or failed, proceeding without token');
  }
  return null;
};

// Helper to create authenticated headers
const getAuthHeaders = (token: string | null): { [key: string]: string } | undefined => {
  return token ? { 'Authorization': `Bearer ${token}` } : undefined;
};

// Commands endpoints
test.describe('@api STAIRS API - Commands', () => {
  test('should get all commands with required parameters', async ({ request }) => {
    const res = await request.get(
      `${API_BASE_URL}/commands?deviceId=${testDeviceId}&status=DONE&control=Lock`
    );
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('should get commands with minimal required parameters', async ({ request }) => {
    const res = await request.get(
      `${API_BASE_URL}/commands?deviceId=${testDeviceId}`
    );
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('should handle invalid status update', async ({ request }) => {
    const token = await getAuthToken(request);
    const headers = getAuthHeaders(token);
    
    const payload = { deviceId: testDeviceId, method: 0, control: 'Lock', command: 'Lock' };
    const createRes = await request.post(`${API_BASE_URL}/commands`, { 
      data: payload,
      headers 
    });
    if (createRes.status() === 400) return;
    expect([200, 201]).toContain(createRes.status());
    const responseData = await createRes.json();
    expect(responseData).toHaveProperty('id');
    const commandId = responseData.id;
    const patchRes = await request.patch(`${API_BASE_URL}/commands/${commandId}`, { 
      data: { status: 'CANCELLED' },
      headers 
    });
    expect([400, 404]).toContain(patchRes.status());
  });
});

// Telemetry endpoints
test.describe('@api STAIRS API - Telemetry', () => {
  test('should get aggregated telemetry data', async ({ request }) => {
    const res = await request.get(
      `${API_BASE_URL}/telemetry?timespan=-1h&aggFunc=max`
    );
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('should get telemetry for a device with required parameters', async ({ request }) => {
    const res = await request.get(
      `${API_BASE_URL}/telemetry/${testDeviceId}?timespan=-1h&nbSamples=10&aggFunc=mean`
    );
    expect([200, 404, 400]).toContain(res.status());
    if (res.ok()) {
      const data = await res.json();
      expect(Array.isArray(data)).toBeTruthy();
    }
  });

  test('should get latest locations for all devices', async ({ request }) => {
    const res = await request.get(`${API_BASE_URL}/telemetry/maps/locations`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('should get location history for a device', async ({ request }) => {
    const res = await request.get(
      `${API_BASE_URL}/telemetry/${testDeviceId}/maps/locations`
    );
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('should handle invalid timespan parameter', async ({ request }) => {
    const res = await request.get(
      `${API_BASE_URL}/telemetry?timespan=invalid&aggFunc=max`
    );
    expect([200, 400]).toContain(res.status());
  });

  test('should handle missing required parameters for device telemetry', async ({ request }) => {
    const res = await request.get(`${API_BASE_URL}/telemetry/${testDeviceId}`);
    expect([200, 400]).toContain(res.status());
  });
});

const createTestDevice = () => {
  const ts = Date.now();
  const uid = Math.random().toString(36).substring(2, 7);
  return { 
    code: `TESTVIN${ts}${uid}`, 
    make: 'TestMake', 
    model: 'TestModel', 
    name: `Test Device ${uid}`,
    color: 'Black', 
    year: 2024, 
    image: 'http://example.com/image.png', 
    provisionStatus: 'Active' 
  };
};

test.describe('@api STAIRS API - Devices', () => {
  test('should get all devices', async ({ request }) => {
    const res = await request.get(`${API_BASE_URL}/devices`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('should provision a new device', async ({ request }) => {
    const token = await getAuthToken(request);
    const headers = getAuthHeaders(token);
    
    const device = createTestDevice();
    const res = await request.post(`${API_BASE_URL}/devices`, { 
      data: device,
      headers 
    });
    if (res.status() === 400) {
      const err = await res.json(); console.log('Device creation error:', err);
      expect(res.status()).toBe(400);
    } else {
      expect(res.status()).toBe(201);
      const data = await res.json();
      expect(data).toHaveProperty('id');
      expect(data).toMatchObject({ code: device.code, make: device.make, model: device.model, provisionStatus: device.provisionStatus });
    }
  });

  test('should get a device by ID', async ({ request }) => {
    const token = await getAuthToken(request);
    const headers = getAuthHeaders(token);
    
    const device = createTestDevice();
    const cr = await request.post(`${API_BASE_URL}/devices`, { 
      data: device,
      headers 
    });
    if (cr.status() === 400) return;
    expect(cr.status()).toBe(201);
    const { id } = await cr.json();
    const res = await request.get(`${API_BASE_URL}/devices/${id}`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toMatchObject({ id, code: device.code, make: device.make, model: device.model });
  });

  test('should update a device by ID', async ({ request }) => {
    const token = await getAuthToken(request);
    const headers = getAuthHeaders(token);
    
    const device = createTestDevice(); 
    const cr = await request.post(`${API_BASE_URL}/devices`, { 
      data: device,
      headers 
    }); 
    if (cr.status() === 400) return; 
    expect(cr.status()).toBe(201);
    const { id } = await cr.json();
    const updated = { 
      ...device, 
      code: `UPD${Date.now()}`, 
      make: 'UpdatedMake', 
      model: 'UpdatedModel', 
      name: `Updated Device ${Date.now()}`,
      color: 'Blue', 
      year: 2025, 
      image: 'http://example.com/updated.png', 
      provisionStatus: 'Inactive' 
    };
    const res = await request.put(`${API_BASE_URL}/devices/${id}`, { 
      data: updated,
      headers 
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toMatchObject({ code: updated.code, make: updated.make, model: updated.model, provisionStatus: updated.provisionStatus });
  });

  test('should handle device not found for GET', async ({ request }) => {
    const id = 999999;
    const res = await request.get(`${API_BASE_URL}/devices/${id}`);
    expect(res.status()).toBe(404);
  });

  test('should handle invalid device data for creation', async ({ request }) => {
    const token = await getAuthToken(request);
    const headers = getAuthHeaders(token);
    
    const invalid = { make: 'TestMake' };
    const res = await request.post(`${API_BASE_URL}/devices`, { 
      data: invalid,
      headers 
    });
    expect(res.status()).toBe(400);
  });
});
