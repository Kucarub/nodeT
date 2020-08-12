var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var fs = require('fs');
var upload = multer({dest: path.join(__dirname, '../public/upload/')});

/* GET home page. */
router.post('/uploadImg', upload.single('file'), function (req, res, next) {
    console.log(req.body);
    console.log(req.file);
    return
    var temp_path = req.file.path;
    var ext = '.' + req.file.originalname.split('.')[1];
    var target_path = req.file.path + ext;
    var _filename = req.file.filename + ext;
    var filePath = '/upload/' + _filename;
    console.log("Uploading: " + _filename);
    fs.rename(temp_path, target_path, function(err,data) {
        // cb(null, { file_path: filePath });
    });
    res.status(200).send('yes')
});

module.exports = router;
