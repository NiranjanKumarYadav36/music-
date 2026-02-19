
import type { PostProcessingParameters } from '../components/MusicGenerator/types';

const DB_NAME = 'MusicGenDB';
const STORE_NAME = 'tracks';
const DB_VERSION = 1;

// Interface for what we store in DB (slightly different from App state)
export interface DBTrack {
    id: number;
    prompt: string;
    duration: string;
    date: string;
    audioBlob: Blob; // Store Blob directly instead of Base64
    advancedSettings?: PostProcessingParameters;
    isEdited?: boolean;
}

export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("IndexedDB error:", event);
            reject("Could not open database");
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };
    });
};

export const addTrack = async (track: Omit<DBTrack, 'id'> & { id?: number }): Promise<number> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        // Ensure ID exists
        const trackToSave = { ...track, id: track.id || Date.now() };

        const request = store.put(trackToSave);

        request.onsuccess = () => {
            resolve(trackToSave.id);
        };

        request.onerror = () => {
            reject("Error adding track");
        };
    });
};

export const getAllTracks = async (): Promise<DBTrack[]> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            // Sort by date/id descending (newest first)
            const tracks = request.result as DBTrack[];
            tracks.sort((a, b) => b.id - a.id);
            resolve(tracks);
        };

        request.onerror = () => {
            reject("Error getting tracks");
        };
    });
};

export const deleteTrack = async (id: number): Promise<void> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            reject("Error deleting track");
        };
    });
};
