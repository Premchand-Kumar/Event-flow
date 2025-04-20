import { pool } from '../db.js';

export const getEvents = async (req, res) => {
  const events = await pool.query('SELECT * FROM events');
  res.json(events.rows);
};

export const createEvent = async (req, res) => {
  const { title, date, description } = req.body;
  await pool.query(
    'INSERT INTO events (title, date, description) VALUES ($1, $2, $3)',
    [title, date, description]
  );
  res.status(201).json({ message: 'Event created' });
};
