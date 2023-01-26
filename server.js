

const express = require('express');
const path = require('path');
const { updateToken, checkToken } = require('./controllers/auth');
const app = express();
const cors = require('cors');
const fs = require('fs');
//routers
const userRouter = require('./Routes/user');
//admin page
const adminPage = fs.readFileSync(__dirname + '/interface/index.html', 'utf-8');


/**
 * App
 */
app.use(cors());
app.options('*', cors());

app.use(express.text({ limit: '26mb' }));

app.post('/token', async (req, res) => {
  const userToken = req.get('token');
  if (userToken == undefined) {
    return res.status(202).send({ success: false, msg: 'invalid' });
  }
  var updatedToken = await updateToken(userToken);
  res.status(200).send({ success: true, token: updatedToken });
});
//routes the user check
app.use('/user', userRouter);
app.use(express.static(__dirname + '/frontend'));

//these require authentication at the given time
app.use('/', async (req, res, next) => {
  if (
    false &&
    (!(await checkToken(req.get('token'))) || req.get('token') == undefined)
  ) {
    return res.send({ success: false, msg: 'invalid/no token' });
  }

  next();
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/pages/index.html"));
})
app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/pages/contact.html"))
})
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/pages/login.html"))
})
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/pages/about.html"))
})


const server = app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});


