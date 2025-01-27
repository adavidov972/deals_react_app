import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, getDocs, Timestamp, query, where, orderBy, arrayUnion } from "firebase/firestore";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8UnzOfNole6dX7rwYjYOiEvZZRfzErSM",
  authDomain: "realestatedealsmanagment.firebaseapp.com",
  databaseURL: "https://realestatedealsmanagment.firebaseio.com",
  projectId: "realestatedealsmanagment",
  storageBucket: "realestatedealsmanagment.appspot.com",
  messagingSenderId: "214228310392",
  appId: "1:214228310392:web:6ddf65a2fc328bd3f0d08d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app); // ייצוא של db

// Initialize Auth
export const auth = getAuth(app);

//Auth functions:

export const loginUserToFirebase = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return {
      "result": "success",
      "uid": auth.currentUser.uid
    }
  } catch (error) {
    // Throw the error to make sure it gets caught in the calling function
    throw new Error(error.message)
  }
};

export const logoutUserFromFirebase = async () => {
  try {
    await signOut(auth);
    return {
      "result": "success",
    }
  } catch (error) {
    return {
      "result": "failed",
      "message": error.message
    };
  }
}

// Firestore functions 

export const docsDownload = async (dealId) => {
  const dealRef = doc(db, "Deals", dealId)
  try {
    await updateDoc(
      
      dealRef,
      {
        "props.updated_at": arrayUnion([
          {
            "date_produced": new Date(),
            "user_ip": "",
            "user_name": auth.currentUser.displayName
        }
        ])
      }

    )
    return { result: "success", id: dealRef.id }; // Return the result
  } catch (error) {
    console.error("Error sending new deal to the server:", error);
    throw error;
  }
}


// Fetch a deal by ID
export const fetchDealFromServer = async (dealId) => {
  try {
    const dealRef = doc(db, "Deals", dealId); // Reference to the specific document
    const dealSnap = await getDoc(dealRef);

    if (dealSnap.exists()) {
      console.log("Document snapshot is:", dealSnap.data());
      return dealSnap.data(); // Return the document data
    } else {
      console.error("Document not found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};

// Save a deal to the server
export const saveDealToServer = async (dealData) => {
  // const contractDate = Timestamp.fromDate(dealData["CONTRACT_DATE"])
  // dealData["CONTRACT_DATE"] = contractDate
  // Construct the data structure
  const data = {
    props: {
      created_at: Timestamp.fromDate(new Date()),
      updated_at: Timestamp.fromDate(new Date()),
      user_uid: auth.currentUser ? auth.currentUser.uid : null, // Get the user UID if logged in
      docs_downloaded: [],
      docs_sent_by_email: [],
    },
    data: dealData, // Attach deal data
  };

  console.log(data);


  try {
    // Get a reference to the "Deals" collection
    const dealsCollection = collection(db, "Deals");

    // Add a new document with auto-generated ID
    const newDocRef = doc(dealsCollection);
    await setDoc(newDocRef, data);

    console.log("Deal saved successfully:", newDocRef.id);
    return { result: "success", id: newDocRef.id }; // Return the result
  } catch (error) {
    console.error("Error sending new deal to the server:", error);
    throw error;
  }
};

export const updateDealOnServer = async (dealId, data) => {
  const dealRef = doc(db, "Deals", dealId)
  try {
    await updateDoc(dealRef, { "props.updated_at": new Date().toString(), "data": data })
    return { result: "success", id: dealRef.id }; // Return the result
  } catch (error) {
    console.error("Error sending new deal to the server:", error);
    throw error;
  }
}

export const fetchAllUserDealsFromServer = async () => {
  const dealsQuery = query(collection(db, "Deals"), where("props.user_uid", "==", auth.currentUser.uid), orderBy("props.updated_at", "desc"))
  try {
    const dealsSnapshot = await getDocs(dealsQuery);
    const deals = dealsSnapshot.docs.map((deal) => ({ id: deal.id, ...deal.data() }))
    return deals
  } catch (error) {
    console.error("Error reding deals from the server:", error);
    throw error;
  }
}
