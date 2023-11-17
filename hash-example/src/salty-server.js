/***********

This script creates an Express server on Node.js and uses the bcryptjs library to handle salting and hashing for password security.

1. The script starts by requiring the necessary modules for operation. 'Express' is used for handling server related actions like routing, 'fs' (File System) is used to handle file writing, and 'bcryptjs' is used for generating the salt and hashing the password.

2. The script then creates an instance of the Express application and sets it to the variable 'app'.

3. Inside the app, we define a route for the root directory ('/') and specifies it's a GET request. When a GET request is made to the root url, the anonymous function passed to 'app.get' will execute. This is where the username, password processing, and file writing happens.

4. The function first checks to see if there are a 'username' and a 'password' present in the url's query parameters. If either is missing, an error message will be sent as a response with status code 400, and the function will exit.

5. If both 'username' and 'password' are available, the function will assign these values to their respective variables.

6. The next line generates the salt using bcrypt.genSalt(). '10' is passed in as the number of rounds to perform forming salt. This will then be used to enhance security by adding it to the password during the hashing process. The process is asynchronous and thus uses await to pause execution until the Promise resolves.

7. After generating the salt, the password is hashed by adding the salt to the password and hashing it using bcrypt.hash(). Again, '10' is passed as the number of rounds for the hashing process.

8. A user record is then defined in the format `{username: "${username}", salt: "${salt}", hash: "${hash}"}`. 

9. This record is then appended to a file named 'users.txt' on a new line using 'fs.appendFile'. If there's an error appending to the file, the function logs the error and sends an error message to the client with status code 500. If there is no error, a success message is sent to the client with status code 200.

10. The script finally starts the server, listens to the port defined in the environment variables, or port 3000 if no port is defined in the environment variables.

How to send the URL: 
You can make a GET request to the server by visiting `http://localhost:3000/?username=myusername&password=mypassword` in your web browser or through tools like Postman. 'myusername' and 'mypassword' are the username and password, respectively, which will be processed by our application as explained above.

*****************/




const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const app = express();

app.get('/', async (req, res) => {
    if (!req.query.username || !req.query.password) {
        res.status(400).send('Missing username or password');
        return;
    }

    const { username, password } = req.query;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password + salt, 10);

    const userRecord = `{username: "${username}", salt: "${salt}", hash: "${hash}"}`;
      
    fs.appendFile('users.txt', userRecord + '\n', function (err) {
        if (err) {
            console.error(err);
            res.status(500).send('There was an issue writing to the file');
            return;
        }
        res.status(200).send('Saved successfully');
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port: ${port}`));