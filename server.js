const express = require('express');
const path = require('path');
const fs = require('fs');


const app = express();
const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


// Serve static files from the current directory
app.use(express.static(__dirname));

// Routes

// Home route
app.get('/', (req, res) => {
    // Read the index.html file and send it as the response
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading index.html:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(data);
    });
});

// Logout route
app.get('/logout', (req, res) => {
    // Clear the session data or perform any logout actions
    res.send('You have been successfully logged out.');
});

// Have a pet to give away route
app.get('/givepet', (req, res) => {
    // Check if user is logged in, if not, redirect to login page
    // Otherwise, serve the givepet.html file
    // Example implementation:
    const isLoggedIn = true; // Implement your own logic to check if the user is logged in
    if (!isLoggedIn) {
        res.redirect('/login'); // Redirect to login page if user is not logged in
    } else {
        // Serve the givepet.html file
        fs.readFile(path.join(__dirname, 'givepet.html'), 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading givepet.html:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.send(data);
        });
    }
});

app.post('/createAccount', (req, res) => {
    const { username, password } = req.body;
    const userData = `${username}:${password}\n`;

    fs.appendFile('login.txt', userData, (err) => {
        if (err) {
            console.error('Error writing to login.txt:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Account created successfully.');
        res.redirect('/'); // Redirect to homepage or any other page
    });
});

// Route to handle login
app.post('/login', (req, res) => {
	console.log('Request body:', req.body); 
    const { username, password } = req.body;

    // Read the login file
    fs.readFile('login.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading login file:', err);
            res.status(500).send('Internal server error');
            return;
        }

        // Split the file content into lines
        const lines = data.split('\n');

        // Loop through each line to check for matching username and password
        let isValidLogin = false;
        for (const line of lines) {
            const [storedUsername, storedPassword] = line.split(':');
            if (username === storedUsername && password === storedPassword) {
                isValidLogin = true;
                break;
            }
        }

        // Send response based on login validation
        if (isValidLogin) {
            res.sendStatus(200); // Successful login
        } else {
            res.sendStatus(401); // Unauthorized
        }
    });
});

// Other routes...

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// Route to handle form submission for offering a pet for adoption
app.post('/submitOfferPet', (req, res) => {
    const { username, petType, petName, petBreed, petAge, petGender } = req.body;

    // Construct the pet data string
    const petData = `${getUniqueId()}:${username}:${petType}:${petName}:${petBreed}:${petAge}:${petGender}\n`;

    // Append the pet data to the available pet information file
    fs.appendFile('petInformation.txt', petData, (err) => {
        if (err) {
            console.error('Error writing to petInformation.txt:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Pet information added successfully.');
        res.redirect('/'); // Redirect to homepage or any other page
    });
});

app.post('/savePet', (req, res) => {
    const { petType, breed, age, description } = req.body;

    // Create a data string to write to the file
    const data = `${breed}:${age}:${description}\n`;

    // Determine the file name based on pet type
    let fileName = '';
    if (petType === 'cat') {
        fileName = 'cat.txt';
    } else if (petType === 'dog') {
        fileName = 'dog.txt';
    } else {
        return res.status(400).send('Invalid pet type.');
    }

    // Append the data to the appropriate file
    fs.appendFile(path.join(__dirname, 'public', fileName), data, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Pet data saved successfully.');
        res.sendStatus(200);
    });
});




// Function to generate a unique ID for each pet entry
function getUniqueId() {
    // You can implement your logic to generate a unique ID here
    // For simplicity, let's use a timestamp-based ID
    return Date.now();
}


// Other routes can be added similarly


