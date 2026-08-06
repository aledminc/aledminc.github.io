// ============================================================
// PERSISTENCE SEAM — currently Option 1 from the build plan.
//
// GitHub Pages is static, so there is no server to hold a shared signature
// wall. Signatures therefore live in React state only: the board resets on
// reload. That is deliberate for v1 — zero backend, zero cost, no moderation
// surface.
//
// Option 2 (a wall shared across visitors) slots in HERE and nowhere else.
// Point these two functions at a client-SDK database — Firebase Firestore,
// Supabase, or similar — and the component keeps working unchanged:
//
//   export async function saveSignature(mark) {
//     await addDoc(collection(db, 'signatures'), mark)
//   }
//   export async function loadSignatures() {
//     const snap = await getDocs(query(collection(db, 'signatures'),
//                                      orderBy('createdAt'), limit(40)))
//     return snap.docs.map((d) => d.data())
//   }
//
// Before doing that, note two things the plan flags: it needs API keys in the
// client bundle, and anyone can draw anything — a shared wall needs at least a
// report/hide moderation path.
// ============================================================

/**
 * Persist one signature. No-op in the static build; the board holds marks in
 * React state. Async so swapping in a real store needs no caller changes.
 * @param {object} mark
 */
export async function saveSignature(mark) {
  void mark
  return null
}

/**
 * Load previously saved signatures. Always empty in the static build.
 * @returns {Promise<Array<object>>}
 */
export async function loadSignatures() {
  return []
}
