#! /usr/bin/env node

// run npm link

// Examples:
// calculate "1 + 2" gives 3
// calculate "4*5/2" gives 10
// calculate "-5+-8--11*2" gives 9
// calculate "-.32       /.5" gives -0.64
// calculate "(4-2)*3.5" gives 7
// calculate "2+-+-4" gives Syntax Error (or similar)
// calculate "19 + cinnamon" gives Invalid Input (or similar)

const input = process.argv.slice(2)[0];

function calculator(string) {
  // remove extra spaces; reduce +/- operators
  string = string.replace(/\s/g, "").replace("+-", "-").replace("--", "+");
  let output;
  let nums = [];

  // operators
  const add = (a, b) => a + b;
  const subtract = (a, b) => a - b;
  const multiply = (a, b) => a * b;
  const divide = (a, b) => a / b;

  // check if string contains invalid characters
  if (string.match(/[^0-9+\-*\/().]/g)) {
    return "Invalid Input";
  }

  // convert string to array of numbers and operators; string-to-number conversion
  let arr = string
    .replace(/\+/gi, ",+,")
    .replace(/\-/gi, ",-,")
    .replace(/\*/gi, ",*,")
    .replace(/\//gi, ",/,")
    .replace(/\(/gi, ",(,")
    .replace(/\)/gi, ",),")
    .split(",")
    .map((el) => {
      if (el == Number(el)) {
        nums.push(Number(el));
        return Number(el);
      } else {
        return el;
      }
    });

  // check for balanced parens
  function balancedParens(str) {
    let openParensStack = [];
    const openParens = {
      "(": true,
    };
    const closeParens = {
      ")": "(",
    };

    for (let i = 0; i < str.length; i++) {
      let el = str[i];
      if (openParens[el]) {
        openParensStack.push(el);
      }
      if (closeParens[el]) {
        if (openParensStack.length === 0) {
          return false;
        } else if (
          closeParens[el] === openParensStack[openParensStack.length - 1]
        ) {
          openParensStack.pop();
        } else {
          return false;
        }
      }
    }
    return !openParensStack.length;
  }

  // helper function
  function calculate(array, op, calcFn) {
    let opIdx = array.indexOf(op);
    let a = array[opIdx - 1];
    let b = array[opIdx + 1];
    output = calcFn(a, b);
    return array.splice(opIdx - 1, 3, output);
  }

  function orderOfOps(arr) {
    // do all multiplication/division operations first from left to right
    while (arr.includes("*") || arr.includes("/")) {
      for (let i = 0; i < arr.length; i++) {
        let el = arr[i];
        if (el === "*") calculate(arr, "*", multiply);
        if (el === "/") calculate(arr, "/", divide);
      }
    }
    // then add and subtract from left to right
    while (arr.includes("+") || arr.includes("-")) {
      for (let i = 0; i < arr.length; i++) {
        let el = arr[i];
        if (el === "+") calculate(arr, "+", add);
        if (el === "-") calculate(arr, "-", subtract);
      }
    }
    return arr;
  }

  // reduce input down to single value
  while (arr.length > 1) {
    console.log("initial", arr);

    // operate inside parens first
    while (arr.includes("(")) {
      let start = arr.indexOf("(");
      let end = arr.indexOf(")");
      let subArr = arr.slice(start + 1, end);
      let [subtotal] = orderOfOps(subArr);
      arr.splice(start - 1, end - start + 3, subtotal);
    }

    orderOfOps(arr);
  }

  if (arr.length === 1) {
    console.log("answer", arr[0]);
  }

  return arr[0];
}

console.log(calculator(input));
