@app
testapp

@tables
data
  pk *String # contains a GUID
  sk **String # the data type, like product or person

@tables-indexes
data
  sk *String # the data type, now as the pk
  pk **String # the unique ID
  name reverseIndex
