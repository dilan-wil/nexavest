import { db } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export const listenToSubCollection = (collect, id, subCollect, callback) => {
    try {
        // Reference to the subcollection
        const subCollectionRef = collection(db, collect, id, subCollect);

        // Set up a real-time listener
        const unsubscribe = onSnapshot(subCollectionRef, (querySnapshot) => {
            if (!querySnapshot.empty) {
                // Map through the documents and get their data
                const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(items); // Pass the updated data to the callback
            } else {
                callback([]); // Pass an empty array if no data exists
            }
        });

        // Return the unsubscribe function to stop listening
        return unsubscribe;
    } catch (error) {
        console.error('Error listening to subcollection:', error);
        return null; // Return null in case of an error
    }
};
