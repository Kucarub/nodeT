var express = require('express');
var router = express.Router();
var pdf = require('pdfkit');
var fs = require('fs');


/* GET users listing. */


router.post('/users', function(req, res, next) {
    console.log(req.body);
    let data={
        "a":req.body.a,
        "b":req.body.b
    };
    var doc = new pdf();
    doc.pipe(fs.createWriteStream('test.pdf'));
    var base64Data = data.a.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile("image.png", dataBuffer, function(err) {
        if(err){
            res.send(err);
        }else{
            res.send("保存成功！");
        }
    });
    doc.image(dataBuffer);
    doc.end();
});

module.exports = router;
