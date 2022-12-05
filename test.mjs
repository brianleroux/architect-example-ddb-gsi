import test from 'tape'
import arc from '@architect/functions'
import sandbox from '@architect/sandbox'

test('env', t => {
  t.pass('works')
  t.end()
})

test('start', async t => {
  t.plan(1)
  await sandbox.start()
  t.pass('started')
})

test('show tables', async t => {
  t.plan(1)
  let tables = await arc.tables()
  // let result = await tables._db.listTables({}).promise() // lists tables; architect deliberating creates 'staging' and 'production' envs for testing because that's what will happen IRL
  let name = tables.name('data') // returns table name for current env
  let result = await tables._db.describeTable({ TableName: name }).promise() // relying on v2 aws-sdk
  console.dir(result, { depth: null }) // should show the GSI… it does on Node16
  t.pass()
})

let row = false

test('write a row', async t => {
  t.plan(1)
  let tables = await arc.tables()
  row = await tables.data.put({
    pk: 'PK-' + Date.now(),
    sk: 'SK-' + Date.now(),
    txt: 'hello word'
  })
  t.ok(row, 'got result')
})

test('query gsi for row', async t => {
  let tables = await arc.tables()
  let item = await tables.data.query({
    IndexName: 'reverseIndex',
    KeyConditionExpression: 'pk = :pk and sk = :sk',
    ExpressionAttributeValues: {
      ':sk': row.sk,
      ':pk': row.pk
    }
  })
  console.log(item)
  t.pass()
})

test('end', async t => {
  t.plan(1)
  await sandbox.end()
  t.pass('ended')
})
