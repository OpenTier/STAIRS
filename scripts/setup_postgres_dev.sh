#!/bin/bash

# Start PostgreSQL server
sudo service postgresql start

# Variables (modify these as needed)
PG_USER="dev"  # Linux user and PostgreSQL user will have the same name
PG_PASSWORD="secretpassword"  # Set the password for the PostgreSQL user
PG_DATABASE="delivery"  # Database name (e.g., username_dev)
PG_HBA_FILE="/etc/postgresql/$(ls /etc/postgresql)/main/pg_hba.conf"  # Path to pg_hba.conf

# Function to check if a command succeeded
check_success() {
  if [ $? -ne 0 ]; then
    echo "Error: $1 failed."
    exit 1
  fi
}

# Switch to the postgres user and create a new PostgreSQL role and database
sudo -i -u postgres psql <<EOF
-- Create user if not exists
DO \$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = '${PG_USER}'
   ) THEN
      EXECUTE format('CREATE ROLE %I WITH LOGIN PASSWORD %L', '${PG_USER}', '${PG_PASSWORD}');
   END IF;
END
\$$;
EOF
check_success "Creating PostgreSQL user"

# Create the database outside of the DO block
sudo -i -u postgres psql <<EOF
-- Create database if not exists
SELECT 'CREATE DATABASE ${PG_DATABASE} OWNER ${PG_USER}' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${PG_DATABASE}')\gexec
EOF
check_success "Creating PostgreSQL database"

# Modify the pg_hba.conf file to use password authentication (md5) for local connections
sudo sed -i "s/^local\s*all\s*all\s*peer/local all all md5/" "${PG_HBA_FILE}"
check_success "Modifying pg_hba.conf"

# Restart PostgreSQL to apply changes
sudo service postgresql restart
check_success "Restarting PostgreSQL"

echo "PostgreSQL setup completed successfully!"
echo "You can now connect using: psql -U ${PG_USER} -W -d ${PG_DATABASE}"
