#! /usr/bin/env node

// Calculator

// Examples:
// calculate "1 + 2" gives 3
// calculate "4*5/2" gives 10
// calculate "-5+-8--11*2" gives 9
// calculate "-.32       /.5" gives -0.64
// calculate "(4-2)*3.5" gives 7
// calculate "2+-+-4" gives Syntax Error (or similar)
// calculate "19 + cinnamon" gives Invalid Input (or similar)

const input = process.argv.slice(2)[0];
// console.log(input);

function calculator(string) {
  return Number(string);
}

console.log(calculator(input));
