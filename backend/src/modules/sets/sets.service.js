import pool from '../../config/db.js'

export const getUserSets = async (userId) => {
  const result = await pool.query(
    `SELECT 
      cs.id,
      cs.name,
      cs.description,
      COUNT(c.id) AS total_cards,
      COUNT(c.id) FILTER (WHERE c.status = 'learned') AS learned_cards
     FROM card_sets cs
     LEFT JOIN cards c ON c.card_set_id = cs.id
     WHERE cs.user_id = $1
     GROUP BY cs.id
     ORDER BY cs.id DESC`,
    [userId]
  )
  return result.rows
}

export const createUserSet = async (userId, name, description, cards) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const setResult = await client.query(
      `INSERT INTO card_sets (user_id, name, description) 
       VALUES ($1, $2, $3) RETURNING id`,
      [userId, name, description || null]
    )
    const setId = setResult.rows[0].id

    for (const card of cards) {
      await client.query(
        `INSERT INTO cards (card_set_id, source_word, translated_word, description) 
         VALUES ($1, $2, $3, $4)`,
        [setId, card.source_word, card.translated_word, card.description || null]
      )
    }

    await client.query('COMMIT')
    return setId
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}