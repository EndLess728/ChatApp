import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";

/**
 * Custom hook to listen to a Firestore collection.
 * @param {string} collectionName - Name of the Firestore collection.
 * @returns {{ data: Array, loading: boolean, error: Error | null }}
 */
export const useFirestoreCollection = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName) {
      setError(new Error("Collection name must be provided"));
      setLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection(collectionName)
      .onSnapshot(
        (snapshot) => {
          const collectionData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData(collectionData);
          setLoading(false);
        },
        (err) => {
          console.error(`Error listening to ${collectionName}:`, err);
          setError(err);
          setLoading(false);
        }
      );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
};
