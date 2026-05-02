export const parseCardsText = (text) => {
  const lines = text.trim().split('\n').filter(Boolean)
  const cards = []
  const errors = []

  lines.forEach((line, i) => {
    // Определяем разделитель
    const separator = line.includes('\t') ? '\t'
      : line.includes(';') ? ';'
      : ','

    const parts = line.split(separator).map((s) => s.trim())

    if (parts.length < 2 || !parts[0] || !parts[1]) {
      errors.push(`Line ${i + 1}: "${line}"`)
      return
    }

    cards.push({
      source_word: parts[0],
      translated_word: parts[1],
      description: parts[2] || '',
    })
  })

  return { cards, errors }
}