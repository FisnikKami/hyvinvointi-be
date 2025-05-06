import {
  listAllEntries,
  findEntryById,
  addEntry,
  deleteEntryById,
  updateEntryById,
  listAllEntriesByUserId,
} from '../models/entry-model.mjs';

const getEntries = async (req, res) => {
  try {
    const result = await listAllEntriesByUserId(req.user.user_id);
    res.json(result);
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ error: 'Error fetching entries' });
  }
};

const getEntryById = async (req, res) => {
  try {
    const entry = await findEntryById(req.params.id);
    if (entry) {
      res.json(entry);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error fetching entry by ID:', error);
    res.status(500).json({ error: 'Error fetching entry by ID' });
  }
};

const postEntry = async (req, res) => {
  const { name, reps, weight } = req.body;
  const uid = req.user.user_id
  console.log('uid', uid)
  if (uid && name && (weight || reps)) {
  	const newEntry = { uid, name, reps, weight }
    try {
      const result = await addEntry(newEntry);
      if (result.id) {
        res.status(201).json({ message: 'New entry added.', ...result });
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error adding entry:', error);
      res.status(500).json({ error: 'Error adding entry' });
    }
  } else {
    res.sendStatus(400);
  }
};

const putEntry = async (req, res) => {
  const { name, reps, weight } = req.body;
  if (name || weight || reps) {
    try {
      const result = await updateEntryById(req.body);
      if (result.error) {
        res.status(result.error).json(result);
      } else {
        res.status(201).json(result);
      }
    } catch (error) {
      console.error('Error updating entry:', error);
      res.status(500).json({ error: 'Error updating entry' });
    }
  } else {
    res.status(400).json({ error: 400, message: 'Bad request' });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const result = await deleteEntryById(req.params.id);
    if (result.error) {
      res.status(result.error).json(result);
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'Error deleting entry' });
  }
};

const getAllEntries = async () => {
  try {
    const entries = await listAllEntries();
    return entries;
  } catch (error) {
    console.error('Error fetching entries:', error);
    return { error: 'Error fetching entries' };
  }
};

export { getEntries, getEntryById, postEntry, putEntry, deleteEntry, getAllEntries };
