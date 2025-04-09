# Switcher Library

A TypeScript library that provides a flexible and easy-to-use switch-case mechanism, allowing for more readable and maintainable code.

## Features

- **Flexible case conditions** with `case()`, `caseOr()`, and `caseAnd()`.
- Supports **default values** with `default()`.
- Allows **breaks** to stop execution early with `break()`.
- Works with complex conditionals using `caseOr()` (OR logic) and `caseAnd()` (AND logic).

## Installation

```bash
npm install switcher-library
```

# Usage

## Basic Example

```
import { Switcher } from 'switcher-library';

const result = Switcher.switch(5)
.case((x) => x === 5, () => 'It is five!')
.default(() => 'Default case')
.out();

console.log(result); // Output: 'It is five!'

```

## Using caseOr and caseAnd

```
import { Switcher } from 'switcher-library';

const result = Switcher.switch(5)
.caseOr((x) => x > 10)
.caseAnd((x) => x < 10)
.then(() => 'Number is less than 10')
.default(() => 'Default case')
.out();

console.log(result); // Output: 'Number is less than 10'
```

# API

## Switcher.switch(target: T, isAutoBreak: boolean = true)

- Starts the switch operation on the target value.

- isAutoBreak: Optional. If true (default), breaks the switch after the first match.

## SwitcherBuilder.case(predicate: (t: T) => boolean, func: (t: T) => U)

- Adds a case condition.

- If the predicate returns true, the function will execute.

## SwitcherBuilder.caseOr(predicate: (t: T) => boolean)

- Adds an OR condition to the case.

## SwitcherBuilder.caseAnd(predicate: (t: T) => boolean)

- Adds an AND condition to the case.

## SwitcherBuilder.default(func: (t: T) => U)

- Defines the default case if no conditions are met.

## SwitcherBuilder.break()

- Breaks out of the switch and returns the result.

# Contributing

Feel free to fork the repository and submit pull requests with improvements or fixes!

# License

MIT License. See LICENSE for more information.
