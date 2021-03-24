require('lodash.product')
const _ = require('lodash')

const dimensions = {
  // TODO homework/quiz dimension not captured
  showSolution: [ 'question completion', 'after due date' ],
  dueDate: [ 'in future', 'in past' ],
  attemptCount: [ 'none', 'some', 'max' ],
  timeLimit: [ 'none', 'remaining', 'expired' ],
  givenUp: [ 'no', 'yes' ],
}

const header = 'showSolution, givenUp, dueDate, attemptCount, timeLimit'
const splitHeaders = header.split(', ')
const getHeaderIndex = key => splitHeaders.findIndex(k => k === key)
const headerValues = splitHeaders.map(key=> {
  const values = dimensions[key]
  if (!values) {
    throw new Error(`Could not find values for key=${key}`)
  }
  return values
})
const result = _.product(...headerValues)

console.log(`${header}, shouldAnswerBeVisible, notes`)
for (const curr of result) {
  const joined = _.join(curr, ',')
  const currShowSolution = curr[getHeaderIndex('showSolution')]
  const currGivenUp = curr[getHeaderIndex('givenUp')]
  const currDueDate = curr[getHeaderIndex('dueDate')]
  const currAttemptCount = curr[getHeaderIndex('attemptCount')]
  // const currTimeLimit = curr[getHeaderIndex('timeLimit')]
  const isNga10781 = (()=>{
    const cond1 = currShowSolution === 'question completion'
                  && currDueDate === 'in past'
                  && currAttemptCount === 'some'
    const cond2 = currShowSolution === 'after due date'
                  && currDueDate === 'in past'
                  && currAttemptCount !== 'none'
    return cond1 || cond2
  })()
  if (isNga10781) {
    console.log(`${joined}, yes, NGA-10781`)
    continue
  }
  if (currShowSolution === 'question completion' &&
      (currAttemptCount === 'max' || currGivenUp === 'yes')) {
    console.log(`${joined}, yes, OK according to NGA-10781`)
    continue
  }
  if (currShowSolution === 'after due date'
                && currDueDate === 'in future') {
    console.log(`${joined}, no,`)
    continue
  }
  if (
      // FIXME ticket doesn't specify but assuming "after" as due date is mentioned
      currShowSolution === 'after due date'
      && currDueDate === 'in past'
      && currAttemptCount === 'none'
  ) {
    console.log(`${joined}, ?, NGA-10544`) // I think
    continue
  }
  console.log(`${joined}, ?,`)
}

console.error(`Wrote ${result.length} lines`)
