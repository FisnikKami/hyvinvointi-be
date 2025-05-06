import promisePool from '../utils/database.mjs';

// Get all users (no passwords)
const listAllUsers = async () => {
  try {
    const sql = 'SELECT user_id, username, user_level FROM Users';
    const [rows] = await promisePool.query(sql);
    return rows;
  } catch (error) {
    console.error('listAllUsers', error);
    return { error: 500, message: 'Database error' };
  }
};

// Get a user by ID (hide password)
const selectUserById = async (id) => {
  try {
    const sql = 'SELECT * FROM Users WHERE user_id = ?';
    const [rows] = await promisePool.query(sql, [id]);

    if (rows.length === 0) {
      return { error: 404, message: 'User not found' };
    }

    delete rows[0].password;
    return rows[0];
  } catch (error) {
    console.error('selectUserById', error);
    return { error: 500, message: 'Database error' };
  }
};

// Insert new user
const insertUser = async ({ username, password, email }) => {
  try {
    const sql = 'INSERT INTO Users (username, password, email) VALUES (?, ?, ?)';
    const [result] = await promisePool.query(sql, [username, password, email]);
    return { message: 'New user created', user_id: result.insertId };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return { error: 400, message: 'Username or email already exists' };
    }
    console.error('insertUser', error);
    return { error: 500, message: 'Database error' };
  }
};

// Update user info by ID (supports partial updates)
const updateUserById = async ({ user_id, username, password, email }) => {
  try {
    const fields = [];
    const params = [];

    if (username) {
      fields.push('username = ?');
      params.push(username);
    }
    if (password) {
      fields.push('password = ?');
      params.push(password);
    }
    if (email) {
      fields.push('email = ?');
      params.push(email);
    }

    if (fields.length === 0) {
      return { error: 400, message: 'No data to update' };
    }

    const sql = `UPDATE Users SET ${fields.join(', ')} WHERE user_id = ?`;
    params.push(user_id);

    const [result] = await promisePool.query(sql, params);

    if (result.affectedRows === 0) {
      return { error: 404, message: 'User not found' };
    }

    return { message: 'User updated successfully', user_id };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return { error: 400, message: 'Username or email already in use' };
    }
    console.error('updateUserById', error);
    return { error: 500, message: 'Database error' };
  }
};

// Delete user by ID
const deleteUserById = async (id) => {
  try {
    const sql = 'DELETE FROM Users WHERE user_id = ?';
    const [result] = await promisePool.query(sql, [id]);

    if (result.affectedRows === 0) {
      return { error: 404, message: 'User not found' };
    }

    return { message: 'User deleted successfully', user_id: id };
  } catch (error) {
    // Could be due to foreign key constraints
    console.error('deleteUserById', error);
    return { error: 500, message: 'Database error (possibly due to foreign key constraint)' };
  }
};

// Select user by username (for login)
const selectUserByUsername = async (username) => {
  try {
    const sql = 'SELECT * FROM Users WHERE username = ?';
    const [rows] = await promisePool.query(sql, [username]);

    if (rows.length === 0) {
      return { error: 401, message: 'Invalid username or password' };
    }

    return rows[0];
  } catch (error) {
    console.error('selectUserByUsername', error);
    return { error: 500, message: 'Database error' };
  }
};

export {
  listAllUsers,
  selectUserById,
  insertUser,
  updateUserById,
  deleteUserById,
  selectUserByUsername,
};
