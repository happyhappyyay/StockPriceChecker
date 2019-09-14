'use strict';

let request = require('request');

function StockController(){
     this.createNewStock=(name)=>{
    return name.length>1?
      [
        {
          stock:name[0],
          ipAddresses:[]
        },
        {
          stock:name[1],
          ipAddresses:[]
        }
      ]
    :
      [
        {
          stock:name[0],
          ipAddresses:[]
        }
      ]
  }
     this.updateStockForLikes=(stock,db,ip)=>{
       if(ip){        
          for(let i = 0; i<stock.length;i++){
            if(!stock[i].ipAddresses.includes(ip)){
              stock[i].ipAddresses.push(ip);
                db.findOneAndUpdate({stock:stock[i].stock},{$addToSet:{ipAddresses:ip}},
                                  {upsert:true, returnOriginal:false},(err,data)=>{
                if(err)console.log(err,"update");
              });
            }
          }
        }
       return stock;
     }
     
   this.getStockInformation=(stock,db,done,ip)=> {
     let json;
     if(ip) stock = this.updateStockForLikes(stock,db,ip);
     if(stock.length>1){
       let likes = this.compareLikes(stock[0].ipAddresses.length,stock[1].ipAddresses.length);
       request("https://api.iextrading.com/1.0/tops/last?symbols="+stock[0].stock+","
              +stock[1].stock,{timeout: 1500},(error,response,body)=>{
           json = JSON.parse(body);

         if(!error && response.statusCode == 200 && json.length>1){
           done({stockData:[{"stock":stock[0].stock, "price":json[0].price, "rel_likes":likes[0]},
                  {"stock":stock[1].stock, "price":json[1].price, "rel_likes":likes[1]}]});
         }
         else {
           
            done("could not find stock information")
          }
      });
     }
     else {
        request("https://api.iextrading.com/1.0/tops/last?symbols="+stock[0].stock, 
                {timeout: 1500},(error,response,body)=>{
           json = JSON.parse(body);

         if(!error && response.statusCode == 200 && json.length!=0){
              json = JSON.parse(body);
           done({stockData:{"stock":stock[0].stock, "price":json[0].price, "likes":stock[0].ipAddresses.length}});
         }
          else {
            done("could not find stock information")
          }
      });
     }
   }
   
   this.compareLikes=(num1,num2)=>{
    return [num1-num2,num2-num1];     
   }  
   
    };
    module.exports = StockController;