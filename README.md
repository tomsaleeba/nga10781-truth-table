While trying to solve NGA-10781, I needed to understand all the possible states
the app can be in. There are a number of dimensions to consider.

# Dimensions

`showSolution`\
The *Solution Visibility* grading setting.

`dueDate`\
How the due date relates to the assignment attempt:
- `none`: no due date
- `in future`: assignment is still open
- `in past`: assignment is closed

`attemptCount`\
How many attempts at an item has the user made:
- `none`: no attempts
- `some`: at least one made and at least one remaining
- `max`: all attempts used, no more allowed

`timeLimit`\
The *Apply Time Limit* grading setting.
- `remaining`: user still within *time limit*, more attempts allowed
- `expired`: *time limit* expired, no more attempts allowed

`givenUp`\
Has the user given up on an item.

`notes`\
Which ticket does this state relate to. Or, is it even possible.

# Results
See [result.csv](./result.csv) for the table.
