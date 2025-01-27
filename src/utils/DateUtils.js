
import { Timestamp } from "firebase/firestore";

export const formatDateToDashboardList = (serverDate) => {
    if (serverDate instanceof Timestamp) {
      return serverDate.toDate().toLocaleDateString("en-GB")
    }
    return ""
  }

  export const formatDateToDealForm = (serverDate) => {
    if (serverDate instanceof Timestamp) {
      return serverDate.toDate().toLocaleDateString("en-CA")
    }
    return ""
  }
