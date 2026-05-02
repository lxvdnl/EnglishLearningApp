CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    login TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS card_sets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY,
    card_set_id INTEGER NOT NULL REFERENCES card_sets(id) ON DELETE CASCADE,
    source_word TEXT NOT NULL,
    translated_word TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    description TEXT,
    review_count INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_card_set_user_id ON card_sets(user_id);
CREATE INDEX IF NOT EXISTS idx_card_set_id ON cards(card_set_id);
CREATE INDEX IF NOT EXISTS idx_card_status ON cards(status);