export const showToast = (
  setToast: any,
  msg: string,
  type: 'success' | 'error' = 'success'
) => {
  setToast({ msg, type })
  setTimeout(() => setToast(null), 3000)
}

export const passwordValid = (password: string) => {
  return /^(?=.*[A-Z])(?=.*[\W_]).{10,}$/.test(password)
}