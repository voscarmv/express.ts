#!/bin/bash

if ! psql --version ; then
    sudo apt update && sudo apt install -y postgresql postgresql-contrib
fi

if grep -e 'DB_URL=' ./.env ; then
    exit
fi

read -p "Postgres username: " PGUSER
read -s -p "Postgres password: " PASS
echo
read -p "Database name: " DB

sudo -u postgres psql <<EOF
CREATE DATABASE $DB;
CREATE USER $PGUSER WITH PASSWORD '$PASS';
GRANT ALL PRIVILEGES ON DATABASE $DB TO $PGUSER;
\c $DB
GRANT ALL ON SCHEMA public TO $PGUSER;
EOF

echo "DB_URL=postgres://$PGUSER:$PASS@localhost/$DB" >> .env
echo "✅ Database, user, and .env file created. Edit .env if needed."
