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

console.log(`${header}, shouldAnswerBeVisible, isWorking, why`)

for (const curr of result) {
  const joined = _.join(curr, ',')
  const currShowSolution = curr[getHeaderIndex('showSolution')]
  const currGivenUp = curr[getHeaderIndex('givenUp')]
  const currDueDate = curr[getHeaderIndex('dueDate')]
  const currAttemptCount = curr[getHeaderIndex('attemptCount')]
  const currTimeLimit = curr[getHeaderIndex('timeLimit')]
  if (currTimeLimit === 'remaining' && currDueDate === 'in future'
      && currGivenUp === 'no' && currAttemptCount !== 'max') {
    console.log(`${joined}, no, ?, timer still running`)
    continue
  }
  if (currTimeLimit === 'remaining' && currDueDate === 'in past') {
    console.log(`${joined}, yes, ?, impossible - timer cannot run past due date?`)
    continue
  }
  if (currShowSolution === 'after due date'
                && currDueDate === 'in future') {
    console.log(`${joined}, no, ?, due date in future`)
    continue
  }
  const isNga10781 = (()=>{
    const common = currDueDate === 'in past'
                  && currTimeLimit === 'expired'
                  && currGivenUp === 'no'
    const cond1 = currShowSolution === 'question completion'
                  && currAttemptCount === 'some'
    const cond2 = currShowSolution === 'after due date'
                  && currAttemptCount !== 'none'
    return common && (cond1 || cond2)
  })()
  if (isNga10781) {
    console.log(`${joined}, yes, no, NGA-10781 - need to consider expired timer`)
    continue
  }
  if (currShowSolution === 'question completion' &&
      currTimeLimit === 'expired' &&
      (currAttemptCount === 'max' || currGivenUp === 'yes')) {
    // "(Properly working: exhausted attempts; given up question)"
    console.log(`${joined}, yes, yes - according to NGA-10781, max attempts or given up`)
    continue
  }
  if (
      // FIXME ticket doesn't specify but assuming "after" as due date is mentioned
      currShowSolution === 'after due date'
      && currDueDate === 'in past'
      && currAttemptCount === 'none'
  ) {
    console.log(`${joined}, yes, no - is this NGA-10544?,`) // I think
    continue
  }
  const isQuestionComplete = currShowSolution === 'question completion'
      && (
        currGivenUp === 'yes'
        || currDueDate === 'in past'
        || currAttemptCount === 'max'
        || currTimeLimit === 'expired'
      )
  if (isQuestionComplete) {
    console.log(`${joined}, yes, ?, question is complete`)
    continue
  }
  const isQuestionPastDue = currShowSolution === 'after due date'
      && currDueDate === 'in past'
  if (isQuestionPastDue) {
    console.log(`${joined}, yes, ?, due date has passed`)
    continue
  }
  console.log(`${joined}, no, ?, not attempted or not due or no timer`)
}

console.error(`Wrote ${result.length} lines`)
