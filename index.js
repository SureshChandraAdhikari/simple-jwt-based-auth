const express = require("express");
const jwt = require("jsonwebtoken")
const app = express();
app.use(express.json());

const users = [];
//const JWT_SECRET = "Mynames"
function generateToken() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < 32; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }

  return result;
}

app.post("/signUp", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (users.find((user) => user.username === username)) {
    res.json({
      message: "Username already exists",
    });
  } else {
    const token = generateToken();
    //const token = jwt.sign({username:username},JWT_SECRET)
    users.push({
      username: username,
      password: password,
      token: token,
    });
    res.json({
      message: "SignUp Successful",
      token: token,
    });
  }
});

app.post("/signIn", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    res.json({
      message: "SignIn Successful",
      token: user.token,
    });
  } else {
    res.status(401).send({
      message: "Invalid username or password",
    });
  }
});

app.get("/me", (req, res) => {
  const token = req.headers.tokken;
  const decodedInfo = jwt.verify(token,JWT_SECRET)
  const username = decodedInfo.username
  const user = users.find((user) => user.token === token);//insted of token search password from username for jwt
  if (user) {
    res.send({
      username: user.username,
    });
  } else {
    res.status(401).send({
      message: "Unauthorized",
    });
  }
});

app.listen(8000, () => {
  console.log("Server listening on port 8000");
});
