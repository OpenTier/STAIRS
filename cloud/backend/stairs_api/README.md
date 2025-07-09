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