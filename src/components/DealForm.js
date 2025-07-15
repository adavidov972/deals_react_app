import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "../CSS/DealForm.css";
import {
  fetchDealFromServer,
  saveDealToServer,
  updateDealOnServer,
} from "../firebase";
import { formatDateToDealForm } from "../utils/DateUtils";
import MainBarApp from "./MainAppBar";

const DealForm = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const [dealData, setDealData] = useState({});
  const [numSellers, setNumSellers] = useState(0);
  const [numBuyers, setNumBuyers] = useState(0);
  const formRef = useRef({});
  //const [sellers, setSellers] = useState([]);

  // Arrays for dropdown options
  const tabuOptions = ["תל אביב", "פתח תקוה", "רחובות", "באר שבע", "ירושלים", "נצרת", "חיפה", "נתניה"]
  const taxOfficeOptions = ["תל אביב", "מרכז", "רחובות", "נתניה", "ירושלים", "באר שבע", "חיפה", "טבריה", "נצרת", "חדרה"]
  const ptorOptions = ["סעיף 49 ב (2)", "סעיף 49 ב (5)", "סעיף 49 ב (6)", "סעיף 49 ה", "סעיף 62", "ללא פטור"]

  // Fetch deal data for editing if dealId exists
  useEffect(() => {
    const fetchDeal = async () => {
      if (dealId) {
        try {
          const response = await fetchDealFromServer(dealId);
          const deal = response.data;
          setDealData(deal);
          setNumSellers(deal.SELLERS_DICT.length || 0);
          setNumBuyers(deal.BUYERS_DICT.length || 0);
        } catch (error) {
          console.error("Error fetching deal data:", error);
        }
      }
    };
    fetchDeal();
  }, [dealId]);

  // הפונקציה נועדה על מנת למחוק צד בלחיצה על איקס אדום. נכון ליום 25/1/25 לא הצלחתי לפתור את זה. אגיע מלזה מאוחר יותר
  // const handleDeleteSeller = (index) => {
  //   setSellers((prevSellers) => prevSellers.filter((seller) => sellers[seller.index] !== index));
  // };

  // Handle saving deal
  const handleSave = async (e) => {
    e.preventDefault();

    //Check if there are atleast 1 seller and 1 buyers
    if (!numSellers > 0 || !numBuyers > 0) {
      await Swal.fire({
        title: "אנא מלא את פרטי הצדדים",
        text: "יש למלא לפחות פרטי מוכר אחד וקונה אחד על מנת להמשיך.",
        icon: "warning",
        confirmButtonText: "סגור"
      });
      return
    }

    const dealPayload = {
      ...dealData,
      BLOCK: formRef.current.block.value,
      PARCEL: formRef.current.parcel.value,
      SUB_PARCEL: formRef.current.sub_parcel.value,
      AREA: formRef.current.area.value,
      ADDRESS: formRef.current.address.value,
      CITY: formRef.current.city.value,
      CONTRACT_DATE: new Date(formRef.current.contract_date.value),
      PRICE: formRef.current.price.value,
      TABU: formRef.current.tabu.value,
      RIGHTS_KIND: formRef.current.rights_kind.value,
      TAX_OFFICE: formRef.current.tax_office.value,
      PTOR: formRef.current.ptor.value,
      SELLER_ADVOCATE: formRef.current.sellers_advocate.value,
      SELLER_IMUT: formRef.current.sellers_imut.value,
      SELLER_LICENSE: formRef.current.sellers_license.value,
      BUYER_ADVOCATE: formRef.current.buyers_advocate.value,
      BUYER_IMUT: formRef.current.buyers_imut.value,
      BUYER_LICENSE: formRef.current.buyers_license.value,
      PARTS_TO_TRANSFER: formRef.current.parts.value,
      SELLERS_DICT: [],
      BUYERS_DICT: [],
      DESCRIPTION: "כמפורט בפנקס הבתים המשותפים",
    };

    // Collect seller and buyer data
    for (let i = 0; i < numSellers; i++) {
      dealPayload.SELLERS_DICT.push({
        LAST_NAME: formRef.current[`seller_last_name_${i}`]?.value,
        FIRST_NAME: formRef.current[`seller_first_name_${i}`]?.value,
        ID_KIND: formRef.current[`seller_id_kind_${i}`]?.value,
        ID: formRef.current[`seller_id_${i}`]?.value,
        PARTS: formRef.current[`seller_parts_${i}`]?.value,
        IS_FIRM: formRef.current[`seller_is_firm_${i}`]?.checked || false,
      });
    }

    for (let i = 0; i < numBuyers; i++) {
      dealPayload.BUYERS_DICT.push({
        LAST_NAME: formRef.current[`buyer_last_name_${i}`]?.value,
        FIRST_NAME: formRef.current[`buyer_first_name_${i}`]?.value,
        ID_KIND: formRef.current[`buyer_id_kind_${i}`]?.value,
        ID: formRef.current[`buyer_id_${i}`]?.value,
        PARTS: formRef.current[`buyer_parts_${i}`]?.value,
        IS_FIRM: formRef.current[`buyer_is_firm_${i}`]?.checked || false,
      });
    }

    // Save or update deal
    console.log("Deal payload is : ", dealPayload);

    try {
      dealId ? await updateDealOnServer(dealId, dealPayload) : await saveDealToServer(dealPayload);

      // Handle create deal documents

      const result = await Swal.fire({
        title: dealId ? "הנתונים עודכנו בהצלחה !" : "העסקה נוצרה בהצלחה !",
        text: "איך תרצה לקבל את מסמכי העסקה",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "משלוח בדוא״ל",
        denyButtonText: "הורדה מיידית",
        cancelButtonText: "סגור",
        icon: "success",
        width: 800
      })

      dealPayload["CONTRACT_DATE"] = new Date(dealPayload["CONTRACT_DATE"])
      const serverUrl = "https://adavidov.pythonanywhere.com/create"
      //const serverUrl = "http://127.0.0.1:5000/create"

      if (result.isConfirmed) {
        const { value: email } = await Swal.fire({
          title: "לאיזו כתובת דוא״ל תרצה לקבל את המסמכים ?",
          input: "email",
          inputPlaceholder: "Enter your email address"
        });
        if (email) {

          const swalInstance = Swal.fire({
            title: 'הקבצים בהכנה ...',
            text: 'המתן להשלמת הכנת הקבצים',
            allowOutsideClick: false, // Disable clicking outside to close
            showCancelButton: false,
            didOpen: () => {
              Swal.showLoading(); // Show the spinner
            },
          });

          const payload = {
            "values": dealPayload,
            "output_method": "mail",
            "email_address": email
          }

          try {
            const response = await axios.post(serverUrl, payload);
            console.log(response.data);
            if (response.data["result"] === "success") {
              console.log("now Fire");

              Swal.fire({
                title: " הקבצים נשלחו בהצלחה לכתובת :",
                text: email,
                showConfirmButton: true,
                icon: "success",
              }).then(() => {
                navigate("/dashboard"); // חזרה ל-dashboard
              })

            }
          } catch (error) {
            console.error('Error is :', error);
            Swal.fire({
              title: "אירעה שגיאה ביצירת המסמכים !",
              showConfirmButton: true,
              text: error,
              icon: "error",
              imageWidth: 400,
              imageHeight: 200,
              imageAlt: "Custom image",
            })
          }
          finally {
            swalInstance.close()
          }
        }
      }

      else if (result.isDenied) {
        // הורדת הקבצים לקובץ zip

        const swalInstance = Swal.fire({
          title: 'הקבצים בהכנה ...',
          text: 'המתן להשלמת הכנת הקבצים',
          allowOutsideClick: false, // Disable clicking outside to close
          showCancelButton: false,
          didOpen: () => {
            Swal.showLoading(); // Show the spinner
          },
        });

        const payload = {
          values: dealPayload,
          output_method: "download",
        };
        try {
          const response = await axios.post(serverUrl, payload, {
            responseType: "blob", // Ensure the server responds with a Blob
          });

          // Extract filename from headers or set a default name
          const filename = response.headers["content-disposition"]?.split("filename=")[1]?.replace(/"/g, "") || "document.zip";

          // Create a URL for the Blob and trigger download
          const blob = new Blob([response.data], { type: response.data.type });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          console.log("File downloaded successfully!");
          Swal.fire({
            title: "הכנת הקבצים הושלמה",
            icon: "success",
            text: "הקבצים נשמרו בהצלחה בתיקיית ההורדות !",
          })
            .then(() => {
              navigate("/dashboard"); // חזרה ל-dashboard
            })

        } catch (error) {
          console.error("Error downloading file:", error);
          Swal.fire({
            title: "אירעה שגיאה בעת הורדת הקבצים. נסה שנית",
            icon: "error",
            text: error.message,
          });
        }
        finally {
          swalInstance.close()
        }
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving deal:", error);
      await Swal.fire({
        title: "שגיאה!",
        text: "אירעה תקלה בעת שמירת הנתונים.",
        icon: "error",
      });
    }
  };

  // Render sellers input table
  const renderSellers = () => {
    return (
      <>
        {Array.from({ length: numSellers }).map((_, i) => (
          <tr key={`seller_${i}`}>
            <td>
              <input
                type="text"
                name={`seller_last_name_${i}`}
                ref={(el) => (formRef.current[`seller_last_name_${i}`] = el)}
                defaultValue={dealData?.SELLERS_DICT?.[i]?.LAST_NAME || ""}
              />
            </td>
            <td>
              <input
                type="text"
                name={`seller_first_name_${i}`}
                ref={(el) => (formRef.current[`seller_first_name_${i}`] = el)}
                defaultValue={dealData?.SELLERS_DICT?.[i]?.FIRST_NAME || ""}
              />
            </td>
            <td>
              <input
                type="text"
                name={`seller_id_kind_${i}`}
                ref={(el) => (formRef.current[`seller_id_kind_${i}`] = el)}
                defaultValue={dealData?.SELLERS_DICT?.[i]?.ID_KIND || ""}
              />
            </td>
            <td>
              <input
                type="text"
                name={`seller_id_${i}`}
                ref={(el) => (formRef.current[`seller_id_${i}`] = el)}
                defaultValue={dealData?.SELLERS_DICT?.[i]?.ID || ""}
              />
            </td>
            <td>
              <input
                type="text"
                name={`seller_parts_${i}`}
                ref={(el) => (formRef.current[`seller_parts_${i}`] = el)}
                defaultValue={dealData?.SELLERS_DICT?.[i]?.PARTS || ""}
              />
            </td>
            <td>
              <input
                type="checkbox"
                name={`seller_is_firm_${i}`}
                ref={(el) => (formRef.current[`seller_is_firm_${i}`] = el)}
                defaultChecked={dealData?.SELLERS_DICT?.[i]?.IS_FIRM || false}
              />
            </td>
            {/* <td>
            <button
            type="button"
              onClick={() => handleDeleteSeller(i)}
              className="text-red-600 font-bold hover:underline"
            >
              X
            </button>
          </td> */}
          </tr>
        ))}
      </>

    )
  }

  // Render buyers input table
  const renderBuyers = () => {
    return Array.from({ length: numBuyers }).map((_, i) => (
      <tr key={`buyer_${i}`}>
        <td>
          <input
            type="text"
            name={`buyer_last_name_${i}`}
            ref={(el) => (formRef.current[`buyer_last_name_${i}`] = el)}
            defaultValue={dealData?.BUYERS_DICT?.[i]?.LAST_NAME || ""}
          />
        </td>
        <td>
          <input
            type="text"
            name={`buyer_first_name_${i}`}
            ref={(el) => (formRef.current[`buyer_first_name_${i}`] = el)}
            defaultValue={dealData?.BUYERS_DICT?.[i]?.FIRST_NAME || ""}
          />
        </td>
        <td>
          <input
            type="text"
            name={`buyer_id_kind_${i}`}
            ref={(el) => (formRef.current[`buyer_id_kind_${i}`] = el)}
            defaultValue={dealData?.BUYERS_DICT?.[i]?.ID_KIND || ""}
          />
        </td>
        <td>
          <input
            type="text"
            name={`buyer_id_${i}`}
            ref={(el) => (formRef.current[`buyer_id_${i}`] = el)}
            defaultValue={dealData?.BUYERS_DICT?.[i]?.ID || ""}
          />
        </td>
        <td>
          <input
            type="text"
            name={`buyer_parts_${i}`}
            ref={(el) => (formRef.current[`buyer_parts_${i}`] = el)}
            defaultValue={dealData?.BUYERS_DICT?.[i]?.PARTS || ""}
          />
        </td>
        <td>
          <input
            type="checkbox"
            name={`buyer_is_firm_${i}`}
            ref={(el) => (formRef.current[`buyer_is_firm_${i}`] = el)}
            defaultChecked={dealData?.BUYERS_DICT?.[i]?.IS_FIRM || false}
          />
        </td>
      </tr>
    ));
  };

  return (
    <>
    <MainBarApp headerText={`גוש : ${dealData.BLOCK} חלקה : ${dealData.PARCEL} || רח׳ ${dealData.ADDRESS} ${dealData.CITY}`}/>
      <form onSubmit={handleSave}>
        <h1>{dealId ? "עריכת פרטי עסקה" : "יצירת עסקה חדשה"}</h1>
        {/* General Deal Information */}
        <div className="general-info">
          <label>
            גוש:
            <input
              type="text"
              name="block"
              ref={(el) => (formRef.current.block = el)}
              defaultValue={dealData.BLOCK || ""}
            />
          </label>
          <label>
            חלקה:
            <input
              type="text"
              name="parcel"
              ref={(el) => (formRef.current.parcel = el)}
              defaultValue={dealData.PARCEL || ""}
            />
          </label>
          <label>
            תת חלקה:
            <input
              type="text"
              name="sub_parcel"
              ref={(el) => (formRef.current.sub_parcel = el)}
              defaultValue={dealData.SUB_PARCEL || ""}
            />
          </label>
          <label>
            שטח רשום:
            <input
              type="text"
              name="area"
              ref={(el) => (formRef.current.area = el)}
              defaultValue={dealData.AREA || ""}
            />
          </label>
          <label>
            כתובת:
            <input
              type="text"
              name="address"
              ref={(el) => (formRef.current.address = el)}
              defaultValue={dealData.ADDRESS || ""}
            />
          </label>
          <label>
            עיר:
            <input
              type="text"
              name="city"
              ref={(el) => (formRef.current.city = el)}
              defaultValue={dealData.CITY || ""}
            />
          </label>
          <label>
            תאריך חוזה:
            <input
              type="date"
              name="contract_date"
              ref={(el) => (formRef.current.contract_date = el)}
              defaultValue={formatDateToDealForm(dealData.CONTRACT_DATE) || ""}
            />
          </label>
          <label>
            מחיר:
            <input
              type="number"
              name="price"
              ref={(el) => (formRef.current.price = el)}
              defaultValue={dealData.PRICE || ""}
            />
          </label>
          <label>
            טאבו:
            <select
              name="tabu"
              ref={(el) => (formRef.current.tabu = el)}
              defaultValue={dealData.TABU || ""}
            >
              {tabuOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            סוג זכויות:
            <input
              type="text"
              name="rights_kind"
              ref={(el) => (formRef.current.rights_kind = el)}
              defaultValue={dealData.RIGHTS_KIND || ""}
            />
          </label>
          <label>
            מס שבח:
            <select
              name="tax_office"
              ref={(el) => (formRef.current.tax_office = el)}
              defaultValue={dealData.TAX_OFFICE || ""}
            >
              {taxOfficeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            פטור:
            <select
              name="ptor"
              ref={(el) => (formRef.current.ptor = el)}
              defaultValue={dealData.PTOR || ""}
            >
              {ptorOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            ב״כ המוכרים:
            <input
              type="text"
              name="area"
              ref={(el) => (formRef.current.sellers_advocate = el)}
              defaultValue={dealData.SELLER_ADVOCATE || ""}
            />
          </label>
          <label>
            עו״ד מאמת המוכרים:
            <input
              type="text"
              name="area"
              ref={(el) => (formRef.current.sellers_imut = el)}
              defaultValue={dealData.SELLER_IMUT || ""}
            />
          </label>
          <label>
            מס׳ רישיון מאמת המוכרים:
            <input
              type="text"
              name="area"
              ref={(el) => (formRef.current.sellers_license = el)}
              defaultValue={dealData.SELLER_LICENSE || ""}
            />
          </label>
          <label>
            ב״כ הקונים:
            <input
              type="text"
              name="area"
              ref={(el) => (formRef.current.buyers_advocate = el)}
              defaultValue={dealData.BUYER_ADVOCATE || ""}
            />
          </label>
          <label>
            עו״ד מאמת הקונים:
            <input
              type="text"
              name="area"
              ref={(el) => (formRef.current.buyers_imut = el)}
              defaultValue={dealData.BUYER_IMUT || ""}
            />
          </label>
          <label>
            מס׳ רישיון מאמת הקונים:
            <input
              type="text"
              name="area"
              ref={(el) => (formRef.current.buyers_license = el)}
              defaultValue={dealData.BUYER_LICENSE || ""}
            />
          </label>
          <label>
            חלקים מועברים:
            <input
              type="text"
              name="area"
              ref={(el) => (formRef.current.parts = el)}
              defaultValue={dealData.PARTS_TO_TRANSFER || ""}
            />
          </label>
        </div>

        {/* Sellers Section */}
        <div className="sellers-section">
          <h2>מוכרים</h2>
          <button
            type="button"
            onClick={() => setNumSellers(numSellers + 1)}
          >
            הוסף מוכר
          </button>
          <button
            type="button"
            onClick={() => numSellers > 0 && setNumSellers(numSellers - 1)}
          >
            הסר מוכר
          </button>
          <table>
            <thead>
              <tr>
                <th>שם משפחה</th>
                <th>שם פרטי</th>
                <th>סוג זיהוי</th>
                <th>מספר זיהוי</th>
                <th>חלקים</th>
                <th>חברה</th>
              </tr>
            </thead>
            <tbody>{renderSellers()}</tbody>
          </table>
        </div>

        {/* Buyers Section */}
        <div className="buyers-section">
          <h2>קונים</h2>
          <button
            type="button"
            onClick={() => setNumBuyers(numBuyers + 1)}
          >
            הוסף קונה
          </button>
          <button
            type="button"
            onClick={() => numBuyers > 0 && setNumBuyers(numBuyers - 1)}
          >
            הסר קונה
          </button>
          <table>
            <thead>
              <tr>
                <th>שם משפחה</th>
                <th>שם פרטי</th>
                <th>סוג זיהוי</th>
                <th>מספר זיהוי</th>
                <th>חלקים</th>
                <th>חברה</th>
              </tr>
            </thead>
            <tbody>{renderBuyers()}</tbody>
          </table>
        </div>

        {/* Form Submission */}
        <button type="submit">{dealId ? "עדכן" : "שמור"}</button>
      </form>
    </>
  );
};

export default DealForm;