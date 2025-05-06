// entry-controller.mjs

import promisePool from '../utils/database.mjs';

const listAllEntries = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM TreeniOhjelma');
    console.log(rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return { error: e.message };
  }
};

const listAllEntriesByUserId = async (id) => {
  try {
    const sql = `SELECT * FROM TreeniOhjelma WHERE uid=?`;
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return { error: e.message };
  }
};

const findProgramById = async (id) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM TreeniOhjelma WHERE id = ?',
      [id],
    );
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return { error: e.message };
  }
};

// Function to add an entry to the TreeniOhjelma table
const addEntry = async (program) => {
  const { uid, name, moves, reps, weight } = program;
  const sql = `INSERT INTO TreeniOhjelma (uid, name, moves, reps, weight)
  VALUES (?, ?, ?, ?, ?)`;
  const params = [uid, name, moves, reps, weight];
  try {
    const rows = await promisePool.query(sql, params);
    return { id: rows[0].insertId };
  } catch (e) {
    console.error('error', e.message);
    return { error: e.message };
  }
};

// Function to add an entry to the DiaryEntries table
const addEntryToDiary = async (entry) => {
  return await addEntry(entry);
};

// Function to add an entry to the TreeniOhjelma table
const addEntryToTreeniOhjelma = async (entry) => {
  const { uid, name, moves, reps, weight } = entry;
  const sql = `INSERT INTO TreeniOhjelma (uid, name, moves, reps, weight)
  VALUES (?, ?, ?, ?, ?)`;
  const params = [uid, name, moves, reps, weight];
  try {
    const rows = await promisePool.query(sql, params);
    return { id: rows[0].insertId };
  } catch (e) {
    console.error('error', e.message);
    return { error: e.message };
  }
};

const updateEntryById = async (program) => {
  const { id, uid, name, moves, reps, weight } = program;
  try {
    const sql =
      'UPDATE TreeniOhjelma SET uid=?, name=?, moves=?, reps=?, weight=? WHERE id=?';
    const params = [uid, name, moves, reps, weight, id];
    const [result] = await promisePool.query(sql, params);
    if (result.affectedRows === 0) {
      return { error: 404, message: 'program not found' };
    }
    return { message: 'program data updated', id };
  } catch (error) {
    console.error('updateProgramById', error);
    return { error: 500, message: 'db error' };
  }
};

const deleteProgramById = async (id) => {
  try {
    const sql = 'DELETE FROM TreeniOhjelma WHERE id=?';
    const params = [id];
    const [result] = await promisePool.query(sql, params);
    if (result.affectedRows === 0) {
      return { error: 404, message: 'program not found' };
    }
    return { message: 'program deleted', id };
  } catch (error) {
    console.error('deleteProgramById', error);
    return { error: 500, message: 'db error' };
  }
};

const deleteEntryById = async (id) => {
  try {
    const sql = 'DELETE FROM TreeniOhjelma WHERE entry_id=?';
    const params = [id];
    const [result] = await promisePool.query(sql, params);
    // console.log(result);
    if (result.affectedRows === 0) {
      return {error: 404, message: 'entry not found'};
    }
    return {message: 'entry deleted', entry_id: id};
  } catch (error) {
    console.error('deleteEntryById', error);
    return {error: 500, message: 'db error'};
  }
};
const findEntryById = async (id) => {
  try {
    const [rows] = await promisePool.query(
        'SELECT * FROM TreeniOhjelma WHERE entry_id = ?',
        [id],
    );
    // console.log('rows', rows);
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};



export {
  listAllEntries,
  listAllEntriesByUserId,
  findProgramById,
  addEntry,
  addEntryToDiary, // Added function to add an entry to DiaryEntries table
  addEntryToTreeniOhjelma, // Added function to add an entry to TreeniOhjelma table
  updateEntryById,
  deleteProgramById,
  deleteEntryById,
  findEntryById,
};
