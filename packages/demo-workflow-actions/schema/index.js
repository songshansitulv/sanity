import schemaTypes from 'all:part:@sanity/base/schema-type'
import createSchema from 'part:@sanity/base/schema-creator'
import MetadataSyncerField from 'part:@sanity/plugin-review-workflow/components/--hack-metadata-syncer-field'
import reviewWorkflowSchemaTypes from 'part:@sanity/plugin-review-workflow/schemas'

const post = {
  type: 'document',
  name: 'post',
  title: 'Post',
  fields: [
    // {
    //   type: 'string',
    //   name: 'hackMetadataSyncer',
    //   title: 'Metadata',
    //   inputComponent: MetadataSyncerField
    // },
    {type: 'string', name: 'title', title: 'Title'},
    {type: 'datetime', name: 'publishedAt', title: 'Published at'}
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'title'
    }
  }
}

const release = {
  type: 'document',
  name: 'release',
  title: 'Release',
  fields: [
    // {
    //   type: 'string',
    //   name: 'hackMetadataSyncer',
    //   title: 'Metadata',
    //   inputComponent: MetadataSyncerField
    // },
    {type: 'string', name: 'title', title: 'Title'},
    {type: 'datetime', name: 'publishedAt', title: 'Published at'}
  ]
}

const author = {
  type: 'document',
  name: 'author',
  title: 'Author',
  fields: [{type: 'string', name: 'name', title: 'Name'}]
}

export default createSchema({
  name: 'demo-review-workflow',
  types: schemaTypes.concat([author, post, release, ...reviewWorkflowSchemaTypes])
})
