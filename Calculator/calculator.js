#! /usr/bin/env node

// Calculator
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
  let output;
  let nums = [];

  // operators
  const add = (first, second) => {
    return first + second;
  };
  const subtract = (first, second) => {
    return first - second;
  };
  const multiply = (first, second) => {
    return first * second;
  };
  const divide = (first, second) => {
    return first / second;
  };

  // check if string contains invalid characters
  if (string.match(/[^0-9+\-*\/().]/g)) {
    return "Invalid Input";
  }

  // add order of operations for parens
  // if (string.includes("(") && string.includes(")")) {
  //   let start = string.indexOf("(");
  //   let end = string.indexOf(")");
  //   console.log("startend", start, end);
  // }

  // convert string to array of numbers and operators; string-to-number conversion
  let convertedArr = string
    .replace(/\+/gi, ",+,")
    .replace(/\-/gi, ",-,")
    .replace(/\*/gi, ",*,")
    .replace(/\//gi, ",/,")
    // .replace("(", ",(,")
    // .replace(")", ",),")
    .split(",")
    .map((elem) => {
      // if (elem === "(" || elem === ")") {
      //   return elem;
      // }
      if (elem == Number(elem)) {
        nums.push(Number(elem));
        return Number(elem);
      } else {
        return elem;
      }
    });

  // helper function
  const calculate = (op, calcFn) => {
    let opIdx = convertedArr.indexOf(op);
    let first = convertedArr[opIdx - 1];
    let second = convertedArr[opIdx + 1];
    output = calcFn(first, second);
    convertedArr.splice(opIdx - 1, 3, output);
  };

  // reduce input down to single value
  while (convertedArr.length > 1) {
    console.log("initial", convertedArr);
    // do all multiplication/division operations first from left to right
    while (convertedArr.includes("*") || convertedArr.includes("/")) {
      for (let i = 0; i < convertedArr.length; i++) {
        let elem = convertedArr[i];
        if (elem === "*") {
          calculate("*", multiply);
          console.log("multiplied", convertedArr);
        }
        if (elem === "/") {
          calculate("/", divide);
          console.log("divided", convertedArr);
        }
      }
    }
    // then add and subtract from left to right
    for (let i = 0; i < convertedArr.length; i++) {
      let elem = convertedArr[i];
      if (elem === "+" || elem === "-") {
        if (elem === "+") {
          calculate("+", add);
          console.log("added", convertedArr);
        } else {
          calculate("-", subtract);
          console.log("subtracted", convertedArr);
        }
      }
    }
  }

  if (convertedArr.length === 1) {
    console.log("answer", convertedArr[0]);
  }

  return convertedArr[0];
}

console.log(calculator(input));
