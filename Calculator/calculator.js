#! /usr/bin/env node

// run npm link

const input = process.argv.slice(2)[0];

function calculator(string) {
  // remove extra spaces
  string = string.replace(/\s/g, "");

  // error handling if string contains more than 2 operators in a row, or if there are 2 operators but the second is not a minus
  for (let i = 0; i < string.length; i++) {
    if (
      (string[i].match(/[^0-9().]/) &&
        string[i + 1].match(/[^0-9().]/) &&
        string[i + 2].match(/[^0-9().]/)) ||
      (string[i].match(/[^0-9().]/) && string[i + 1].match(/[^0-9().\-]/))
    ) {
      return "Syntax Error";
    }
  }

  // error handling if string contains invalid characters
  if (string.match(/[^0-9+\-*\/().]/g)) {
    return "Invalid Input";
  }

  // convert string to array of numbers and operators
  let arr = string
    // reduce +/- operators
    .replace("+-", "-")
    .replace("--", "+")
    .replace(/\+/gi, ",+,")
    .replace(/\-/gi, ",-,")
    .replace(/\*/gi, ",*,")
    .replace(/\//gi, ",/,")
    .replace(/\(/gi, ",(,")
    .replace(/\)/gi, ",),")
    .split(",")
    // string-to-number conversion
    .map((el) => {
      if (el == Number(el)) {
        return Number(el);
      } else {
        return el;
      }
    });

  // operators
  const add = (a, b) => a + b;
  const subtract = (a, b) => a - b;
  const multiply = (a, b) => a * b;
  const divide = (a, b) => a / b;

  // helper function for operators
  const calculate = (array, op, calcFn) => {
    let opIdx = array.indexOf(op);
    let a = array[opIdx - 1];
    let b = array[opIdx + 1];
    let output = calcFn(a, b);
    return array.splice(opIdx - 1, 3, output);
  };

  function parseItem(arr, idx) {
    // first check for first index of close parens, then loop backwards to find the closest open parens for the innermost subArr or the first subArr
    if (arr.includes("(") && arr.includes(")")) {
      let end = arr.indexOf(")");
      for (let j = end; j > idx; j--) {
        if (arr[j] === "(") {
          let start = j;
          let subArr = arr.slice(start + 1, end);
          let [subtotal] = parseExpression(subArr);
          arr.splice(start - 1, end - start + 3, subtotal);
          parseItem(arr, 0);
        }
      }
    } else {
      parseExpression(arr);
    }
    return arr;
  }

  function parseExpression(arr) {
    // if no additional parens, follow mathematical order of operations
    if (arr.includes("*") || arr.includes("/")) {
      parseTerm(arr);
    }
    while (arr.includes("+") || arr.includes("-")) {
      for (let i = 0; i < arr.length; i++) {
        let el = arr[i];
        if (el === "+") calculate(arr, "+", add);
        if (el === "-") calculate(arr, "-", subtract);
      }
    }
    return arr;
  }

  function parseTerm(arr) {
    while (arr.includes("*") || arr.includes("/")) {
      for (let i = 0; i < arr.length; i++) {
        let el = arr[i];
        if (el === "*") calculate(arr, "*", multiply);
        if (el === "/") calculate(arr, "/", divide);
      }
    }
    return arr;
  }

  parseItem(arr, 0);

  return arr[0];
}

console.log(calculator(input));
