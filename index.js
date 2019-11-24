const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();


var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'EmployeeDB',
    multipleStatements: true
})

mysqlConnection.connect(err => {
    if (!err) {
        console.log('DB connected')
    } else {
        console.log('err', err)
    }
})

//READ All Employees
app.get('/employees', (req, res) => {
    mysqlConnection.query('SELECT * FROM Employee', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
            console.log(rows);
        } else {
            console.log(err);
        }
    })
})

//READ a specific Employee
app.get('/employees/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM Employee WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
            console.log(rows);
        } else {
            console.log(err);
        }
    })
})

//DELETE an employee
app.delete('/employees/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM Employee WHERE EmpID =?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send('Successfully Deleted');
        } else {
            console.log(err);
        }
    })
})

//ADD an Employee
app.post('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpID =?; SET @Name =?; SET @EmpCode = ?; SET @Salary = ?; \
                CALL EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);";

    mysqlConnection.query(sql,[emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err) {
            rows.forEach(element => {
                if(element.constructor == Array){
                    res.send('Inserted employee Id: ' + element[0].EmpID)
                }
            })
        } else {
            console.log(err);
        }
    })
})

//UPDATE an Employee
app.put('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpID =?; SET @Name =?; SET @EmpCode = ?; SET @Salary = ?; \
                CALL EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);";

    mysqlConnection.query(sql,[emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err) {
            res.send('Successfully Updated ')
        } else {
            console.log(err);
        }
    })
})


app.listen(3000, () => {
    console.log('server connected');
})
