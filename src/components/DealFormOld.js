// import React, { useState, useEffect, useRef } from "react";
// import '../CSS/DealForm.css';
// import { useNavigate, useParams } from "react-router-dom";
// import { fetchDealFromServer, saveDealToServer, updateDealOnServer } from "../firebase.js";
// import Swal from "sweetalert2";
// import axios from "axios";

// const DealForm = () => {
//   const { dealId } = useParams();// קבלת dealId מה-URL
//   const [dealData, setDealData] = useState();
//   const [numSellers, setNumSellers] = useState();
//   const [numBuyers, setNumBuyers] = useState();
//   const formRef = useRef({});  // יצירת reference לטופס
//   const navigate = useNavigate()

//   const tabu_array = ["תל אביב", "פתח תקוה", "רחובות", "באר שבע", "ירושלים", "נצרת", "חיפה", "נתניה"]
//   const tax_office_array = ["תל אביב", "מרכז", "רחובות", "נתניה", "ירושלים", "באר שבע", "חיפה", "טבריה", "נצרת", "חדרה"]
//   const ptor_array = ["סעיף 49 ב (2)", "סעיף 49 ב (5)", "סעיף 49 ב (6)", "סעיף 49 ה", "סעיף 62", "ללא פטור"]

//   const handleSaveDealToServer = async (e) => {
//     e.preventDefault(); // ביטול שליחת טופס ברירת מחדל
//     // איסוף הנתונים מהטופס

//     const dealData = {
//       "BLOCK": formRef.current.block.value,
//       "PARCEL": formRef.current.parcel.value,
//       "SUB_PARCEL": formRef.current.sub_parcel.value,
//       "AREA": formRef.current.area.value,
//       "ADDRESS": formRef.current.address.value,
//       "CITY": formRef.current.city.value,
//       "CONTRACT_DATE": "2025-01-05",
//       "PRICE": formRef.current.price.value,
//       "TABU": formRef.current.tabu.value,
//       "RIGHTS_KIND": formRef.current.rights_kind.value,
//       "TAX_OFFICE": formRef.current.tax_office.value,
//       "PTOR": formRef.current.ptor.value,
//       "SELLER_ADVOCATE": formRef.current.sellers_advocate.value,
//       "SELLER_IMUT": formRef.current.sellers_imut.value,
//       "SELLER_LICENSE": formRef.current.sellers_license.value,
//       "BUYER_ADVOCATE": formRef.current.buyers_advocate.value,
//       "BUYER_IMUT": formRef.current.buyers_imut.value,
//       "BUYER_LICENSE": formRef.current.buyers_license.value,
//       "PARTS_TO_TRANSFER": formRef.current.parts.value,
//       "DESCRIPTION": formRef.current.is_sub_parcel.checked ? "כמפורט בפנקס הבתים המשותפים" : "כמפורט בפנקסי המקרקעין",
//       "SELLERS_DICT": [],
//       "BUYERS_DICT": [{ 'LAST_NAME': '', 'FIRST_NAME': '', 'ID_KIND': 'ת.ז.', 'ID': '', 'PARTS': '', 'IS_FIRM': false }],
//     };

//     if (!numSellers) {
//       dealData["SELLERS_DICT"] = [{ 'LAST_NAME': '', 'FIRST_NAME': '', 'ID_KIND': 'ת.ז.', 'ID': '', 'PARTS': '', 'IS_FIRM': false }]
//     }

//     if (!numBuyers) {
//       dealData["BUYERS_DICT"] = [{ 'LAST_NAME': '', 'FIRST_NAME': '', 'ID_KIND': 'ת.ז.', 'ID': '', 'PARTS': '', 'IS_FIRM': false }]
//     }
//     // איסוף המוכרים והקונים מהטבלאות
//     for (let i = 0; i < numSellers; i++) {
//       dealData["SELLERS_DICT"].push({
//         "LAST_NAME": formRef.current[`seller_last_name_${i}`]?.value,
//         "FIRST_NAME": formRef.current[`seller_first_name_${i}`]?.value,
//         "ID_KIND": formRef.current[`seller_id_kind_${i}`]?.value,
//         "ID": formRef.current[`seller_id_${i}`]?.value,
//         "PARTS": formRef.current[`seller_parts_${i}`]?.value,
//         "IS_FIRM": formRef.current[`seller_is_firm_${i}`]?.checked,
//       });
//     }

//     for (let i = 0; i < numBuyers; i++) {
//       dealData["BUYERS_DICT"].push({
//         "LAST_NAME": formRef.current[`buyer_last_name_${i}`]?.value,
//         "FIRST_NAME": formRef.current[`buyer_first_name_${i}`]?.value,
//         "ID_KIND": formRef.current[`buyer_id_kind_${i}`]?.value,
//         "ID": formRef.current[`buyer_id_${i}`]?.value,
//         "PARTS": formRef.current[`buyer_parts_${i}`]?.value,
//         "IS_FIRM": formRef.current[`buyer_is_firm_${i}`]?.checked,
//       });
//     }

//     const response = dealId ? await updateDealOnServer(dealId, dealData) : await saveDealToServer(dealData)

//     const result = await Swal.fire({
//       title: dealId ? "הנתונים עודכנו בהצלחה !" : "העסקה נוצרה בהצלחה !",
//       text: "איך תרצה לקבל את מסמכי העסקה",
//       showConfirmButton: true,
//       showCancelButton: true,
//       confirmButtonText: "משלוח בדוא״ל",
//       cancelButtonText: "הורדה מיידית",
//       icon: "success",
//       width: 800
//     })

//     if (result.isConfirmed) {
//       const { value: email } = await Swal.fire({
//         title: "לאיזו כתובת דוא״ל תרצה לקבל את המסמכים ?",
//         input: "email",
//         inputPlaceholder: "Enter your email address"
//       });
//       if (email) {

//         const swalInstance = Swal.fire({
//           title: 'הקבצים בהכנה ...',
//           text: 'המתן להשלמת הכנת הקבצים',
//           allowOutsideClick: false, // Disable clicking outside to close
//           showCancelButton: false,
//           didOpen: () => {
//             Swal.showLoading(); // Show the spinner
//           },
//         });


//         const payload = {
//           "values": dealData,
//           "output_method": "mail",
//           "email_address": email
//         }
//         try {
//           const response = await axios.post("http://127.0.0.1:5000/create", payload);
//           console.log(response.data);
//           if (response.data["result"] === "success") {
//             console.log("now Fire");

//             Swal.fire({
//               title: " הקבצים נשלחו בהצלחה לכתובת :",
//               text: email,
//               showConfirmButton: true,
//               icon: "success",
//             }).then(() => {
//               navigate("/dashboard"); // חזרה ל-dashboard
//             })

//           }
//         } catch (error) {
//           console.error('Error is :', error);
//           Swal.fire({
//             title: "אירעה שגיאה ביצירת המסמכים !",
//             showConfirmButton: true,
//             text: error,
//             icon: "error",
//             imageWidth: 400,
//             imageHeight: 200,
//             imageAlt: "Custom image",
//           })
//         }
//         finally {
//           swalInstance.close()
//         }
//       }
//     }

//     else if (result.dismiss) {
//       // הורדת הקבצים לקובץ zip

//       const swalInstance = Swal.fire({
//         title: 'הקבצים בהכנה ...',
//         text: 'המתן להשלמת הכנת הקבצים',
//         allowOutsideClick: false, // Disable clicking outside to close
//         showCancelButton: false,
//         didOpen: () => {
//           Swal.showLoading(); // Show the spinner
//         },
//       });

//       const payload = {
//         values: dealData,
//         output_method: "download",
//       };
//       try {
//         const response = await axios.post("http://127.0.0.1:5000/create", payload, {
//           responseType: "blob", // Ensure the server responds with a Blob
//         });

//         // Extract filename from headers or set a default name
//         const filename = response.headers["content-disposition"]
//           ?.split("filename=")[1]
//           ?.replace(/"/g, "") || "document.zip";

//         // Create a URL for the Blob and trigger download
//         const blob = new Blob([response.data], { type: response.data.type });
//         const link = document.createElement("a");
//         link.href = window.URL.createObjectURL(blob);
//         link.download = filename;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         console.log("File downloaded successfully!");
//         Swal.fire({
//           title: "הכנת הקבצים הושלמה",
//           icon: "success",
//           text: "הקבצים נשמרו בהצלחה בתיקיית ההורדות !",
//         })
//           .then(() => {
//             navigate("/dashboard"); // חזרה ל-dashboard
//           })

//       } catch (error) {
//         console.error("Error downloading file:", error);
//         Swal.fire({
//           title: "אירעה שגיאה בעת הורדת הקבצים. נסה שנית",
//           icon: "error",
//           text: error.message,
//         });
//       }
//       finally {
//         swalInstance.close()
//       }
//     }

//   }


//   // מביא את נתוני העסקה אם קיים dealId
//   useEffect(() => {
//     const fetchDealData = async () => {
//       try {
//         if (dealId) {
//           const deal = await fetchDealFromServer(dealId);
//           setDealData(deal.data);
//           console.log("Deal data from forst useEffect is : ", deal.data);

//           if (deal.data.SELLERS_DICT.length) {
//             setNumSellers(deal.data.SELLERS_DICT.length);
//           }

//           if (deal.data.BUYERS_DICT.length) {
//             setNumBuyers(deal.data.BUYERS_DICT.length);
//           }

//         } else {
//           console.warn("No dealId provided!");
//         }
//       } catch (error) {
//         console.error("Error fetching deal data:", error);
//       }
//     };
//     fetchDealData();
//   }, [dealId]);


//   // שינוי מספר מוכרים/קונים
//   const handleSellerChange = (e) => setNumSellers(e.target.value);
//   const handleBuyerChange = (e) => setNumBuyers(e.target.value);

//   // יצירת טבלת מוכרים
//   const renderSellersTable = () => {
//     const sellers = [];
//     for (let i = 0; i < numSellers; i++) {
//       sellers.push(
//         <tr key={`seller_${i}`}>
//           <td><input type="text" name={`seller_last_name_${i}`} ref={(el) => (formRef.current[`seller_last_name_${i}`] = el)} defaultValue={dealData?.SELLERS_DICT[i]?.LAST_NAME || ""} /></td>
//           <td><input type="text" name={`seller_first_name_${i}`} ref={(el) => (formRef.current[`seller_first_name_${i}`] = el)} defaultValue={dealData?.SELLERS_DICT[i]?.FIRST_NAME || ""} /></td>
//           <td><input type="text" name={`seller_id_kind_${i}`} ref={(el) => (formRef.current[`seller_id_kind_${i}`] = el)} defaultValue={dealData?.SELLERS_DICT[i]?.ID_KIND || ""} /></td>
//           <td><input type="text" name={`seller_id_${i}`} ref={(el) => (formRef.current[`seller_id_${i}`] = el)} defaultValue={dealData?.SELLERS_DICT[i]?.ID || ""} /></td>
//           <td><input type="text" name={`seller_parts_${i}`} ref={(el) => (formRef.current[`seller_parts_${i}`] = el)} defaultValue={dealData?.SELLERS_DICT[i]?.PARTS || ""} /></td>
//           <td><input type="checkbox" name={`seller_is_firm_${i}`} ref={(el) => (formRef.current[`seller_is_firm_${i}`] = el)} defaultChecked={dealData?.SELLERS_DICT[i]?.IS_FIRM || false} /></td>
//         </tr>
//       );
//     }
//     return sellers;
//   };

//   // יצירת טבלת קונים
//   const renderBuyersTable = () => {
//     const buyers = [];
//     for (let i = 0; i < numBuyers; i++) {
//       buyers.push(
//         <tr key={`buyer_${i}`}>
//           <td><input type="text" name={`buyer_last_name_${i}`} ref={(el) => (formRef.current[`buyer_last_name_${i}`] = el)} defaultValue={dealData?.BUYERS_DICT?.[i]?.LAST_NAME || ""} /></td>
//           <td><input type="text" name={`buyer_first_name_${i}`} ref={(el) => (formRef.current[`buyer_first_name_${i}`] = el)} defaultValue={dealData?.BUYERS_DICT?.[i]?.FIRST_NAME || ""} /></td>
//           <td><input type="text" name={`buyer_id_kind_${i}`} ref={(el) => (formRef.current[`buyer_id_kind_${i}`] = el)} defaultValue={dealData?.BUYERS_DICT?.[i]?.ID_KIND || ""} /></td>
//           <td><input type="text" name={`buyer_id_${i}`} ref={(el) => (formRef.current[`buyer_id_${i}`] = el)} defaultValue={dealData?.BUYERS_DICT?.[i]?.ID || ""} /></td>
//           <td><input type="text" name={`buyer_parts_${i}`} ref={(el) => (formRef.current[`buyer_parts_${i}`] = el)} defaultValue={dealData?.BUYERS_DICT?.[i]?.PARTS || ""} /></td>
//           <td><input type="checkbox" name={`buyer_is_firm_${i}`} ref={(el) => (formRef.current[`buyer_is_firm_${i}`] = el)} defaultChecked={dealData?.BUYERS_DICT?.[i]?.IS_FIRM || false} /></td>
//         </tr>
//       );
//     }
//     return buyers;
//   };

//   return (
//     <div className="deal-form-container">
//       {/* צד ימין */}
//       <div className="right-column">
//         <form ref={formRef}>
//           {/* טופס שדות כלליים */}
//           <input name="block" type="text" placeholder="גוש" defaultValue={dealData?.BLOCK || ""} />
//           <input name="parcel" type="text" placeholder="חלקה" defaultValue={dealData?.PARCEL || ""} />
//           <input name="sub_parcel" type="text" placeholder="תת חלקה" defaultValue={dealData?.SUB_PARCEL || ""} />
//           <input name="area" type="text" placeholder="שטח רשום" defaultValue={dealData?.AREA || ""} />
//           <input name="address" type="text" placeholder="כתובת" defaultValue={dealData?.ADDRESS || ""} />
//           <input name="city" type="text" placeholder="עיר" defaultValue={dealData?.CITY || ""} />
//           <input name="contract_date" type="date" placeholder="תאריך החוזה" defaultValue={dealData?.CONTRACT_DATE || ""} />
//           <input name="price" type="number" placeholder="מחיר העסקה" defaultValue={dealData?.PRICE || ""} />

//           <select name="tabu" placeholder="טאבו" defaultValue={dealData?.TABU || tabu_array[0]}>
//             {tabu_array.map((item, index) => (
//               <option key={index} name={item} value={item}>{item}</option>
//             ))}
//           </select>

//           <select name="rights_kind" defaultValue={dealData?.dealType || "בעלות"}>
//             <option value="בעלות">בעלות</option>
//             <option value="חכירה">חכירה</option>
//           </select>

//           <select name="tax_office" placeholder="משרד מיסוי" defaultValue={dealData?.TAX_OFFICE || "תל אביב"}>
//             {tax_office_array.map((item, index) => (
//               <option key={index} name={item} value={item}>{item}</option>
//             ))}
//           </select>

//           <select name="ptor" placeholder="פטור" defaultValue={dealData?.PTOR || "סעיף 49 ב (2)"}>
//             {ptor_array.map((item, index) => (
//               <option key={index} name={item} value={item}>{item}</option>
//             ))}
//           </select>

//           <input name="sellers_advocate" type="text" placeholder="עו״ד המוכרים" defaultValue={dealData?.SELLER_ADVOCATE || ""} />
//           <input name="sellers_imut" type="text" placeholder="עו״ד מאמת המוכרים" defaultValue={dealData?.SELLER_IMUT || ""} />
//           <input name="sellers_license" type="text" placeholder="מס׳ רישיון מאמת מוכרים" defaultValue={dealData?.SELLER_LICENSE || ""} />
//           <input name="buyers_advocate" type="text" placeholder="עו״ד הקונים" defaultValue={dealData?.BUYER_ADVOCATE || ""} />
//           <input name="buyers_imut" type="text" placeholder="עו״ד מאמת הקונים" defaultValue={dealData?.BUYER_IMUT || ""} />
//           <input name="buyers_license" type="text" placeholder="מס׳ רישיון מאמת הקונים" defaultValue={dealData?.BUYER_LICENSE || ""} />

//           <input name="parts" type="text" placeholder="חלקים מועברים" defaultValue={dealData?.PARTS_TO_TRANSFER || ""} />
//           <input name="is_sub_parcel" type="checkbox" placeholder="בית משותף" defaultValue={dealData?.IS_SUB_PARCEL || ""} />

//           <button type="button" onClick={handleSaveDealToServer}>{dealId ? "עדכן נתונים וצור מסמכים" : "שמור וצור מסמכים"}</button>

//         </form>
//       </div>

//       {/* צד שמאל */}
//       <div className="left-column">
//         <form>
//           <div>
//             <label>מספר המוכרים:</label>
//             <select onChange={handleSellerChange} value={numSellers}>
//               <option value="1">1</option>
//               <option value="2">2</option>
//               <option value="3">3</option>
//               <option value="4">4</option>
//             </select>
//           </div>
//           <h3>מוכרים:</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>שם משפחה</th>
//                 <th>שם פרטי</th>
//                 <th>סוג זיהוי</th>
//                 <th>מס׳ זיהוי</th>
//                 <th>חלק</th>
//                 <th>חברה</th>
//               </tr>
//             </thead>
//             <tbody>{renderSellersTable()}</tbody>
//           </table>

//           <div>
//             <label>מספר הקונים:</label>
//             <select onChange={handleBuyerChange} value={numBuyers}>
//               <option value="1">1</option>
//               <option value="2">2</option>
//               <option value="3">3</option>
//               <option value="4">4</option>
//             </select>
//           </div>
//           <h3>קונים:</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>שם משפחה</th>
//                 <th>שם פרטי</th>
//                 <th>סוג זיהוי</th>
//                 <th>מס׳ זיהוי</th>
//                 <th>חלק</th>
//                 <th>חברה</th>
//               </tr>
//             </thead>
//             <tbody>{renderBuyersTable()}</tbody>
//           </table>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DealForm;