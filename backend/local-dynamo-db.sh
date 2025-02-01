#! /bin/bash

# Check if directory exists
if [ ! -d "dynamodb_local_latest" ]; then
  # Download
  curl -O https://d1ni2b6xgvw0s0.cloudfront.net/v2.x/dynamodb_local_latest.tar.gz
  
  # Make a folder called dynamodb_local_latest
  mkdir dynamodb_local_latest

  # Extract to folder called dynamodb_local_latest
  tar -xzf dynamodb_local_latest.tar.gz -C dynamodb_local_latest

  # Delete the tar.gz file
  rm dynamodb_local_latest.tar.gz
else
  echo -e "Directory 'dynamodb_local_latest' already exists. Skipping download..."
fi

# Run
cd dynamodb_local_latest
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb

# Warn if failed
if [ $? -ne 0 ]; then
    echo -e "Failed to start DynamoDB Local"
    echo "Ensure you have java installed or have fake AWS creds set up"
    exit 1
fi
