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
  console.log("string", string);

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
    // first check for first index of close parens, then loop backwards to find innermost subArr or first subArr
    if (arr.includes("(") && arr.includes(")")) {
      console.log("parens while loop");
      let end = arr.indexOf(")");
      for (let j = end; j > idx; j--) {
        if (arr[j] === "(") {
          let start = j;
          let subArr = arr.slice(start + 1, end);
          console.log("subarr", subArr);
          let [subtotal] = parseExpression(subArr, 0);
          console.log("subtotal", subtotal);
          arr.splice(start - 1, end - start + 3, subtotal);
          console.log("arr", arr);
          parseItem(arr, 0);
        }
      }
    } else {
      parseExpression(arr, 0);
    }
    return arr;
  }

  function parseExpression(arr, idx) {
    // if no additional parens
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
