import bcrypt from 'bcryptjs';
import {
  deleteUserById,
  insertUser,
  listAllUsers,
  selectUserById,
  updateUserById,
} from '../models/user-model.mjs';

// GET /api/users
const getUsers = async (req, res) => {
  const result = await listAllUsers();
  if (result.error) {
    return res.status(result.error).json(result);
  }
  return res.status(200).json(result);
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  const result = await selectUserById(req.params.id);
  if (result.error) {
    return res.status(result.error).json(result);
  }
  return res.status(200).json(result);
};

// POST /api/users
const postUser = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 400, message: 'Missing required fields' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await insertUser({
      username,
      email,
      password: hashedPassword,
    });

    if (result.error) {
      console.log(result.error)
      return res.status(result.error).json(result);
    }

    return res.status(201).json(result);
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 500, message: 'Server error', details: err.message });
  }
};

// PUT /api/users (must be authenticated)
const putUser = async (req, res) => {
  const user_id = req.user?.user_id;
  const { username, password, email } = req.body;

  if (!user_id || (!username && !password && !email)) {
    return res.status(400).json({ error: 400, message: 'Invalid request or missing fields' });
  }

  try {
    const updateData = { user_id };

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const result = await updateUserById(updateData);
    if (result.error) {
      return res.status(result.error).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 500, message: 'Server error', details: err.message });
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  // Optional: protect against deleting others' accounts unless admin
  if (parseInt(userId) !== req.user?.user_id) {
    return res.status(403).json({ error: 403, message: 'Forbidden: cannot delete another user' });
  }

  const result = await deleteUserById(userId);
  if (result.error) {
    return res.status(result.error).json(result);
  }
  return res.status(200).json({ message: 'User deleted successfully' });
};

export { getUsers, getUserById, postUser, putUser, deleteUser };
