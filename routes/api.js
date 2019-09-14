/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var StockController = require('../controller/StockController.js');


const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  let controller = new StockController;

  app.route('/api/stock-prices')
    .get(function (req, res){
    var stocks = Array.isArray(req.query.stock)? req.query.stock:[req.query.stock];
    for(let i = 0; i<stocks.length; i++){
      stocks[i]= stocks[i].toUpperCase();
    }
    var like = req.query.like == "true"? true:false;
    var ip = req.header('x-forwarded-for')? req.header('x-forwarded-for').split(",").shift() : req.connection.remoteAddress;

    if(stocks){
        MongoClient.connect(CONNECTION_STRING,
          {useNewUrlParser: true, useUnifiedTopology:true},(err, client)=>{
          var db = client.db("stocks").collection("stocks");
            db.find({stock:{$in: stocks}}).toArray((err,stock)=>{
              if(!err){
                if(!stock || stock.length == 0){
                  stock = controller.createNewStock(stocks);
                }
                if(stocks.length != stock.length){
                  let newStock = stocks[0]==stock[0].stock? controller.createNewStock([stocks[1]]):controller.createNewStock([stocks[0]]);
                  stock = stock.concat(newStock);
                }
                  like? controller.getStockInformation(stock,db,sendRes,ip):controller.getStockInformation(stock,db,sendRes);
              }
              else{
                console.log(err,"find");
              }
            })
        });
      function sendRes(data){
        res.send(data);
      }

      }

    });
  }
