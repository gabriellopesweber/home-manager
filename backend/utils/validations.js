function validateRequiredFields(fields) {
  const missing = Object.entries(fields)
    .filter(([key, value]) => value === undefined || value === null || value === '')
    .map(([key]) => key)

  if (missing.length > 0) {
    return {
      valid: false,
      message: `Os seguintes campos são obrigatórios: ${missing.join(', ')}`
    }
  }

  return { valid: true }
}

export { validateRequiredFields }