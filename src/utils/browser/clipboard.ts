const writeWithSelection = (text: string) => {
  const field = document.createElement('textarea')
  field.value = text
  field.setAttribute('readonly', '')
  field.className = 'pointer-events-none fixed top-0 left-0 opacity-0'
  document.body.append(field)
  field.select()

  const copied = document.execCommand('copy')
  field.remove()
  return copied
}

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // The async clipboard API rejects outside a secure context and whenever the
    // document is not focused; the selection path still works in both cases.
    try {
      return writeWithSelection(text)
    } catch {
      return false
    }
  }
}
