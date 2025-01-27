// import datetime
// import os
// from datetime import datetime, timedelta
// import firebase_admin
// import requests
// import streamlit as st
// from firebase_admin import auth
// from firebase_admin import credentials
// from firebase_admin import firestore
// from firebase_admin import storage

// import cookies_controller

// try:
//     app = firebase_admin.get_app()  # Get the default app
// except ValueError:
//     cred = credentials.Certificate("firebase-key.json")
//     app = firebase_admin.initialize_app(cred)

// web_API_key = "AIzaSyCxvDECSoFJncWgVzI_z2Cry3CtuGMzrn4"

// db = firestore.client()
// users_DB = db.collection("Users")
// deals_DB = db.collection("Deals")
// bucket = storage.bucket("files")


// # Auth Functions

// def logout_user(uid):
//     users_DB.document(uid).update({
//         "log": firestore.firestore.ArrayUnion([
//             {
//                 "date_produced": datetime.now(),
//                 "action": "logout",
//             }
//         ])
//     })
//     try:
//         # Revoke all refresh tokens for the user
//         auth.revoke_refresh_tokens(uid)
//         print(f"User {uid} has been logged out from firebase auth.")
//         st.success("User logged out successfully!")
//     except Exception as e:
//         print(f"Error logging out user {uid}: {e}")


// # def verify_user_token(id_token):
// #     try:
// #         # Verify the ID token sent from the client
// #         token = auth.verify_id_token(id_token)
// #         uid = token['uid']
// #         print(f'Successfully verified user with UID: {uid}')
// #         return {"result": "success", "uid": uid, "token": token}
// #     except Exception as e:
// #         print(f'Error verifying token: {e}')
// #         return None
// #

// def verify_session_cookie(session_cookie):
//     try:
//         decoded_claims = auth.verify_session_cookie(session_cookie, check_revoked=True)
//         print("decoded_claims are : ", decoded_claims)
//         user_uid = decoded_claims.get("uid")
//         email_verified = decoded_claims.get("email_verified")
//         return {"user_uid": user_uid, "email_verified": email_verified}
//     except auth.InvalidSessionCookieError:
//         st.error("Session cookie is invalid, expired or revoked. Please sign in again.")
//         return None
//     except Exception as e:
//         st.error(f"Failed to verify session cookie: {e}")
//         return None


// def handle_signup_user(email, password):
//     try:
//         user = auth.create_user(email=email, password=password)
//         users_DB.document(user.uid).set({
//             "log": [],
//             "businessName": "",
//             "credits": 10000,
//             "subscriptionPlan": "pro",
//             "creditHistory": [

//                 {
//                     "date": "2024-11-08",
//                     "amount": -10,
//                     "reason": "Deal upload"
//                 }
//             ],
//             "billingInfo": {
//                 "billingAddress": "",
//                 "vatNumber": "",
//                 "paymentMethod": ""
//             },
//             "purchaseHistory": [
//                 {
//                     "purchaseId": "uniqueId",
//                     "date": "2024-11-08",
//                     "creditsPurchased": 10000,
//                     "amountPaid": 49.99
//                 }
//             ],
//             "contactInfo": {
//                 "contactPerson": "",
//                 "phone": "",
//                 "email": ""
//             },
//             "roles": ["admin"],
//             "accountStatus": "active"
//         })
//         print("User created successfully. uid is : ", user.uid)
//         sign_in_with_email_and_password(email, password)
//         return {"result": "success", "user_uid": user.uid}
//     except requests.exceptions.RequestException as e:
//         st.session_state["authentication_status"] = False
//         return f"Error during sign-in: {e}"


// def sign_in_with_email_and_password(email, password):
//     # Firebase sign-in URL with API key
//     url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={web_API_key}"

//     # Payload for the request
//     payload = {
//         "email": email,
//         "password": password,
//         "returnSecureToken": True
//     }
//     try:
//         # Sending POST request to Firebase Authentication REST API
//         response = requests.post(url, json=payload)
//         response.raise_for_status()  # Raise error for bad status codes

//         # Parse the JSON response
//         data = response.json()
//         user_token = data['idToken']  # Firebase ID token for authenticated user
//         user_uid = data['localId']  # User's unique Firebase ID

//         # generate a session cookie after successful login for 5 days
//         try:
//             session_cookie = auth.create_session_cookie(user_token, expires_in=timedelta(
//                 days=10))  # Set cookie expiration (e.g., 5 days)
//         except Exception as e:
//             st.error(f"Failed to create a session cookie: {e}")
//             return None

//         # Set the token and uid in session and in cookies
//         print("Sign-in successful.")

//         # Return the result
//         return {"response": {
//             "result": "success",
//             "user_token": user_token,
//             "user_uid": user_uid,
//             "session_cookie": session_cookie,
//         }}
//     except requests.exceptions.RequestException as e:
//         print(e.response.json()["error"]["errors"][0]["message"])
//         return {"status": "error", "result": e.response}


// # Firestore Functions

// def save_deal_to_firebase(deal_data):
//     if "user_uid" in st.session_state:
//         user_uid = st.session_state["user_uid"]
//         deal = {
//             "props": {
//                 "created_at": datetime.datetime.now(),
//                 "updated_at": datetime.datetime.now(),
//                 "user_uid": user_uid,
//                 "docs_downloaded": [],
//                 "docs_sent_by_email": [],
//             },
//             "data": deal_data
//         }
//         try:
//             new_doc = deals_DB.document()
//             new_doc.set(deal)
//             return {"result": "success", "deal_id": new_doc.id}
//         except requests.RequestException as e:
//             return {"result": "error", "status": e}
//     else:
//         return {"result": "error", "status": "user_uid not found"}


// def update_deal_on_firebase(deal_id, deal_data):
//     deals_DB.document(deal_id).update({"data": deal_data})


// def get_deals_from_firebase():
//     # return [{"id": doc.id, "data": doc.to_dict()["data"]} for doc in deals_DB.get()]
//     if "user_uid" in st.session_state:
//         user_uid = st.session_state["user_uid"]
//         try:
//             deals = deals_DB.where("props.user_uid", "==", user_uid)
//             print(deals.get())
//             return [{"id": doc.id, "data": doc.to_dict()["data"]} for doc in deals.get()]
//         except requests.RequestException as e:
//             return {"result": "error", "status": e}


// def get_one_deal_from_database(deal_id):
//     return deals_DB.document(deal_id).get().to_dict()


// def delete_deal_from_database(deal_id):
//     deals_DB.document(deal_id).delete()


// def update_docs_to_download(deal_id):
//     user_ip = get_public_ip()
//     deals_DB.document(deal_id).update({
//         "props.docs_downloaded": firestore.firestore.ArrayUnion([
//             {
//                 "date_produced": datetime.datetime.now(),
//                 "user_ip": user_ip,
//                 "user_name": os.getlogin()
//             }
//         ])
//     })


// def update_docs_to_mail(deal_id, email):
//     user_ip = get_public_ip()
//     deals_DB.document(deal_id).update(
//         {
//             "props.docs_sent_by_email": firestore.firestore.ArrayUnion([
//                 {
//                     "date_produced": datetime.datetime.now(),
//                     "sent_to_mail_address": email,
//                     "user_ip": user_ip,
//                     "user_name": os.getlogin()
//                 }
//             ])
//         })


// def get_public_ip():
//     try:
//         response = requests.get('https://api.ipify.org?format=json')
//         response.raise_for_status()  # Check if the request was successful
//         ip_data = response.json()
//         return ip_data['ip']
//     except requests.RequestException as e:
//         print(f"An error occurred: {e}")
//         return


// # Storage functions
// def download_documents_from_firebase(files):
//     for index, file in files:


//         """Uploads a Word document to Firebase Storage.

//         Args:
//             file_path: The path to the Word document file.
//             bucket_name: The name of your Firebase Storage bucket.
//             file_name: The desired name for the file in Firebase Storage.
//         """

//         # Create a reference to the Firebase Storage bucket
//         blob = bucket.blob(index)

//         # Open the Word document and convert it to a byte stream
//         with open(file, 'rb') as f:
//             blob.upload_from_file(f)

//         # Get the public URL of the uploaded file
//         public_url = blob.public_url
//         print(public_url)
//         return public_url



