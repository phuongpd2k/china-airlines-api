const string = "Airbus A330-300"
const regex = / [^]*-/g
const match =string.match(regex)
console.log(match[0].slice(1,-1))