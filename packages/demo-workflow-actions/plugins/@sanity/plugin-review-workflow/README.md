# @sanity/plugin-review-workflow

A plugin for Sanity Studio that adds a basic peer review workflow.

## How to install and configure

First we need to install the plugin:

```sh
sanity install @sanity/plugin-review-workflow
```

Next, we need to tell the plugin which document types we want to apply the review workflow on.

For that we create a file called `reviewWorkflow/config.js`

```js
export default {
  types: ['post', 'release']
}
```

And then register this file as a part in our `sanity.json`:

```json
{
  ...
  "parts": [
    ...
    {
      "name": "part:@sanity/plugin-review-workflow/config",
      "path": "./reviewWorkflow/config"
    }
  ]
}
```

Lastly, we update our Structure configuration:

```js
import {workflowListItems} from 'part:@sanity/plugin-review-workflow/structure'
import S from '@sanity/desk-tool/structure-builder'

// This array contains hidden types.
// In this case, we're hiding the workflow plugin's metadata documents
const HIDDEN_TYPES = ['workflow.metadata']

const hiddenDocTypes = listItem => !HIDDEN_TYPES.includes(listItem.getId())

const docTypeListItems = S.documentTypeListItems().filter(hiddenDocTypes)

export default () =>
  S.list()
    .title('Content')
    .items([
      // Add the workflow list items in root menu
      ...workflowListItems,

      // Add regular document type list items
      ...docTypeListItems
    ])
```
