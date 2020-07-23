var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "99Spooky",
  database: "employee_db"
});

connection.connect(function(err) {
  if (err) throw err;
     topMenu(); //runSearch();
});
/****
   * Add departments, roles, employees

  * View departments, roles, employees

  * Update employee roles


Bonus points if you're able to:

  * Update employee managers -- Look up SQL Query for classic Employee-Manager Recursive Relationships

  * View employees by manager -- Ditto

  * Delete departments, roles, and employees - Enforce FK-PK relationships - Cascading Delete?

  * View the total utilized budget of a department -- ie the combined salaries of all employees in that department
       */
async function topMenu() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View Employees",
        "View Roles",
        "View employees by manager",
        "View the total utilized budget of a department" ,
        "View Departments",

      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Employees":
          //artistSearch();
          viewEmployees()
          break;
  
        case "View Roles":
          //multiSearch();
          viewRoles()
        break;

 
          
        case "View employees by manager": 
          viewEmpMgr(); //viewRoles()
        break;

        case "View the total utilized budget of a department" :
          viewUtilizedBudgetByDepartment()
        break;

        case  "View Departments" :
          viewDepartments()
         break;
/**** 
        case "Update Employee Roles": //SAVE FOR after meeting
          console.log("Out of time to reseach and to implement.")
         // updateEmployeeRoles()
          //songSearch();
          //        "4 Change Employee Roles",  -- need choice prompt
        break;

  
        case "Change Manager-Employee Records":
          console.log("could not implement with inquirer prompt mechanism in time");
          break;
***/

      }
    });
}
function swapRoles(){
  console.log("Implementation stops here.  Out of time.")
}
function updateEmployeeRoles(){
  console.log("Update employee roles design:\nThere are 2 roles, manager and employee.\nThe user will be offered the following choices:1) swap the role for an employee from manager to employee and visa-versa or take no action")


  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Swap Employee Roles",
        "Do Nothing. Return to main menu.",
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "Swap Employee Roles":
          //artistSearch();
          viewEmployees()
          viewEmployeeRoles()
          ////////////////
          inquirer
          .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
              "Swap Employee Roles",
              "Do Nothing. Return to main menu.",
            ]
          })
          .then(function(answer) {
            switch (answer.action) {
              case "Swap Employee Roles":
                //artistSearch();
                viewEmployees()
                viewEmployeeRoles()
                ////////////////
                inquirer
                .prompt({
                  name: "empId",
                  type: "rawlist",
                  message: "Enter Employee Id",
                  choices: [
                    "Enter Employee Id",
                  ]
                })
                .then(function(empId) {
                  switch (empId.action) {
                    case "Enter Employee Id":
                      ////////////////
                      swapRoles()
                      ////////////////
                      break;
                  }
                });
                ////////////////
                break;
        
              case "Do Nothing":
                return;
              break;
            }
          });


          ////////////////
          break;
  
        case "Do Nothing":
          return;
        break;
      }
    });

   ///////////////////////////////////////////////////
}
//"SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"        

function  viewUtilizedBudgetByDepartment(){
  connection.query("SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"        
  , function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].id + " | " + res[i].name + " | "+ res[i].utilized_budget);
    }
    console.log("----------------Inquirer bug? Top Menu not reached. No errors.-------------------");
    topMenu();
  });  
}  

        
function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Find songs by artist",
        "Find all artists who appear more than once",
        "Find data within a specific range",
        "Search for a specific song",
        "Find artists with a top song and top album in the same year"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "Find songs by artist":
        artistSearch();
        break;

      case "Find all artists who appear more than once":
        multiSearch();
        break;

      case "Find data within a specific range":
        rangeSearch();
        break;

      case "Search for a specific song":
        songSearch();
        break;

      case "Find artists with a top song and top album in the same year":
        songAndAlbumSearch();
        break;
      }
    });
}

/***
   * **id** - INT PRIMARY KEY
  * **first_name** - VARCHAR(30) to hold employee first name
  * **role_id** - INT to hold reference to role employee has
  * **manager_id** - INT to hold reference to another employee that manager of the current employee. This field may be null if the employee 
 */
function viewEmployees() {
  connection.query("SELECT * FROM EMPLOYEE", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].id + " | " + res[i].first_name + " | " + res[i].last_name + " | " + res[i].role_id + " | " + res[i].manager_id);
    }
    console.log("-----------------------------------");
    topMenu();
  });  
}

async function viewEmpMgr() {
  try{
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title," +
    "  department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) " + 
    "AS manager FROM employee LEFT JOIN role on employee.role_id = role.id " + 
    "LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", 
    function(err, res) {
      if (err){
        console.log("ERROR!!!!!")
        console.log(err)
      }
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].id + " | " + res[i].first_name + " | " + res[i].last_name + " | " + res[i].role_id + " | " + res[i].manager_id);
      }
      console.log("-----------------------------------");
      topMenu();
    });

  }catch(error){
    console.log("ERROR!!!! " + JSON.stringify(error) )
  }
}

/*****
  Roles
  * **id** - INT PRIMARY KEY
  * **title** -  VARCHAR(30) to hold role title
  * **salary** -  DECIMAL to hold role salary
  * **department_id** -  INT to hold reference to department role belongs to
  
 */
function viewRoles() {
  
  connection.query("SELECT * FROM ROLE", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].id + " | " + res[i].title + " | " + res[i].salary + " | " + res[i].department_id);
    }
    console.log("-----------------------------------");
  });

  topMenu();
    
}
//View Departments
function viewDepartments() {
  
  connection.query("SELECT * FROM DEPARTMENT", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].id + " | " + res[i].name );
    }
    console.log("----------------Inquirer bug? Top Menu not reached. No errors.-------------------");
    topMenu();
  });

}

/*****
  Roles
  * **id** - INT PRIMARY KEY
  * **title** -  VARCHAR(30) to hold role title
  * **salary** -  DECIMAL to hold role salary
  * **department_id** -  INT to hold reference to department role belongs to
  
 */
function viewDepartments() {
  
  connection.query("SELECT * FROM DEPARTMENT", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].id + " | " + res[i].name);
    }
    console.log("-----------------------------------");
  });
    
}

function artistSearch() {
  inquirer
    .prompt({
      name: "artist",
      type: "input",
      message: "What artist would you like to search for?"
    })
    .then(function(answer) {
      var query = "SELECT position, song, year FROM top5000 WHERE ?";
      connection.query(query, { artist: answer.artist }, function(err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
        }
        runSearch();
      });
    });
}

function multiSearch() {
  var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].artist);
    }
    runSearch();
  });
}

function rangeSearch() {
  inquirer
    .prompt([
      {
        name: "start",
        type: "input",
        message: "Enter starting position: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "end",
        type: "input",
        message: "Enter ending position: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
      connection.query(query, [answer.start, answer.end], function(err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log(
            "Position: " +
              res[i].position +
              " || Song: " +
              res[i].song +
              " || Artist: " +
              res[i].artist +
              " || Year: " +
              res[i].year
          );
        }
        runSearch();
      });
    });
}

function songSearch() {
  inquirer
    .prompt({
      name: "song",
      type: "input",
      message: "What song would you like to look for?"
    })
    .then(function(answer) {
      console.log(answer.song);
      connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
        console.log(
          "Position: " +
            res[0].position +
            " || Song: " +
            res[0].song +
            " || Artist: " +
            res[0].artist +
            " || Year: " +
            res[0].year
        );
        runSearch();
      });
    });
}

function songAndAlbumSearch() {
  inquirer
    .prompt({
      name: "artist",
      type: "input",
      message: "What artist would you like to search for?"
    })
    .then(function(answer) {
      var query = "SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ";
      query += "FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ";
      query += "= top5000.year) WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position";

      connection.query(query, [answer.artist, answer.artist], function(err, res) {
        console.log(res.length + " matches found!");
        for (var i = 0; i < res.length; i++) {
          console.log(
            i+1 + ".) " +
              "Year: " +
              res[i].year +
              " Album Position: " +
              res[i].position +
              " || Artist: " +
              res[i].artist +
              " || Song: " +
              res[i].song +
              " || Album: " +
              res[i].album
          );
        }

        runSearch();
      });
    });
}
