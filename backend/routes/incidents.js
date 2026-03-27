import express from 'express';
import { authenticateToken, verifyRole } from '../middleware/auth.js';
import pool from '../config/database.js';
const router = express.Router();
// =================================================================================================
// Get all incidents (admin only)
router.get('/', authenticateToken, verifyRole(['admin']), async (req, res) => {
  const { type, status, search } = req.query;
  try {
    let query = `
      SELECT i.*, u.username as reporter_name 
      FROM incidents i
      LEFT JOIN users u ON i.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (type && type !== 'all') {
      query += ` AND i.type = $${paramIndex++}`;
      params.push(type);
    }

    if (status && status !== 'all') {
      query += ` AND i.status = $${paramIndex++}`;
      params.push(status);
    }

    if (search) {
      query += ` AND (i.description ILIKE $${paramIndex++} OR i.location ILIKE $${paramIndex++})`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY i.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Failed to fetch incidents.' });
  }
});
// =================================================================================================
// Get incident by ID (admin only)
router.get('/:id', authenticateToken, verifyRole(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT i.*, u.username as reporter_name 
       FROM incidents i
       LEFT JOIN users u ON i.user_id = u.id
       WHERE i.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Incident not found.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching incident:', error);
    res.status(500).json({ error: 'Failed to fetch incident.' });
  }
});
// =================================================================================================
// Create new incident (authenticated users)
router.post('/', authenticateToken, async (req, res) => {
  const { type, description, location, image_url, is_anonymous = false } = req.body;

  if (!type || !description || !location) {
    return res.status(400).json({ error: 'Type, description, and location are required.' });
  }
  try {
    const reporterId = is_anonymous ? null : req.user.id;
    const reporterName = is_anonymous ? 'Anonymous' : req.user.username;

    const result = await pool.query(
      `INSERT INTO incidents (user_id, type, description, location, image_url, status, reporter_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [reporterId, type, description, location, image_url || null, 'pending', reporterName]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating incident:', error);
    res.status(500).json({ error: 'Failed to create incident.' });
  }
});
// =================================================================================================
// Update incident status (admin only)
router.patch('/:id/status', authenticateToken, verifyRole(['admin']), async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const validStatuses = ['pending', 'in_progress', 'resolved'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Valid status is required.' });
  }
  try {
// =================================================================================================
    // Start transaction
    await pool.query('BEGIN');
// =================================================================================================
    // Update incident status
    const incidentResult = await pool.query(
      `UPDATE incidents 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (incidentResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Incident not found.' });
    }
// =================================================================================================
    // Add status history entry
    await pool.query(
      `INSERT INTO status_history (incident_id, status, notes, changed_by)
       VALUES ($1, $2, $3, $4)`,
      [id, status, notes || null, req.user.id]
    );

    await pool.query('COMMIT');

    res.json({
      message: 'Status updated successfully.',
      incident: incidentResult.rows[0]
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status.' });
  }
});
// =================================================================================================
// Get status history for an incident
router.get('/:id/history', authenticateToken, verifyRole(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT sh.*, u.username as changed_by_name
       FROM status_history sh
       LEFT JOIN users u ON sh.changed_by = u.id
       WHERE sh.incident_id = $1
       ORDER BY sh.created_at DESC`,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
});
export default router;