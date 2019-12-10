import client from 'part:@sanity/base/client'
import {of as observableOf} from 'rxjs'
import {concatMap, map} from 'rxjs/operators'
import {getServerEventObservable} from './serverEvent'

function fetchEntrySnapshots({publishedId, draftId}) {
  return client.observable
    .getDocuments([draftId, publishedId])
    .pipe(map(([draft, published]) => ({draft, published})))
}

function createSnapshotEvent(documentId, document) {
  return {
    type: 'snapshot',
    documentId: documentId,
    document
  }
}

export function getPairListener(idPair) {
  const {publishedId, draftId} = idPair

  return getServerEventObservable({
    filter: `_id == $publishedId || _id == $draftId`,
    params: {publishedId, draftId},
    options: {includeResult: false, events: ['welcome', 'mutation', 'reconnect']}
  }).pipe(
    concatMap(event =>
      event.type === 'welcome'
        ? fetchEntrySnapshots({publishedId, draftId}).pipe(
            concatMap(snapshots => [
              createSnapshotEvent(draftId, snapshots.draft),
              createSnapshotEvent(publishedId, snapshots.published)
            ])
          )
        : observableOf(event)
    )
  )
}
