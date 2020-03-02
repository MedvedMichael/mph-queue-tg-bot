const express = require('express')
const packageInfo = require('../package.json')

const port = process.env.PORT || 3000

const app = express()

app.get('/',(req, res)=>{
    res.json({version:packageInfo.version})
})

let server = app.listen(port,()=>{
  let host = server.address().address;
  let port = server.address().port;

  console.log('Web server started at http://%s:%s', host, port);
})