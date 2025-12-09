export async function logout() {
  try {
    const res = await fetch('/api/auth/logout')
    if (res.ok) {
      window.location.href = '/'
    }
  } catch (err) {
    console.log('failed to log out', err)
  }
}