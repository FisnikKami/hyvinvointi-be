import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import {selectUserByUsername} from '../models/user-model.mjs';


// INSECURE LOGIN uses harcoded passwords only
// returns user object if username & password match
const postLogin = async (req, res) => {
  const {username, password} = req.body;
  console.log('login', req.body);
  const user = await selectUserByUsername(username);
  if (user.error) {
    return res.status(user.error).json(user);
  }
  // compare password and hash, if match, login successful
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    delete user.password;
    const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '24h'});
    return res.json({message: 'logged in successfully', user, token});
  } else {
    return res
      .status(401)
      .json({error: 401, message: 'invalid username or password'});
  }
};

const getMe = async (req, res) => {
  res.json({user: req.user});
};

export {postLogin, getMe};
