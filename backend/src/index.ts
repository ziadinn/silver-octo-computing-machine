import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const REGION = 'us-east-1'
const VISITORS_TABLE = 'visitors'
const VISITORS_TABLE_KEY = 'visitorCount'
// Not the best practice, but we'll use this for now 😅
const DYNAMODB_ENDPOINT = process.env.NODE_ENV === 'production' ? `https://dynamodb.${REGION}.amazonaws.com` : 'http://localhost:8000'

const client = new DynamoDBClient({
  region: REGION,
  endpoint: DYNAMODB_ENDPOINT,
});

const db = DynamoDBDocumentClient.from(client);
const app = new Hono()

app.use('/*', cors({
  origin: '*',
  credentials: true,
}))

app.get('/', async (c) => {
  try {
    const { Item } = await db.send(new GetCommand({
      TableName: VISITORS_TABLE,
      Key: {
        id: VISITORS_TABLE_KEY,
      },
    }))

    const visitorCount = Item ? Item.count : 0
    const newVisitorCount = visitorCount + 1

    await db.send(new PutCommand({
      TableName: VISITORS_TABLE,
      Item: { 
        id: VISITORS_TABLE_KEY,
        count: newVisitorCount
      },
    }))

    return c.json({ visitors: newVisitorCount })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Failed to get visitors' }, 500)
  }
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
