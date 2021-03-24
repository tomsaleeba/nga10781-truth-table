require('lodash.product')
const _ = require('lodash')

// TODO homework/quiz dimension not captured
const showSolution = [ 'question completion', 'after due date' ]
const dueDate = [ 'none', 'in future', 'in past' ]
const attemptCount = [ 'none', 'some', 'max' ]
const timeLimit = [ 'remaining', 'expired' ]
const givenUp = [ 'no', 'yes' ]

const result =
    _.product(showSolution, dueDate, attemptCount, timeLimit, givenUp)

console.log('showSolution, dueDate, attemptCount, timeLimit, givenUp, notes')
for (const curr of result) {
  const joined = _.join(curr, ',')
  const currShowSolution = curr[0]
  const currDueDate = curr[1]
  const currAttemptCount = curr[2]
  // const currTimeLimit = curr[3]
  const currGivenUp = curr[4]
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
    console.log(`${joined},NGA-10781`)
    continue
  }
  if (currShowSolution === 'question completion' &&
      (currAttemptCount === 'max' || currGivenUp === 'yes')) {
    console.log(`${joined},OK according to NGA-10781`)
    continue
  }
  if (currShowSolution === 'after due date'
                && currDueDate === 'in future') {
    console.log(`${joined},Answers never shown!`)
    continue
  }
  if (currShowSolution === 'after due date'
                && currDueDate === 'none') {
    console.log(`${joined},Invalid - due date not configured`)
    continue
  }
  if (
      // FIXME not mentioned in ticket but assuming "after" as due date is mentioned
      currShowSolution === 'after due date'
      && currDueDate === 'in past'
      && currAttemptCount === 'none'
  ) {
    console.log(`${joined},NGA-10544`) // I think
    continue
  }
  console.log(`${joined},`)
}

console.error(`Wrote ${result.length} lines`)
