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
  const cond1 = curr[0] === 'question completion'
                && curr[1] === 'in past'
                && curr[2] === 'some'
  const cond2 = curr[0] === 'after due date'
                && curr[1] === 'in past'
                && curr[2] !== 'none'
  const joined = _.join(curr, ',')
  if (cond1 || cond2) {
    console.log(`${joined},NGA-10781`)
    continue
  }
  if (curr[0] === 'after due date'
                && curr[1] === 'in future') {
    console.log(`${joined},Answers never shown!`)
    continue
  }
  if (curr[0] === 'after due date'
                && curr[1] === 'none') {
    console.log(`${joined},Invalid - due date not configured`)
    continue
  }
  if (
      // FIXME not mentioned in ticket but assuming this as due date is mentioned
      curr[0] === 'after due date'
      && curr[1] === 'in past'
      && curr[2] === 'none'
  ) {
    console.log(`${joined},NGA-10544`) // I think
    continue
  }
  console.log(joined)
}

console.error(`Wrote ${result.length} lines`)
