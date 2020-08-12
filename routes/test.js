var express = require('express');
var router = express.Router();
let iconv = require("iconv-lite");
var fs=require('fs');

/* GET home page. */
router.post('/test', function (req, res, next) {
    const page=req.body.page || 1;
    const pageSize=req.body.pageSize || 100;
    fs.readFile('../public/luanma.txt',function(err,data){
        if(err){
            console.error(err);
        } else{
            data = iconv.decode(data,'gbk');
            console.log(data)
            let testArr=formatStrData(data);
            testArr=group(testArr,pageSize);
            /*let resArr=testArr.map(item=>{
                return insertStr(item,1,'\n')
            })*/
            // console.log(testArr[page-1]);
        }
    });
    res.status(200).send('yes')
});
const insertStr=(data,start,newStr)=>{
    return data.slice(0, start) + newStr + data.slice(start)
};
const formatStrData=(data)=>{
    return data.split('。')
};
function group(array, subGroupLength) {
    let index = 0;
    let newArray = [];
    while(index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
}
module.exports = router;

