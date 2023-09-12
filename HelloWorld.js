var express = require('express')  
var app = express()  
  
app.get('/profile', function (req, res) {  
res.send('This is my profile')  
})
  
app.listen(3000, function () {  
console.log('Example app listening on port 3000!')  
})