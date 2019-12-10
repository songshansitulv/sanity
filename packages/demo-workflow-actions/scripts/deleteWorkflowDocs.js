import client from 'part:@sanity/base/client'

client
  .fetch(`*[_type=="workflow.metadata"]`)
  .then(docs => {
    const tx = docs.reduce((acc, doc) => {
      console.log('delete', doc._id)
      return acc.delete(doc._id)
    }, client.transaction())

    return tx.commit()
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
