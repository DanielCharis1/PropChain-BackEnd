## Scaling Strategies

### Vertical Scaling
- Increase CPU, RAM, and disk IOPS on the PostgreSQL server for higher throughput.
- Adjust `connection_limit` in the DATABASE_URL to match available resources.

### Horizontal Scaling
- Use read replicas for scaling read-heavy workloads. Configure Prisma to use replicas for read queries (future enhancement).
- For global scale, consider managed PostgreSQL services (e.g., AWS RDS, GCP Cloud SQL) with multi-region support.

### Connection Pool Tuning
- Tune `connection_limit` and `pool_timeout` in the DATABASE_URL for optimal pool size.
- Monitor active connections and adjust pool size as needed.

### Caching
- Use Redis for caching frequently accessed data and query results.
- Cache count queries and first-page results for large datasets.

### Partitioning and Sharding (Advanced)
- For very large tables, consider PostgreSQL table partitioning.
- Sharding is not natively supported by Prisma, but can be implemented at the application layer if needed.

### High Availability & Failover
- Use managed PostgreSQL with automatic failover and backups.
- Regularly test backup and restore procedures (see backup.sh and restore.sh).

### Monitoring
- Monitor query performance and slow queries using Prisma logs and PostgreSQL tools (pg_stat_statements).
- Set up external monitoring (e.g., Prometheus, Grafana) for database metrics.

// See SETUP.md for more performance and monitoring tips.
# PropChain Database Schema Documentation

## Overview

This document describes the complete PostgreSQL database schema for PropChain, including all entities, relationships, constraints, and indexes.

## Technology Stack

- **Database**: PostgreSQL 15+
- **ORM**: Prisma 5.x
- **Connection Pooling**: Prisma connection pool (configured via DATABASE_URL)

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────────┐       ┌───────────────┐
│    User     │───────│    Property     │───────│  Transaction  │
└─────────────┘       └─────────────────┘       └───────────────┘
      │                      │                         │
      │                      │                         │
      ▼                      ▼                         ▼
┌─────────────┐       ┌─────────────────┐       ┌───────────────┐
│    Role     │       │    Document     │◄──────│   Document    │
└─────────────┘       └─────────────────┘       └───────────────┘
      │
      ▼
┌─────────────┐       ┌─────────────────┐
│ Permission  │◄──────│ RolePermission  │
└─────────────┘       └─────────────────┘
```

## Models

### User

Primary user entity representing all platform participants.

| Field         | Type     | Constraints       | Description              |
| ------------- | -------- | ----------------- | ------------------------ |
| id            | String   | Primary Key, CUID | Unique identifier        |
| email         | String   | Unique, Not Null  | User email address       |
| walletAddress | String   | Unique, Nullable  | Ethereum wallet address  |
| role          | UserRole | Not Null, Default | User role enum           |
| roleId        | String   | Foreign Key       | Reference to Role entity |
| createdAt     | DateTime | Default: now()    | Creation timestamp       |
| updatedAt     | DateTime | Auto-updated      | Last update timestamp    |

**Indexes**: `email`, `walletAddress`, `role`, `createdAt`

**Relations**:

- One-to-Many: Properties (as owner)
- One-to-Many: Transactions (as recipient via walletAddress)
- One-to-Many: Documents (as uploader)
- Many-to-One: Role
- One-to-Many: RoleChangeLog

### Property

Real estate property listings.

| Field       | Type           | Constraints       | Description               |
| ----------- | -------------- | ----------------- | ------------------------- |
| id          | String         | Primary Key, CUID | Unique identifier         |
| title       | String         | Not Null          | Property title            |
| description | String         | Nullable          | Property description      |
| location    | String         | Not Null          | Property address/location |
| price       | Decimal        | Not Null          | Property price            |
| status      | PropertyStatus | Not Null, Default | Listing status            |
| ownerId     | String         | Foreign Key       | Reference to User (owner) |
| createdAt   | DateTime       | Default: now()    | Creation timestamp        |
| updatedAt   | DateTime       | Auto-updated      | Last update timestamp     |

**Indexes**: `ownerId`, `status`, `createdAt`, `location`

**Relations**:

- Many-to-One: User (owner) - CASCADE delete
- One-to-Many: Transactions
- One-to-Many: Documents

### Transaction

Blockchain transactions for property purchases and transfers.

| Field       | Type              | Constraints           | Description                 |
| ----------- | ----------------- | --------------------- | --------------------------- |
| id          | String            | Primary Key, CUID     | Unique identifier           |
| fromAddress | String            | Not Null              | Sender wallet address       |
| toAddress   | String            | Not Null              | Recipient wallet address    |
| amount      | Decimal           | Not Null              | Transaction amount          |
| txHash      | String            | Nullable              | Blockchain transaction hash |
| status      | TransactionStatus | Not Null, Default     | Transaction status          |
| type        | TransactionType   | Not Null              | Transaction type            |
| propertyId  | String            | Foreign Key, Nullable | Reference to Property       |
| createdAt   | DateTime          | Default: now()        | Creation timestamp          |
| updatedAt   | DateTime          | Auto-updated          | Last update timestamp       |

**Indexes**: `fromAddress`, `toAddress`, `status`, `createdAt`, `propertyId`

**Relations**:

- Many-to-One: Property - SET NULL on delete
- Many-to-One: User (recipient via walletAddress)
- One-to-Many: Documents

### Document

Document storage for property verification and transactions.

| Field         | Type           | Constraints           | Description                   |
| ------------- | -------------- | --------------------- | ----------------------------- |
| id            | String         | Primary Key, CUID     | Unique identifier             |
| name          | String         | Not Null              | Document name                 |
| type          | DocumentType   | Not Null              | Document type enum            |
| status        | DocumentStatus | Not Null, Default     | Verification status           |
| fileUrl       | String         | Not Null              | Storage URL                   |
| fileHash      | String         | Nullable              | Content hash for verification |
| mimeType      | String         | Nullable              | File MIME type                |
| fileSize      | Int            | Nullable              | File size in bytes            |
| description   | String         | Nullable              | Document description          |
| propertyId    | String         | Foreign Key, Nullable | Reference to Property         |
| transactionId | String         | Foreign Key, Nullable | Reference to Transaction      |
| uploadedById  | String         | Foreign Key           | Reference to User (uploader)  |
| verifiedAt    | DateTime       | Nullable              | Verification timestamp        |
| expiresAt     | DateTime       | Nullable              | Expiration date               |
| createdAt     | DateTime       | Default: now()        | Creation timestamp            |
| updatedAt     | DateTime       | Auto-updated          | Last update timestamp         |

**Indexes**: `propertyId`, `transactionId`, `uploadedById`, `type`, `status`, `createdAt`

**Relations**:

- Many-to-One: Property - SET NULL on delete
- Many-to-One: Transaction - SET NULL on delete
- Many-to-One: User (uploader) - CASCADE delete

### Role

RBAC role definitions.

| Field       | Type     | Constraints       | Description              |
| ----------- | -------- | ----------------- | ------------------------ |
| id          | String   | Primary Key, CUID | Unique identifier        |
| name        | String   | Unique, Not Null  | Role name                |
| description | String   | Nullable          | Role description         |
| level       | Int      | Default: 0        | Role hierarchy level     |
| isSystem    | Boolean  | Default: false    | System-defined role flag |
| createdAt   | DateTime | Default: now()    | Creation timestamp       |
| updatedAt   | DateTime | Auto-updated      | Last update timestamp    |

**Relations**:

- One-to-Many: Users
- One-to-Many: RolePermissions
- One-to-Many: RoleChangeLog

### Permission

Granular permission definitions.

| Field       | Type     | Constraints       | Description            |
| ----------- | -------- | ----------------- | ---------------------- |
| id          | String   | Primary Key, CUID | Unique identifier      |
| resource    | String   | Not Null          | Resource name          |
| action      | String   | Not Null          | Action name (CRUD)     |
| description | String   | Nullable          | Permission description |
| createdAt   | DateTime | Default: now()    | Creation timestamp     |
| updatedAt   | DateTime | Auto-updated      | Last update timestamp  |

**Unique Constraint**: `[resource, action]`

**Relations**:

- One-to-Many: RolePermissions

### ApiKey

API key management for external integrations.

| Field        | Type     | Constraints       | Description                   |
| ------------ | -------- | ----------------- | ----------------------------- |
| id           | String   | Primary Key, CUID | Unique identifier             |
| name         | String   | Not Null          | Key name/description          |
| key          | String   | Unique, Not Null  | Hashed API key                |
| keyPrefix    | String   | Not Null          | Key prefix for identification |
| scopes       | String[] | Not Null          | Allowed scopes                |
| requestCount | BigInt   | Default: 0        | Total request count           |
| lastUsedAt   | DateTime | Nullable          | Last usage timestamp          |
| isActive     | Boolean  | Default: true     | Active status                 |
| rateLimit    | Int      | Nullable          | Requests per minute limit     |
| createdAt    | DateTime | Default: now()    | Creation timestamp            |
| updatedAt    | DateTime | Auto-updated      | Last update timestamp         |

**Indexes**: `keyPrefix`, `isActive`, `createdAt`

## Enums

### UserRole

- `ADMIN` - Full system access
- `AGENT` - Property management
- `SELLER` - Can list properties
- `BUYER` - Can purchase properties
- `VIEWER` - Read-only access
- `USER` - Standard user
- `VERIFIED_USER` - Verified standard user

### PropertyStatus

- `DRAFT` - Not yet submitted
- `PENDING` - Awaiting approval
- `APPROVED` - Approved for listing
- `LISTED` - Currently listed
- `SOLD` - Property sold
- `REMOVED` - Removed from listing

### TransactionStatus

- `PENDING` - Awaiting processing
- `PROCESSING` - Currently processing
- `COMPLETED` - Successfully completed
- `FAILED` - Transaction failed
- `CANCELLED` - Transaction cancelled

### TransactionType

- `PURCHASE` - Property purchase
- `TRANSFER` - Property transfer
- `ESCROW` - Escrow deposit
- `REFUND` - Refund transaction

### DocumentType

- `TITLE_DEED` - Property title deed
- `OWNERSHIP_CERTIFICATE` - Ownership certificate
- `INSPECTION_REPORT` - Property inspection
- `APPRAISAL` - Property appraisal
- `INSURANCE` - Insurance documents
- `TAX_DOCUMENT` - Tax-related documents
- `CONTRACT` - Contracts and agreements
- `IDENTITY` - Identity verification
- `OTHER` - Other documents

### DocumentStatus

- `PENDING` - Awaiting verification
- `VERIFIED` - Verified and valid
- `REJECTED` - Rejected/invalid
- `EXPIRED` - Document expired

## Database Configuration

### Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]?connection_limit=10&pool_timeout=30
```

### Connection Pooling Parameters

- `connection_limit` - Maximum number of connections (default: 10)
- `pool_timeout` - Connection pool timeout in seconds (default: 30)

### Recommended Production Settings

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/propchain?connection_limit=20&pool_timeout=30&statement_cache_size=100"
```

## Migrations

### Running Migrations

```bash
# Development
npm run migrate

# Production
npm run migrate:deploy

# Reset database (development only)
npm run migrate:reset
```

### Creating New Migrations

```bash
npx prisma migrate dev --name <migration_name>
```

## Seeding

### Run Seed Data

```bash
npm run db:seed
```

The seed script creates:

- System roles (Administrator, Agent, User)
- Default permissions for each role
- Sample users (admin, agent, buyer, seller)
- Sample properties
- Sample transactions
- Sample documents
- Development API keys

## Performance Considerations

### Index Strategy

All foreign keys and frequently queried fields are indexed. The following query patterns are optimized:

- User lookup by email/wallet
- Property search by owner, status, location
- Transaction lookup by addresses, status, property
- Document retrieval by property, transaction, uploader

### Query Optimization Tips

1. Use `select` to limit returned fields
2. Use `include` sparingly - prefer explicit joins
3. Use pagination for large result sets
4. Use transactions for related operations
