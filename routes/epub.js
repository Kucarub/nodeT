var express = require('express');
var router = express.Router();
var EPUB = require("epub");

/* GET home page. */
router.post('/upload', function (req, res, next) {
    console.log(req.body);
    let page = parseInt(req.body.page || "1");
    let epub = new EPUB("../public/zoo.epub");
    epub.on("error", function (err) {
        console.log("ERROR\n-----");
        throw err;
    });

    // console.log(epub);
    epub.on("end", function (err) {
        // console.log(epub.spine);
        /*console.log("METADATA:\n");
        console.log(epub.metadata);
        console.log("\nSPINE:\n");
        console.log(epub.flow);
        console.log("\nTOC:\n");
        console.log(epub.toc);
        console.log(epub.spine.contents.length);*/
        let total = epub.spine.contents.length;
        // get first chapter
        epub.getChapter(epub.spine.contents[page - 1].id, function (err, data) {
            if (err) {
                console.log(err);
                res.status(500).send("未知异常");
                return;
            }
            let obj = {
                // data: data.replace(/<\/p>/g,"\n"),
                data: data.replace(/。/g,"\n"),
                // data: data,
                total: total
            };
            // console.log("\nFIRST CHAPTER:\n");
            console.log(total);
            console.log(obj.data); // first 512 bytes
            res.status(200).json('success')
        });

        /*epub.getImage(image_id, function(err, data, mimeType){
            console.log(err || data);
            console.log(mimeType)
        });
        */

    });
    epub.parse();
});

module.exports = router;
