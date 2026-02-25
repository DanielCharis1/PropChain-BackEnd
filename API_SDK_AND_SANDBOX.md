# API SDK Generation & Sandbox Instructions

## SDK Generation

You can generate SDKs for multiple languages using the OpenAPI spec produced by this backend. Example using OpenAPI Generator:

```
npx @openapitools/openapi-generator-cli generate -i http://localhost:3000/api-json -g typescript-axios -o ./sdk/typescript
npx @openapitools/openapi-generator-cli generate -i http://localhost:3000/api-json -g python -o ./sdk/python
npx @openapitools/openapi-generator-cli generate -i http://localhost:3000/api-json -g java -o ./sdk/java
```

- Replace the URL with your running Swagger/OpenAPI endpoint.
- See https://openapi-generator.tech/docs/generators for more languages and options.

## API Sandbox & Testing

- Use the built-in Swagger UI at `/api` for interactive API exploration and testing.
- Download the OpenAPI spec from `/api-json` for use in Postman or other tools.
- Example Postman collection can be generated from the OpenAPI spec.
- API key authentication and example requests are documented in Swagger UI.

## Versioning & Deprecation

- All endpoints are versioned (e.g., `/v1/users`).
- Deprecated endpoints will be marked in Swagger UI and changelog.

---

For more, see the developer portal or contact the API team.
