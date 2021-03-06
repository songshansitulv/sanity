import React from 'react'
import {storiesOf, linkTo} from 'part:@sanity/storybook'
import {withKnobs, text, select, boolean, number} from 'part:@sanity/storybook/addons/knobs'
import DefaultDialog from 'part:@sanity/components/dialogs/default'
import DialogContent from 'part:@sanity/components/dialogs/content'
import ConfirmDialog from 'part:@sanity/components/dialogs/confirm'
import FullscreenDialog from 'part:@sanity/components/dialogs/fullscreen'
import Sanity from 'part:@sanity/storybook/addons/sanity'
import PopOverDialog from 'part:@sanity/components/dialogs/popover'
import Chance from 'chance'
import {range} from 'lodash'

const chance = new Chance()

const action = actionName => {
  return () => console.log('action', actionName)
}

const dialogTestContent = {
  minimal: 'minimal',
  paragraph: 'paragraph',
  longtext: 'longtext',
  example: 'example with dialogcontent'
}

const paragraph = chance.paragraph()
const paragraphs = range(0, 20).map(i => <p key={i}>{chance.paragraph()}</p>)

function renderContent(type) {
  switch (type) {
    case 'paragraph':
      return <p>{paragraph}</p>
    case 'longtext':
      return <div>{paragraphs}</div>
    case 'example':
      return (
        <DialogContent size="medium" padding="medium">
          <h1>With dialog content</h1>
          <p>{paragraph}</p>
        </DialogContent>
      )
    default:
      return 'Minimal'
  }
}

function renderFullscreenContent(type) {
  switch (type) {
    case 'paragraph':
      return <p>{paragraph}</p>
    case 'longtext':
      return <div>{paragraphs}</div>
    case 'example':
      return (
        <DialogContent size="medium" padding={false}>
          <h1>With dialog content</h1>
          <p>{paragraph}</p>
        </DialogContent>
      )
    default:
      return 'Minimal'
  }
}

storiesOf('Dialogs')
  .addDecorator(withKnobs)
  .add('Default', () => {
    const actions = [
      {
        index: '1',
        title: 'Finish',
        color: 'primary',
        autoFocus: true
      },
      {
        index: '2',
        title: 'Cancel'
      },
      {
        index: '3',
        title: 'Secondary',
        color: 'danger',
        secondary: true
      }
    ]

    const dialogActions = boolean('Show actions', false, 'test') ? actions : []
    const contentTest = select('content', dialogTestContent, 'minimal')
    return (
      <Sanity part="part:@sanity/components/dialogs/default" propTables={[DefaultDialog]}>
        <DefaultDialog
          title={text('title', undefined, 'props')}
          color={select(
            'color',
            ['default', 'danger', 'success', 'info', 'warning'],
            undefined,
            'props'
          )}
          showCloseButton={boolean('showCloseButton', false, 'props')}
          onEscape={action('onEscape')}
          onClose={action('onClose')}
          onAction={action('onAction')}
          actions={dialogActions}
        >
          {contentTest && renderContent(contentTest)}
        </DefaultDialog>
      </Sanity>
    )
  })
  .add('DialogContent', () => {
    const actions = [
      {
        index: '1',
        title: 'Finish',
        color: 'primary',
        autoFocus: true
      },
      {
        index: '2',
        title: 'Cancel'
      },
      {
        index: '3',
        title: 'Secondary',
        color: 'danger',
        secondary: true
      }
    ]

    const dialogActions = boolean('Show actions', false, 'test') ? actions : []

    return (
      <Sanity part="part:@sanity/components/dialogs/default" propTables={[DefaultDialog]}>
        <DefaultDialog
          title={text('title', undefined, 'dialog props')}
          color={select(
            'color',
            ['default', 'danger', 'success', 'info', 'warning'],
            undefined,
            'dialog props'
          )}
          onAction={action('onAction')}
          actions={dialogActions}
        >
          <DialogContent
            size={select(
              'size',
              ['default', 'small', 'medium', 'large', 'auto'],
              'default',
              'dialogcontent props'
            )}
            padding={select(
              'padding',
              ['none', 'small', 'medium', 'large'],
              'medium',
              'dialogcontent props'
            )}
          >
            {text('content', 'This is the raw content. use DialogContent to size it', 'props')}
          </DialogContent>
        </DefaultDialog>
      </Sanity>
    )
  })

  .add('Fullscreen', () => {
    const actions = [
      {
        index: '1',
        title: 'Default'
      },
      {
        index: '4',
        title: 'Secondary',
        kind: 'simple',
        secondary: true
      }
    ]

    const dialogActions = boolean('Include actions', false, 'test') ? actions : []
    const contentTest = select('content', dialogTestContent, 'minimal')
    return (
      <Sanity part="part:@sanity/components/dialogs/fullscreen" propTables={[FullscreenDialog]}>
        <FullscreenDialog
          title={text('title', undefined, 'props')}
          onClose={boolean('Has onClose', false, 'test') && (event => console.log('onClose', event))}
          centered={boolean('centered', false, 'props')}
          color={select(
            'Color',
            ['default', 'danger', 'success', 'info', 'warning'],
            undefined,
            'props'
          )}
          actions={dialogActions}
          onAction={action('onAction')}
        >
          {contentTest && renderFullscreenContent(contentTest)}
        </FullscreenDialog>
      </Sanity>
    )
  })

  .add('PopOver', () => {
    const actions = [
      {
        index: '1',
        color: 'success',
        title: 'Please click me',
        autoFocus: true
      }
    ]

    const percentRange = {
      range: true,
      min: 0,
      max: 100,
      step: 0.1
    }

    const sizeRange = {
      range: true,
      min: 0,
      max: 1000,
      step: 1
    }

    const left = number('Reference left', 50, percentRange, 'test')
    const top = number('Reference top', 50, percentRange, 'test')
    const width = number('Reference width', 150, sizeRange, 'test')
    const height = number('Reference height', 150, sizeRange, 'test')
    const placement = select(
      'Placement',
      [
        'auto',
        'top',
        'right',
        'bottom',
        'left',
        'auto-start',
        'top-start',
        'right-start',
        'bottom-start',
        'left-start',
        'auto-end',
        'top-end',
        'right-end',
        'bottom-end',
        'left-end'
      ],
      'auto',
      'props'
    )

    const refStyles = {
      position: 'absolute',
      top: `${top}%`,
      left: `${left}%`,
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: 'lime'
    }

    const contentTest = select('content', dialogTestContent, 'minimal')

    if (window) {
      // Triggers update of popper.js (only reacts to scroll and resize by default)
      const event = document.createEvent('HTMLEvents')
      event.initEvent('resize', true, false)
      window.dispatchEvent(event)
    }

    return (
      <Sanity part="part:@sanity/components/dialogs/confirm" propTables={[ConfirmDialog]}>
        <div style={refStyles}>
          <PopOverDialog
            actions={boolean('has actions', false, 'test') ? actions : []}
            color={select('color', [undefined, 'danger', 'default'], undefined, 'props')}
            title={text('Title', 'Title', 'props')}
            padding={select(
              'Padding',
              [undefined, 'none', 'small', 'medium', 'large'],
              undefined,
              'props'
            )}
            onClose={
              boolean('Has onClose', false, 'test')
                ? event => console.log('onClose', event)
                : undefined
            }
            placement={placement}
          >
            {contentTest && renderContent(contentTest)}
          </PopOverDialog>
          Reference element
        </div>
      </Sanity>
    )
  })

  .add('Confirm', () => {
    const contentTest = select('content', dialogTestContent, 'minimal')
    return (
      <Sanity part="part:@sanity/components/dialogs/confirm" propTables={[ConfirmDialog]}>
        <ConfirmDialog
          color={select(
            'color',
            ['default', 'danger', 'success', 'info', 'warning'],
            undefined,
            'props'
          )}
          confirmColor={select(
            'confirmColor',
            [undefined, 'danger', 'success'],
            undefined,
            'props'
          )}
          cancelColor={select('cancelColor', [undefined, 'danger', 'success'], undefined, 'props')}
          onConfirm={action('onConfirm')}
          onCancel={action('onCancel')}
          confirmButtonText={text('confirmButtonText', 'Yes, delete', 'props')}
          cancelButtonText={text('cancelButtonText', undefined, 'props')}
          title={text('title', 'Confirm', 'props')}
        >
          {contentTest && renderContent(contentTest)}
        </ConfirmDialog>
      </Sanity>
    )
  })
