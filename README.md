While trying to solve NGA-10781, I needed to understand all the possible states
the app can be in. There are a number of dimensions to consider.

# Results
See [result.csv](./result.csv) for the table. Read below for what the columns
and values mean. The first five columns are the "inputs" to the state, the
remaining columns are the expectations, etc.

# Dimensions

## Inputs

`showSolution`\
The *Solution Visibility* grading setting.

`givenUp`\
Has the user given up on an item.

`dueDate`\
How the due date relates to the assignment attempt:
- `in future/none`: assignment is still open, due date is in the future or
  there is no due date
- `in past`: assignment is closed, due date is in the past

`attemptCount`\
How many attempts at an item has the user made:
- `none`: user has made 0 attempts
- `some`: at least one attempt made and at least one remaining
- `max`: no more allowed as the *Attempts per question* limit has been reached

`timeLimit`\
The *Apply Time Limit* grading setting.
- `remaining`: user still within *time limit*, more attempts allowed
- `expired`: *time limit* expired, no more attempts allowed

## Outputs

`shouldAnswerBeVisible`\
Should the *Reveal Answer* menu item be available to the user.

`isWorking`\
Is this working correct in `assess`? Possibly not all that useful unless it's
used a checklist to make sure we have test coverage. For some states, we have
tickets saying they are/aren't working and I wanted to note that.

`why`\
A reason for the `shouldAnswerBeVisible` value.

# How to run
The result (`result.csv`) is already in version control, but if you make
changes, re-run with:

```bash
yarn
yarn start
cat result.csv
```

# Questions
- What happens when a timer would run past the end date? Is the timer cut short
  when it starts or does it get killed when the due date arrives. The
  assumption is that a timer *cannot* run past the due date.
- Does this correctly capture the states that NGA-10781 is addressing?
- Is NGA-10781 only about "after due date" as the ticket mentions?
- Should "missed" (unattempted) questions show the answer when "complete"?
- For "due date", is it safe to assume that "none" === "in future"? At a code
  level, it might matter as we have `{"dueDate":"0"...`
