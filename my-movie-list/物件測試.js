const x = { "2330": { "close": 800 } }

x["2330"]["open"] = 750
x[2313] = {
    close: 50,
    open: 40
}

console.log(typeof x)
console.log(x["2330"]["open"])
console.log(x)


const y = { "name": "Cindy" }

console.log(y.name)