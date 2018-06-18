const express = require("express");
const fs = require('fs')

const app = express();

app.post("/process-tx", (req, res) => {
  const transactions = getCSVAsJson("/transactions.csv")
  res.send("Successfully processed transactions")
})

app.post("/get-insights", (req, res) => {
 const transactions = getCSVAsJson("/transactions.csv")
 const uberSpend = getSpendingByDescription(transactions, "UBER TECHNOLOGIES INC")
 const massageSpend = getSpendingByDescription(transactions, "CHING\'S CHINESE MEDICINE")

 res.send(`UBER: ${uberSpend}, MASSAGE: ${massageSpend}`)
})

app.listen(3000);

const getCSVAsJson = (path) => {
  const data = fs.readFileSync(__dirname + path, "utf8")
  return csvToJson(data)
}

const csvToJson = (csvString) => {
  let csvJson = []
  let rows = csvString.split("\n")
  let fields = rows[0].split(",")
  rows.slice(1, rows.length).map(row => {
    let object = {}
    let index = 0
    row.split(",").map( value => {
      object[fields[index]] = value
      index++
    })
    csvJson.push(object)
  })
  return csvJson;
}

const getSpendingByDescription = (transactions, description)=> {
  let totalSpend = 0; 
  transactions.map(transaction => {
    if(transaction.Description == description) {
      totalSpend += new Number(transaction.Amount)
    }
  })
  return totalSpend
}