import pool from '../../config/db.js'

export const getSetCards = async (setId, userId) => {
  const setResult = await pool.query(
    `SELECT id, name, description FROM card_sets WHERE id = $1 AND user_id = $2`,
    [setId, userId]
  )
  if (!setResult.rows.length) throw new Error('Set not found')

  // Сначала берём не пройденные, если все learned — берём все
  const notLearned = await pool.query(
    `SELECT id, source_word, translated_word, description, status, review_count
     FROM cards WHERE card_set_id = $1 AND status != 'learned'`,
    [setId]
  )

  const cards = notLearned.rows.length
    ? notLearned.rows
    : (await pool.query(
        `SELECT id, source_word, translated_word, description, status, review_count
         FROM cards WHERE card_set_id = $1`,
        [setId]
      )).rows

  return { set: setResult.rows[0], cards }
}

export const updateStatus = async (cardId, status) => {
  await pool.query(
    `UPDATE cards 
     SET status = $1, review_count = review_count + 1
     WHERE id = $2`,
    [status, cardId]
  )
}