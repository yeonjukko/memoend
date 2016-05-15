/**
 * Created by yeonjukko on 2016. 2. 2..
 */


var mysql = require('../manager/MysqlConnectionPool');
var flag = require('../manager/ErrorFlag');
var pool = mysql.mysqlPool;


exports.mNewMemo = function (req, res) {
    var title_id = req.body.title_id;
    var memo_name = req.body.memo_name;
    var content = req.body.content;
    var timestamp = req.body.timestamp;

    pool.getConnection(function (err, db) {

        if (err) {
            db.release();
            res.json(flag.FLAG_ERROR_JSON);
            console.log('false');
            return;
        }

        console.log('connected as id ' + db.threadId);

        //
        db.query('INSERT INTO MEMO_INFO(MEMO_NAME,TITLE_ID) VALUES(?,?);',
            [memo_name,title_id],
            function (err, rows) {
                if (!err) {
                    var memo_id = rows.insertId;
                    console.log(memo_id);
                    db.query('INSERT INTO MEMO_DATA(CONTENT,MEMO_ID,TIMESTAMP,VIEW_COUNT) VALUES(?,?,?,1);',
                        [content, memo_id, timestamp],
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

                } else {
                    console.log(err);
                    res.json(flag.FLAG_ERROR_JSON);
                }
            }
        );


    });

}

