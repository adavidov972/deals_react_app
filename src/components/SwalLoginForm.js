import { useEffect } from "react";
import Swal from "sweetalert2";
import { loginUserToFirebase } from "../firebase";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const showLoginForm = async () => {
            const { value: formValues } = await Swal.fire({
                title: "התחברות למערכת",
                width: 800,
                html: `
          <div style="text-align: right;">
            <label for="swal-input1" style="display: block; margin-bottom: 5px;">שם משתמש / דוא״ל :</label>
            <input id="swal-input1" class="swal2-input" placeholder="שם משתמש / דוא״ל" type="email">
            <label for="swal-input2" style="display: block; margin: 10px 0 5px;">סיסמה :</label>
            <input id="swal-input2" class="swal2-input" placeholder="סיסמה" type="password">
          </div>
          <div style="text-align: left; margin-top: 20px;">
            <button id="signup-button" style="background: none; border: none; color: blue; text-decoration: underline; cursor: pointer;">
              אין לך חשבון?
            </button>
          </div>
        `,
                focusConfirm: false,
                showCancelButton: false,
                confirmButtonText: "התחבר",
                allowOutsideClick: false,
                preConfirm: () => {
                    const email = document.getElementById("swal-input1").value;
                    const password = document.getElementById("swal-input2").value;

                    if (!email || !password) {
                        Swal.showValidationMessage("אנא הקלד שם משתמש / דוא״ל וסיסמה חוקיים");
                        return null;
                    }

                    return { email, password };
                },
                didRender: () => {
                    // Add event listener for the signup button
                    const signupButton = document.getElementById("signup-button");
                    if (signupButton) {
                        signupButton.addEventListener("click", () => {
                            Swal.close(); // Close the current login modal
                            showSignupForm(); // Open the signup form
                        });
                    }
                },
            });

            if (formValues) {
                console.log("Login Data:", formValues);
                const email = formValues.email
                const password = formValues.password
                try {
                    await loginUserToFirebase(email, password)
                    navigate("/dashboard");
                } catch (error) {
                    console.log(error.message);
                    Swal.fire(error.message, "אירעה שגיאה בהתחברות", "error",)
                    .then(() => {
                        showLoginForm()
                    })
                    
                }
            }
        };

        const showSignupForm = async () => {
            const { value: formValues } = await Swal.fire({
                title: "רישום משתמש חדש למערכת",
                width: 800,
                html: `
          <div style="text-align: right;">
            <label for="swal-input3" style="display: block; margin-bottom: 5px;">שם משתמש / דוא״ל :</label>
            <input id="swal-input3" class="swal2-input" placeholder="שם משתמש / דוא״ל" type="email">
            <label for="swal-input4" style="display: block; margin: 10px 0 5px;">סיסמה :</label>
            <input id="swal-input4" class="swal2-input" placeholder="סיסמה" type="password">
            <label for="swal-input5" style="display: block; margin: 10px 0 5px;">אמת סיסמה</label>
            <input id="swal-input5" class="swal2-input" placeholder="אימות סיסמה" type="password">
          </div>
          <div style="text-align: left; margin-top: 20px;">
            <button id="login-button" style="background: none; border: none; color: blue; text-decoration: underline; cursor: pointer;">
              כבר יש לך חשבון?
            </button>
          </div>
        `,
                focusConfirm: false,
                showCancelButton: false,
                confirmButtonText: "הרשמה למערכת",
                allowOutsideClick: false,
                preConfirm: () => {
                    const email = document.getElementById("swal-input3").value;
                    const password = document.getElementById("swal-input4").value;
                    const confirmPassword = document.getElementById("swal-input5").value;

                    if (!email || !password || !confirmPassword) {
                        Swal.showValidationMessage("אנא הקלד שם משתמש / דוא״ל וסיסמה חוקיים");
                        return null;
                    }

                    if (password !== confirmPassword) {
                        Swal.showValidationMessage(".הסיסמה שהוקשה איננה תואמת לאימות הסיסמה. אנא בדוק את הנתונים שנית");
                        return null;
                    }

                    return { email, password };
                },
                didRender: () => {
                    // Add event listener for the login button
                    const loginButton = document.getElementById("login-button");
                    if (loginButton) {
                        loginButton.addEventListener("click", () => {
                            Swal.close(); // Close the current signup modal
                            showLoginForm(); // Open the login form
                        });
                    }
                },
            });

            if (formValues) {
                console.log("Signup Data:", formValues);
                Swal.fire("Success", `Signed up as ${formValues.email}`, "success");
            }
        };

        showLoginForm(); // Call the login modal immediately on component mount
    }, []); // Empty dependency array to run only once

    return null; // No render needed
};

export default LoginForm;