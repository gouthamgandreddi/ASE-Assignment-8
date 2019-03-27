const express = require('express');
var jwt = require('jsonwebtoken');


const userInfo = {
  name:'goutham',
  password:'ase',
  university:'UMKC',
  enrollment:'spring 2019'
}
const router = express.Router();


router.post("/login",(req,res,next)=>{
  console.log('req from source - login method - ', req);
  console.log(req.body.uname,req.body.password);

  if(req.body.uname == userInfo.name && req.body.password == userInfo.password) {
    var token = jwt.sign({
      name:userInfo.name,
      university:userInfo.university
    }, 'stevejobs'); //,{expiresIn: '30s'}
    res.status(200).json({
      message: token,
      username:userInfo.name
    })
  }else{
    res.status(403).json({
      message:'invalid user'
    })
  }
});

router.post("/userinfo",verifyToken,(req,res,next)=>{
  console.log('req from source - user info method - ',req.headers);
  console.log(req.token,'- token for goutham');
  jwt.verify(req.token,'stevejobs',function (err,success) {
    if (err){
      res.status(403);
    }else{
      res.status(200).json({
        message:'user details',
        userinfo:userInfo
      })
    }
  });

});

function verifyToken(req,res,next){
  //get auth header value
  console.log(req.headers,'- req at verify token');
  const bearerHeader = req.headers['authorization'];

  if(typeof bearerHeader !== "undefined"){

    //split at the space
    const bearer = bearerHeader.split(' ');

    //Get token from array
    const bearerToken = bearer[1];

    //set the token
    req.token = bearerToken;
    console.log('token extract - ',req.token);
    //next middle ware
    next();

  }else{
    res.sendStatus(403);
    console.log('error on verifyToken')
  }
}

module.exports = router;
