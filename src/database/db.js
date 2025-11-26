import Dexie from 'dexie';

export const db = new Dexie('PenletDB');

db.version(1).stores({
  users: '++id, email, username',
  notes: '++id, userId, subjectId, title, createdAt, updatedAt',
  subjects: '++id, userId, name, color',
  timetable: '++id, userId, subjectId, dayOfWeek, startTime, endTime',
  chatMessages: '++id, userId, sessionId, role, content, timestamp',
  chatRooms: '++id, userId, name, createdAt',
  chatRoomMessages: '++id, roomId, userId, content, timestamp',
  quizzes: '++id, userId, subjectId, title, createdAt',
  quizQuestions: '++id, quizId, question, options, correctAnswer, type',
  quizAttempts: '++id, userId, quizId, score, completedAt',
  flashcards: '++id, userId, subjectId, front, back, createdAt',
  videos: '++id, userId, subjectId, title, url, duration',
  documents: '++id, userId, title, content, createdAt',
  alarms: '++id, userId, title, time, repeat, enabled',
  notifications: '++id, userId, title, message, read, createdAt',
  analytics: '++id, userId, type, data, timestamp',
  games: '++id, userId, type, score, completedAt',
  settings: '++id, userId, key, value'
});

// Helper functions for offline data management
export const syncQueue = {
  async add(operation) {
    const queue = await db.table('syncQueue').toArray();
    await db.table('syncQueue').add({
      ...operation,
      timestamp: new Date().toISOString(),
      synced: false
    });
  },

  async getUnsyncedItems() {
    return await db.table('syncQueue').where('synced').equals(false).toArray();
  },

  async markSynced(id) {
    await db.table('syncQueue').update(id, { synced: true });
  }
};

export default db;