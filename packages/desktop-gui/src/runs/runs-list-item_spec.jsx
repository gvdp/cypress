import React from 'react'
import { mount } from 'cypress-react-unit-test'
import RunsListItem from './runs-list-item'
import * as utils from '../lib/utils'

/* global cy */
describe('RunsListItem', () => {
  const run = {
    createdAt: '27-08-2020T08:45:342Z',
    instances: [],
    totalDuration: 555,
  }

  beforeEach(() => {
    cy.stub(utils, 'durationFormatted')
    .callsFake(() => '12:34')

    cy.stub(utils, 'getFormattedTimeFromNow')
    .callsFake(() => 'a min ago')

    mount(<RunsListItem run={run}/>, {
      stylesheets: '/__root/dist/app.css',
    })
  })

  it(`Displays how long ago the run was created`, () => {
    cy.get('li .row-column-wrapper').eq(3).as('timeAgoColumn')
    cy.get('@timeAgoColumn').contains('a min ago')
  })

  it(`Displays how long the run took`, () => {
    cy.get('li .env-duration').as('durationColumn')
    cy.get('@durationColumn').contains('12:34')
  })
})
