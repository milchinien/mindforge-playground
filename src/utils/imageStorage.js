import { openDB } from 'idb'

const DB_NAME = 'mindforge-images'
const STORE_NAME = 'images'
const DB_VERSION = 1

function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    },
  })
}

export async function saveImage(key, blob) {
  const db = await getDb()
  await db.put(STORE_NAME, blob, key)
  return key
}

export async function getImage(key) {
  const db = await getDb()
  return db.get(STORE_NAME, key)
}

export async function deleteImage(key) {
  const db = await getDb()
  await db.delete(STORE_NAME, key)
}

export async function getImageUrl(key) {
  const blob = await getImage(key)
  if (!blob) return null
  return URL.createObjectURL(blob)
}

export async function saveImageFromFile(file, keyPrefix = 'img') {
  const key = `${keyPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  await saveImage(key, file)
  return key
}

export async function clearAllImages() {
  const db = await getDb()
  await db.clear(STORE_NAME)
}
