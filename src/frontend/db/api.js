import { initializeApp } from "firebase/app";
import {
  collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, setDoc,
} from 'firebase/firestore/lite';
import { FIREBASE_CONFIG } from '../web3/api';

const ENV = process.env.NODE_ENV || "testnet";

export class Api {
  leaderboardCollection = `${ENV}/${process.env.CHAIN_NAME}/leaderboard`;
  statsCollection = `${ENV}/${process.env.CHAIN_NAME}/stats`;

  constructor() {
    this.app = initializeApp(FIREBASE_CONFIG);
    this.db = getFirestore(this.app);
  }

  // ------------ Leaderboard ------------

  _calculateRating(data) {
    return data.monsters * 10 + data.zombies;
  }

  async _createNewLeaderboardUser(userId, docRef) {
    const defaultData = {
      name: userId,
      zombies: 0,
      monsters: 0,
      rating: 0
    };
    await setDoc(docRef, defaultData);

    // update total stats - increment total users
    await this.incrementCountUsers();
    return defaultData;
  }

  // Update User leaderboard counter
  setUserLeaderboardCount(userId, field, count) {
    const docRef = doc(this.db, this.leaderboardCollection, userId);
    this.getUserLeaderboard(userId).then(async (data) => {
      if (data[field] !== parseInt(count)) {
        data[field] = parseInt(count);
        data.rating = this._calculateRating(data);
        await setDoc(docRef, data);
      }
    });
  }

  // Get User leaderboard data
  async getUserLeaderboard(userId) {
    const docRef = doc(this.db, this.leaderboardCollection, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }

    // create new user data
    return await this._createNewLeaderboardUser(userId, docRef);
  }

  // Get top users
  async topLeaderboard(countLimit) {
    let result = [];
    const leaderboardRef = collection(this.db, this.leaderboardCollection);
    const userLeaderboard = query(leaderboardRef, orderBy("rating", "desc"), limit(countLimit));
    const querySnapshot = await getDocs(userLeaderboard);
    querySnapshot.forEach((doc) => {
      result.push(doc.data());
    });
    return result;
  }

  // ------------ Total Stats ------------

  async getStats() {
    const docRef = doc(this.db, this.statsCollection, "users");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    // Default object
    return {
      totalUsers: 0,
    };
  }

  async incrementCountUsers() {
    const docRef = doc(this.db, this.statsCollection, "users");
    this.getStats().then(async (stats) => {
      stats.totalUsers += 1;
      await setDoc(docRef, stats);
    });
  }

}





