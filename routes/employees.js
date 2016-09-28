var express = require('express');
var router = express.Router();

//new employee
router.get('/new', function(req, res) {
    res.render('employee/new', { post_data: {}, errors: {}});
});

//save new employee
router.post('/new', function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));

    var post_data = {
        name: input.name,
        email: input.email,
        phone: input.phone
    };

    req.checkBody("name", "Name is required").notEmpty();                   //Validate name
    //req.checkBody("name", "Enter a valid name").isAlpha();                  //Validate name
    req.checkBody("email", "Email is required").notEmpty();                   //Validate email
    req.checkBody("email", "Enter a valid email address.").isEmail();           //Validate email
    req.checkBody("phone", "Phone is required").notEmpty();                   //Validate phone
    req.checkBody("phone", "Enter a valid phone").isInt();                  //Validate phone

    var errors = req.validationErrors();  
    if( !errors){   //No errors were found.  Passed Validation!
        req.getConnection(function(err,connection){
            var query = connection.query("INSERT INTO employees set ? ", post_data, function(err, rows)
            {
                if(err) console.log( "Error Inserting : %s ", err );

                req.flash("success", "New employee create success");
                res.redirect('/');
            });
        });
    } else {
        res.render('employee/new', {post_data: post_data, errors: errors});
    }
});

//update an employee
router.get('/edit/:id', function(req, res) {
	var id = req.params.id;
    
    req.getConnection(function(err, connection){
        connection.query('SELECT * FROM employees WHERE id = ?',[id],function(err, rows)
        {
            if(err) console.log("Error Selecting : %s ", err );

            var emp_data = {
                id: id,
                name: rows[0].name,
                email: rows[0].email,
                phone: rows[0].phone
            };

            res.render('employee/new',{post_data: emp_data, errors: {}});
        });
    }); 
});

//save updated employee
router.post('/edit/:id', function(req, res) {
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;

    req.checkBody("name", "Name is required").notEmpty();                   //Validate name
    //req.checkBody("name", "Enter a valid name").isAlpha();                  //Validate name
    req.checkBody("email", "Email is required").notEmpty();                   //Validate email
    req.checkBody("email", "Enter a valid email address.").isEmail();           //Validate email
    req.checkBody("phone", "Phone is required").notEmpty();                   //Validate phone
    req.checkBody("phone", "Enter a valid phone").isInt();                  //Validate phone

    var errors = req.validationErrors();  
    if( !errors){   //No errors were found.  Passed Validation!
        req.getConnection(function (err, connection) {            
            var post_data = {                
                name    : input.name,
                email   : input.email,
                phone   : input.phone
            };
            
            connection.query("UPDATE employees set ? WHERE id = ? ",[post_data, id], function(err, rows)
            {  
                if (err) console.log("Error Updating : %s ", err );

                req.flash("success", "Employee updated success");
                res.redirect('/');
              
            });        
        });
    } else {
        res.render('employee/new', {post_data: input, errors: errors});
    }
});

//delete an employee
router.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    
    req.getConnection(function (err, connection) {
        connection.query("DELETE FROM employees  WHERE id = ? ",[id], function(err, rows)
        {
            if(err) console.log("Error deleting : %s ", err );

            req.flash("success", "Employee deleted success");
            res.redirect('/');
        });
    });
});

module.exports = router;