export function validateTemplateGame(gameData) {
  const errors = []

  // Basic settings
  if (!gameData.title?.trim()) errors.push('Titel ist erforderlich')
  else if (gameData.title.length < 3) errors.push('Titel muss mindestens 3 Zeichen lang sein')
  else if (gameData.title.length > 100) errors.push('Titel darf maximal 100 Zeichen lang sein')

  if (!gameData.description?.trim()) errors.push('Beschreibung ist erforderlich')
  else if (gameData.description.length < 10) errors.push('Beschreibung muss mindestens 10 Zeichen lang sein')

  if (!gameData.subject) errors.push('Fach ist erforderlich')

  // Questions
  if (!gameData.questions || gameData.questions.length < 3) {
    errors.push('Mindestens 3 Fragen sind erforderlich')
  } else {
    gameData.questions.forEach((q, i) => {
      if (!q.text?.trim()) errors.push(`Frage ${i + 1}: Fragetext fehlt`)
      if (!q.options || q.options.length < 2) errors.push(`Frage ${i + 1}: Mindestens 2 Antworten noetig`)
      else {
        const hasCorrect = q.options.some(o => o.isCorrect)
        if (!hasCorrect) errors.push(`Frage ${i + 1}: Keine korrekte Antwort markiert`)
        const emptyOptions = q.options.filter(o => !o.text?.trim())
        if (emptyOptions.length > 0) errors.push(`Frage ${i + 1}: Leere Antwortoptionen`)
      }
    })
  }

  // Tags
  if (!gameData.tags || gameData.tags.length === 0) errors.push('Mindestens ein Tag ist erforderlich')

  // Thumbnail
  if (!gameData.thumbnailRef) errors.push('Thumbnail ist erforderlich')

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateFreeformGame(gameData) {
  const errors = []

  if (!gameData.title?.trim()) errors.push('Titel ist erforderlich')
  if (!gameData.description?.trim()) errors.push('Beschreibung ist erforderlich')
  if (!gameData.code?.html?.trim()) errors.push('HTML-Code ist erforderlich')

  return {
    isValid: errors.length === 0,
    errors,
  }
}
