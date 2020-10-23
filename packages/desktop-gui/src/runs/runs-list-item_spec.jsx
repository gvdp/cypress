import React from 'react'
import { mount } from 'cypress-react-unit-test'
import RunsListItem from './runs-list-item'
import dayjs from 'dayjs'

/* global cy */
describe('RunsListItem', () => {
  it(`Displays how long ago the run was created`, () => {
    const now = dayjs()

    cy.clock(now.valueOf())

    const dateGiven = now.subtract(1, 'minute').toISOString()

    const run = {
      createdAt: dateGiven,
      instances: [],
    }

    mount(<RunsListItem run={run}/>, {
      stylesheets: '/__root/dist/app.css',
    })

    cy.get('li .row-column-wrapper').eq(3).as('timeAgoColumn')

    cy.get('@timeAgoColumn').contains('a min ago')
  })
})
