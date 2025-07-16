<!--
Copyright (c) 2025 by OpenTier GmbH
SPDX‑FileCopyrightText: 2025 OpenTier GmbH
SPDX‑License‑Identifier: MIT

This file is part of OpenTier.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->

# STAIRS API
## Description
This service is responsible for providing REST APIs to abstract and access STAIRS. Currently provided features:
1. Read telemetry data and metrics send from devices
2. Issue remote commands to the devices
3. Provision devices and activate / deactivate them
## REST APIs
* Go to http://localhost:3001/docs for Swagger documentation of endpoints.
* You can try these endpoints from that documentation as well.
## Security
* Basic authentication is implemented as described in [Nest.js documentation](https://docs.nestjs.com/security/authentication)
* Sequence:
    * Clients will start by authenticating with a username and password (through `/auth/login` endpoint).
    * Once authenticated, the server will issue a **JWT** that can be sent as a **bearer token** in an authorization header on subsequent requests to prove authentication.
    * We protected the write API routes (POST / PUT / PATCH / DELETE) accessible only to requests that contain a valid JWT and left the GET APIs without authentication for simplicity.
* Notes:
    * For our demonstration, the `UsersService` simply maintains a hard-coded in-memory list of users, and a find method to retrieve one by username. In a real app, this data is persisted in a database.
    * We configured the token to expire in 5 mins.
* To disable this feature, set `AUTH_ENABLED: "false"` in `docker-compose.yaml`