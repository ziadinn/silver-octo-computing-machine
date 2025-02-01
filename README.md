# Simple Counter

A simple counter that uses AWS DynamoDB to store the count of visitors.

## Setup

1. Install dependencies

For both backend and web, you can install dependencies with:

```bash
npm install
```

2. Setup DynamoDB Local

We included 2 scripts to help you setup DynamoDB Local.

- `local-dynamo-db.sh`: Downloads and runs DynamoDB Local.
- `create-local-dynamo-table.sh`: Creates a table called `visitors` with a key called `visitorCount`.

You can run the scripts with:

```bash
./local-dynamo-db.sh
./create-local-dynamo-table.sh
```

3. Run the backend

```bash
cd backend
npm run dev
```

4. Run the web

```bash
cd web
npm run dev
```

5. Open your browser and go to `http://localhost:5173`

You should see the counter incrementing every time you refresh the page.
