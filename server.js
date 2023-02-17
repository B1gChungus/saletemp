

const express = require('express');
const path = require('path');
const { updateToken, checkToken } = require('./controllers/auth');
const app = express();
const cors = require('cors');
const fs = require('fs');
//routers
const userRouter = require('./Routes/user');
//admin page
app.set('view engine', 'ejs')

const user = {
  name: "Cheeseburger"
}

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
  // if (
  //   (!(await checkToken(req.get('token'))) || req.get('token') == undefined)
  // ) {
  //   return res.send({ success: false, msg: 'invalid/no token' });
  // }

  next();
});

app.get("/home", (req, res) => {
  res.render(path.join(__dirname + "/frontend/pages/index"), { user });
})
app.get("/contact", (req, res) => {
  res.render(path.join(__dirname + "/frontend/pages/contact"), { user })
})
app.get("/login", (req, res) => {
  res.render(path.join(__dirname + "/frontend/pages/login"), { user })
})
app.get("/about", (req, res) => {
  res.render(path.join(__dirname + "/frontend/pages/about"), { user })
})


const server = app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});


