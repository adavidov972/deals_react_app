import React, { useState, useEffect } from "react";
import { auth, db, fetchAllUserDealsFromServer } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import {Button, Table, TableHead, TableRow, TableCell, TableBody, Box, IconButton} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDateToDashboardList } from "../utils/DateUtils";
import MainBarApp from "./MainAppBar";

// ייצור RTL
const theme = createTheme({
  direction: "rtl",
});

function Dashboard() {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeals = async () => {
      if (!auth.currentUser) {
        navigate("/")
      }
      try {
        const deals = await fetchAllUserDealsFromServer()
        setDeals(deals)
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
    };
    fetchDeals();
    // eslint-disable-next-line
  }, []);

  
  const handleRowClick = (dealId) => {
    navigate(`/deal/${dealId}`);
  };

  const handleDeleteClick = (deal) => {
    Swal.fire({
      title: "האם למחוק את העסקה ?",
      text: "האם אתה בטוח שברצונך למחוק את העסקה ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "מחק"
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete(deal); // Pass the deal directly here
        Swal.fire({
          title: "העסקה נמחקה",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const confirmDelete = async (deal) => {
    try {
      await deleteDoc(doc(db, "Deals", deal.id));
      setDeals((prevDeals) => prevDeals.filter((d) => d.id !== deal.id));
    } catch (error) {
      console.error("Error deleting deal:", error);
      Swal.fire({
        title: "שגיאה",
        text: "מחיקת העסקה נכשלה",
        icon: "error",
      });
    }
  };

  const formatPrice = (price) => {
    if (!price) return "";
    return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ש״ח`;
  };

    const handleNewDealClick = () => {
    navigate("/deal");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          direction: "rtl",
          padding: "20px",
          margin: "0 auto",
          maxWidth: "calc(100% - 200px)",
          width: "100%",
        }}
      >
        <MainBarApp headerText={"רשימת עסקאות"}/>

        <Box mt={4} display="flex" justifyContent="flex-end">
          {/* כפתור עסקה חדשה */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleNewDealClick}
            sx={{ marginBottom: "16px" }}
          >
            עסקה חדשה
          </Button>
        </Box>

        <Box
          mt={2}
          sx={{
            overflowX: "auto",
            borderRadius: "5px",
          }}
        >
          <Table
            sx={{
              borderCollapse: "collapse",
              border: "1px solid #ddd",
              width: "100%",
              tableLayout: "fixed",
            }}
          >
            <TableHead>
              <TableRow>
                {/* כותרות הטבלה */}
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: "16px",
                    color: "#fff",
                  }}
                >
                  #
                </TableCell>
                <TableCell style={{ border: "1px solid #ddd", color: "#fff", fontWeight: "bold", textAlign: "right", fontSize: "16px" }}>גוש</TableCell>
                <TableCell style={{ border: "1px solid #ddd", color: "#fff", fontWeight: "bold", textAlign: "right", fontSize: "16px" }}>חלקה</TableCell>
                <TableCell style={{ border: "1px solid #ddd", color: "#fff", fontWeight: "bold", textAlign: "right", fontSize: "16px" }}>תת חלקה</TableCell>
                <TableCell style={{ border: "1px solid #ddd", color: "#fff", fontWeight: "bold", textAlign: "right", fontSize: "16px" }}>כתובת</TableCell>
                <TableCell style={{ border: "1px solid #ddd", color: "#fff", fontWeight: "bold", textAlign: "right", fontSize: "16px" }}>עיר</TableCell>
                <TableCell style={{ border: "1px solid #ddd", color: "#fff", fontWeight: "bold", textAlign: "right", fontSize: "16px" }}>תאריך החוזה</TableCell>
                <TableCell style={{ border: "1px solid #ddd", color: "#fff", fontWeight: "bold", textAlign: "right", fontSize: "16px" }}>מחיר</TableCell>
                <TableCell style={{ border: "1px solid #ddd", color: "#fff", fontWeight: "bold", textAlign: "right", fontSize: "16px" }}>משרד מיסוי</TableCell>
                <TableCell style={{ border: "1px solid #ddd", color: "#fff", fontWeight: "bold", textAlign: "right", fontSize: "16px" }}>עו״ד המוכרים</TableCell>
                <TableCell style={{ border: "1px solid #ddd", color: "#fff", fontWeight: "bold", textAlign: "right", fontSize: "16px" }}>עו״ד הקונים</TableCell>
                <TableCell style={{ border: "1px solid #ddd", color: "#fff", textAlign: "center", fontSize: "16px" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deals.map((deal, index) => (
                <TableRow
                  key={deal.id}
                  onClick={() => handleRowClick(deal.id)}
                  style={{
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                >
                  <TableCell
                    style={{
                      border: "1px solid #ddd",
                      textAlign: "center",
                      fontSize: "14px",
                      width: "20px",
                      maxWidth: "20px",
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd", textAlign: "right", fontSize: "14px" }}>{deal.data.BLOCK}</TableCell>
                  <TableCell style={{ border: "1px solid #ddd", textAlign: "right", fontSize: "14px" }}>{deal.data.PARCEL}</TableCell>
                  <TableCell style={{ border: "1px solid #ddd", textAlign: "right", fontSize: "14px" }}>{deal.data.SUB_PARCEL}</TableCell>
                  <TableCell style={{ border: "1px solid #ddd", textAlign: "right", fontSize: "14px" }}>{deal.data.ADDRESS}</TableCell>
                  <TableCell style={{ border: "1px solid #ddd", textAlign: "right", fontSize: "14px" }}>{deal.data.CITY}</TableCell>
                  <TableCell style={{ border: "1px solid #ddd", textAlign: "right", fontSize: "14px" }}>{formatDateToDashboardList(deal.data.CONTRACT_DATE)}</TableCell>
                  <TableCell style={{ border: "1px solid #ddd", textAlign: "right", fontSize: "14px" }}>{formatPrice(deal.data.PRICE)}</TableCell>
                  <TableCell style={{ border: "1px solid #ddd", textAlign: "right", fontSize: "14px" }}>{deal.data.TAX_OFFICE}</TableCell>
                  <TableCell style={{ border: "1px solid #ddd", textAlign: "right", fontSize: "14px" }}>{deal.data.SELLER_IMUT}</TableCell>
                  <TableCell style={{ border: "1px solid #ddd", textAlign: "right", fontSize: "14px" }}>{deal.data.BUYER_IMUT}</TableCell>
                  <TableCell style={{ border: "1px solid #ddd", textAlign: "center" }}>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(deal);
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;