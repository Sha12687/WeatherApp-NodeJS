const path=require("path");
const http = require("http");
const fs = require("fs");
const express=require("express");
var requests = require("requests");
 const app=express();
const staticPath=path.join(__dirname,"/assest");
app.use(express.static(staticPath));
const homeFile = fs.readFileSync("Home.html", "utf-8");
const replaceVal=(tempVal,orgVal)=>{
  let temp=tempVal.replace("{%tempval%}",orgVal.main.temp);
  temp=temp.replace("{%tempmin%}",orgVal.main.temp_min);
  temp=temp.replace("{%tempmax%}",orgVal.main.temp_max);
  temp=temp.replace("{%location%}",orgVal.name);
  temp=temp.replace("{%country%}",orgVal.sys.country);
return temp;
}
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      `http://api.openweathermap.org/data/2.5/weather?q=pune&appid=ceb28cf7bade15949fed1e9a3d2ae991`
    )
      .on("data", (chunk) => { 
        const objData=JSON.parse(chunk);
        const arrData=[objData];
         console.log(arrData[0].main.temp);
         const realTimeData=arrData.map((val)=>replaceVal(homeFile,val)).join("");
         res.end(realTimeData);
         console.log(arrData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        console.log("end");
      });
  } 
});
server.listen(1000, "127.0.0.1");