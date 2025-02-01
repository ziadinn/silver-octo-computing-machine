#! /bin/bash

# check if dynamodb local is running
aws dynamodb list-tables --endpoint-url http://localhost:8000 > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "DynamoDB Local is not running"
    exit 1
fi

# check if table "visitors" exists
aws dynamodb describe-table --table-name visitors --endpoint-url http://localhost:8000 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "Table 'visitors' already exists"
    read -p "Do you want to delete it? (y/n): " delete
    if [ "$delete" = "y" ]; then
        aws dynamodb delete-table --table-name visitors --endpoint-url http://localhost:8000
    else
        echo -e "Table 'visitors' not deleted"
        exit 1
    fi
fi

# create table "visitors"
aws dynamodb create-table \
    --table-name visitors \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url http://localhost:8000

# check if table "visitors" exists
aws dynamodb describe-table --table-name visitors --endpoint-url http://localhost:8000 > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo -e "Failed to create table 'visitors'"
    exit 1
fi

echo -e "Table 'visitors' created successfully"
