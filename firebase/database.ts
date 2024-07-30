import { FirebaseApp, initializeApp } from "firebase/app";
import { DataSnapshot, Database, child, endAt, get, getDatabase, off, onValue, orderByChild, push, query, ref, remove, set, startAt, update } from "firebase/database";
import { FirebaseStorage, getStorage, uploadBytes, ref as storageRef, getDownloadURL, deleteObject, list } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "northen-aef64.firebaseapp.com",
  databaseURL: "https://northen-aef64-default-rtdb.firebaseio.com",
  projectId: "northen-aef64",
  storageBucket: "northen-aef64.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

/**
 * This class is used to interact with the Firebase database and
 * Firebase storage.
 * 
 * This class is a singleton.
 * 
 * This is the web implementation of the database.
 */
export class WebDatabase {
  static instance: WebDatabase;
  private app: FirebaseApp;
  private database: Database;
  private storage: FirebaseStorage

  private constructor() {
    this.app = initializeApp(firebaseConfig);
    this.database = getDatabase(this.app);
    this.storage = getStorage(this.app);
  }

  /**
   * Return or create the singleton instance of the database.
   * @returns The singleton instance of the database.
   */
  static getInstance(): WebDatabase {
    if (!WebDatabase.instance) {
      WebDatabase.instance = new WebDatabase();
    }

    return WebDatabase.instance;
  }

  /**
   * Read data from the database once.
   * @param path database path to read.
   * @returns a promise with the data read.
   */
  readOnce(path: string): Promise<DataSnapshot>{
    return get(child(ref(this.database), path));
  }

  /**
   * Add a listener to the database to read data.
   * @param path database path to read.
   * @param callback function to call when the data is read.
   * @returns a reference to the read.
   */
  read(path: string, callback: (snapshot: DataSnapshot) => void) {
    return onValue(ref(this.database, path), callback);
  }

  readOrderPrice(path: string, minPrice: number, maxPrice: number, callback: (snapshot: DataSnapshot) => void) {
    const dbRef = query(ref(this.database, path), orderByChild('price'), startAt(minPrice), endAt(maxPrice));
    return onValue(dbRef, callback);
  }

  /**
   * Remove a listener to the database to read data.
   * @param path database path to read.
   * @param readReference read listener reference to remove.
   * @returns 
   */
  stopRead(path: string, readReference: any) {
    return off(ref(this.database, path), 'value', readReference);
  }

  /**
   * Obtain a new reference to the database to create a new entry.
   * @param path Database path to create a new reference.
   * @returns A new reference to the database.
   */
  getNewRef(path: string): any {
    return push(child(ref(this.database), path));
  }

  /**
   * Push a new entry to the database.
   * @param reference database reference to push data.
   * @param data data to push.
   * @returns a promise with the result of the push.
   */
  pushData(reference: any, data: any): Promise<void> {
    return set(reference, data);
  }

  /**
   * Update a database entry
   * @param path path to update.
   * @param data data to update.
   * @returns promise with the result of the update.
   */
  updateData(path: string, data: any) {
    const updates = {
      [path]: data
    };
    return update(ref(this.database), updates);
  }

  updateMultiples(updates: any) {
    return update(ref(this.database), updates);
  }

  /**
   * Delete a database entry.
   * @param path path to delete.
   * @returns a promise with the result of the delete.
   */
  deleteData(path: string): Promise<void> {
    return remove(ref(this.database, path));
  }

  /**
   * Upload a file to the firebase storage.
   * @param path firebase storage path to upload the file.
   * @param filePath file uri to upload.
   * @returns a task with the result of the upload.
   */
  async uploadFile(path: string, filePath: string) {
    const blob: Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", filePath, true);
      xhr.send(null);
    });

    return uploadBytes(storageRef(this.storage, path), blob);
  }

  listImages(path: string) {
    const listRef = storageRef(this.storage, path);

    return list(listRef);
  }

  deleteFile(path: string): Promise<void> {
    return deleteObject(storageRef(this.storage, path));
  }

  getFileUrl(reference: any) {
    return getDownloadURL(reference);
  }

  getUserInfo(uid: string): Promise<DataSnapshot> {
    return get(child(ref(this.database), `users/${uid}`));
  }
}