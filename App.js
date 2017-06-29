var express = require('express');

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

var app = express();
var fs = require('fs');
var obj = [];



function checkTable() {

    let array = [];

    driver.get('http://www.iaa.gov.il/he-IL/airports/bengurion/pages/onlineflights.aspx');
    driver.wait(until.elementLocated(By.className('odd')), 3000).then(() => {
        driver.findElements(By.css("#board1 > tbody > tr")).then((trElements) => {
                for (let tdElement of trElements) {
                    let promise = tdElement.getText();
                    promise.then((text) =>{
                        obj.push(text.replace(/(\r\n|\n|\r)/gm, " "));


                    });

                    array.push(promise);
                }
                Promise.all(array).then(()=>{
                    fs.writeFile("flights.json", JSON.stringify(obj), function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        obj = [];

                        console.log("file saved");
                    });

                })
            }
        );
    });
}

checkTable();
setInterval(checkTable, 30000);

module.exports = app;