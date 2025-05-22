
# OCI Autoscaler Central Management

A central management system for distributed OCI autoscaler instances.

## Architecture

- **Backend API**: FastAPI-based RESTful API for managing autoscaler nodes
- **Database**: MySQL with SQLAlchemy ORM and Alembic for migrations
- **Frontend**: React-based web interface (to be implemented)

## Prerequisites

- Docker and Docker Compose
- Python 3.10+ (for local development)
- Node.js 16+ (for local frontend development)

## Quick Start

1. Clone this repository
2. Navigate to the `central-management` directory
3. Start the system:

```bash
docker-compose up -d
```

4. Access the API at http://localhost:8000
5. Access the UI at http://localhost:3000 (once implemented)

## Configuration

### Backend Environment Variables

Create a .env file in the `backend` directory with these variables:

```
# Database Configuration
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_DB=autoscaler_central

# API Configuration
SECRET_KEY=change_me_in_production
API_PORT=8000
ENVIRONMENT=development
```

## Development

### Database Migrations

To create a new migration:

```bash
docker-compose exec backend alembic revision --autogenerate -m "Description of changes"
```

To apply migrations:

```bash
docker-compose exec backend alembic upgrade head
```

### API Documentation

Once running, API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Autoscaler Integration

Each autoscaler should be updated to use the `CentralManagementClient` class to:
1. Register with the central management system
2. Send regular heartbeats
3. Report metrics
4. Receive configuration updates

Example usage in an autoscaler:

```python
from central_mgmt.client import CentralManagementClient

# Initialize the client
client = CentralManagementClient(
    central_api_url="http://central-management:8000/api",
    local_config_path="/path/to/config.yaml"
)

# Start communication with central management
client.start()

# Send metrics during operation
client.send_metrics(
    instance_pool_id="ocid1.instancepool.oc1...",
    cpu_util=75.5,
    memory_util=60.2,
    instance_count=3,
    scaling_event=True,
    scaling_direction="UP"
)

# Stop the client when shutting down
client.stop()
```

## License

MIT License
