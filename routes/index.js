var express = require('express');
var router = express.Router();

/* GET Employee list page. */
router.get('/', function(req, res) {
    req.getConnection(function(err, connection){
        if(err) res.send("Error in connecting database");
        
        var query = connection.query('SELECT * FROM employees',function(err, rows)
        {
            if(err) console.log("Error Selecting : %s ",err );

            res.render('index',{
                errors: {},
                data: rows
            });
        });
    });
});

module.exports = router;