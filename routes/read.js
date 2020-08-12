var express = require('express');
var router = express.Router();
let pool=require('../main')
/* GET home page. */

router.get('/read', function(req, res, next) {
    let page=req.query.page || 1;
    let name=req.query.page || 'test';
    let sql=`SELECT content FROM books WHERE name = '${name}'`;
    pool.getConnection((err,connection)=>{
        connection.query(sql, function(err, result) {
            connection.release();
            console.log(result)
            if (result.length>0) {
                console.log(result[0].content);
                let obj={
                    content:format(result[0].content,page),
                    status:'1'
                };
                res.status(200).json(obj)
            }else {
                let obj={
                  msg:"查无数据",
                    status:'0'
                };
                res.status(200).json(obj)
            }
            if (err) {
                console.log(err);
                let obj={
                    status:'0'
                };
                res.status(500).send(obj)
            }

        });
    });
});
function format(val,page) {
    const unit=50;
    val=val.substring((page-1)*unit,unit*page);
    return val
}
module.exports = router;
