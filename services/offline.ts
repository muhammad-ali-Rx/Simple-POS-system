import { openDB } from 'idb';

const dbPromise = openDB('pos-offline-db', 1, {
  upgrade(db) {
    db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
  }
});

export const saveOfflineOrder = async (order: any) => {
  const db = await dbPromise;
  await db.add('orders', {
    ...order,
    synced: false
  });
};

export const getOfflineOrders = async () => {
  const db = await dbPromise;
  return db.getAll('orders');
};
