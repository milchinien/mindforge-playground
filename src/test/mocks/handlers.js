import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock Firebase Auth REST API
  http.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword', () => {
    return HttpResponse.json({
      idToken: 'mock-token',
      email: 'test@mindforge.dev',
      localId: 'test-uid-123',
      registered: true,
    })
  }),

  http.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp', () => {
    return HttpResponse.json({
      idToken: 'mock-token',
      email: 'new@mindforge.dev',
      localId: 'new-uid-456',
    })
  }),

  // Mock Firestore REST API (basic)
  http.post('https://firestore.googleapis.com/*', () => {
    return HttpResponse.json({ documents: [] })
  }),
]
