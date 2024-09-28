const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "ramdomeuser"
const app = express();
app.use(express.json());

const users = [];
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


app.post("/signup", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username: username,
        password: password
    })    

    res.json({
        message: "You are signed up"
    })

    console.log(users)
    
})

app.post("/signin", function(req, res) {
    
    const username = req.body.username;
    const password = req.body.password;

    // maps and filter
    let foundUser = null;

    for (let i = 0; i<users.length; i++) {
        if (users[i].username == username && users[i].password == password) {
            foundUser = users[i]
        }
    }

    if (foundUser) {
        const token = jwt.sign({
            username: username,
            password: password,

        }, JWT_SECRET) ;

        // foundUser.token = token;
        res.json({
            token: token
        })
    } else {
        res.status(403).send({
            message: "Invalid username or password"
        })
    }
    console.log(users)
})

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  try {
    // Verify the token using the same secret used when signing
    const decoded = jwt.verify(token, "your_jwt_secret"); // Replace "your_jwt_secret" with your secret key
    req.username = decoded.username; // Add the decoded username to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

app.get("/me", auth, function (req, res) {
  let foundUser = null;

  // Assuming `users` is an array of user objects like {username: "user", password: "pass"}
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === req.username) {
      foundUser = users[i];
      break;
    }
  }

  if (foundUser) {
    res.json({
      username: foundUser.username,
      password: foundUser.password, // You might want to avoid sending passwords in responses!
    });
  } else {
    res.status(404).json({
      message: "User not found",
    });
  }
});


app.listen(3000);