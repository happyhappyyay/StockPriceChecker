/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
         let stockData = res.body.stockData;

          assert.equal(res.status,200);
          assert.property(stockData, 'stock');
          assert.property(stockData, 'likes');
          assert.property(stockData, 'price');
          assert.equal(stockData.likes, 1);
          assert.equal(stockData.price, "1239.49");
         assert.equal(stockData.stock,"GOOG");
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog', like: true})
        .end(function(err, res){
         let stockData = res.body.stockData;
          assert.equal(res.status,200);
          assert.property(stockData, 'stock');
          assert.property(stockData, 'likes');
          assert.property(stockData, 'price');
          assert.equal(stockData.likes, 1);
          assert.equal(stockData.price, "1239.49");
         assert.equal(stockData.stock,"GOOG");
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog', like: true})
        .end(function(err, res){
         let stockData = res.body.stockData;
          assert.equal(res.status,200);
          assert.property(stockData, 'stock');
          assert.property(stockData, 'likes');
          assert.property(stockData, 'price');
          assert.equal(stockData.likes, 1);
          assert.equal(stockData.price, "1239.49");
         assert.equal(stockData.stock,"GOOG");
          done();
        });
      });
      
      test('2 stocks', function(done) {
                chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog','msft'], like: true})
        .end(function(err, res){
         let stockData = res.body.stockData;
          assert.equal(res.status,200);
          assert.property(stockData[0], 'stock');
          assert.property(stockData[0], 'rel_likes');
          assert.property(stockData[0], 'price');
          assert.equal(stockData[0].rel_likes, 0);
          assert.equal(stockData[0].price, "1239.49");
         assert.equal(stockData[0].stock,"GOOG");
          assert.property(stockData[1], 'stock');
          assert.property(stockData[1], 'rel_likes');
          assert.property(stockData[1], 'price');
          assert.equal(stockData[1].rel_likes, 0);
          assert.equal(stockData[1].price, "137.215");
         assert.equal(stockData[1].stock,"MSFT");
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog','msft'], like: true})
        .end(function(err, res){
         let stockData = res.body.stockData;
          assert.equal(res.status,200);
          assert.property(stockData[0], 'stock');
          assert.property(stockData[0], 'rel_likes');
          assert.property(stockData[0], 'price');
          assert.equal(stockData[0].rel_likes, 0);
          assert.equal(stockData[0].price, "1239.49");
         assert.equal(stockData[0].stock,"GOOG");
          assert.property(stockData[1], 'stock');
          assert.property(stockData[1], 'rel_likes');
          assert.property(stockData[1], 'price');
          assert.equal(stockData[1].rel_likes, 0);
          assert.equal(stockData[1].price, "137.215");
         assert.equal(stockData[1].stock,"MSFT");
          done();
        });
      });
      
    });

});
