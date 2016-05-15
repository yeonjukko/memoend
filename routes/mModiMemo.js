/**
 * Created by yeonjukko on 2016. 2. 5..
 */

var mysql = require('../manager/MysqlConnectionPool');
var flag = require('../manager/ErrorFlag');
var pool = mysql.mysqlPool;


exports.mModiMemo = function (req, res) {
    var title_id = req.body.title_id;
    var memo_id = req.body.memo_id;
    var memo_name = req.body.memo_name;
    var content = req.body.content;
    var timestamp = req.body.timestamp;
    console.log(title_id);
    console.log(typeof title_id);

    pool.getConnection(function (err, db) {

        if (err) {
            db.release();
            res.json(flag.FLAG_ERROR_JSON);
            console.log('false');
            return;
        }

        console.log('connected as id ' + db.threadId);
        db.query('UPDATE MEMO_INFO SET MEMO_INFO.MEMO_NAME=?, MEMO_INFO.TITLE_ID=? WHERE memo_id=?;',
            [memo_name, title_id, memo_id],
            function (err, rows) {
                if (!err) {
                    db.query('UPDATE MEMO_DATA SET MEMO_DATA.CONTENT=?,MEMO_DATA.TIMESTAMP=?,MEMO_DATA.VIEW_COUNT=MEMO_DATA.VIEW_COUNT+1 WHERE memo_id=?;',
                        [content, timestamp, memo_id],
                        function (err, rows) {
                            db.release();
                            if (!err) {
                                res.json(flag.FLAG_SUCCESS_JSON);
                                //memo_data
                            } else {
                                console.log(err);
                                res.json(flag.FLAG_ERROR_JSON);
                            }
                        });
                    //memo_info 에러시
                } else {
                    console.log(err);
                    res.json(flag.FLAG_ERROR_JSON);
                }
            }
        );


    });

}

