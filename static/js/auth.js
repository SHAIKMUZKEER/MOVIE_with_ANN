// =====================================================
// LOGIN
// =====================================================

const loginForm =
    document.getElementById(
        "loginForm"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "email"
                ).value.trim();


            const password =
                document.getElementById(
                    "password"
                ).value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            try {

                const response =
                    await fetch(
                        "/auth/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    email: email,

                                    password: password
                                })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    message.textContent =
                        data.detail ||
                        "Login failed";

                    return;
                }


                // Save JWT
                localStorage.setItem(
                    "access_token",
                    data.access_token
                );


                message.textContent =
                    "Login successful!";


                setTimeout(
                    function () {

                        window.location.href =
                            "/movies";

                    },
                    700
                );


            } catch (error) {

                console.error(error);

                message.textContent =
                    "Server error";
            }

        }
    );
}


// =====================================================
// SIGNUP
// =====================================================

const signupForm =
    document.getElementById(
        "signupForm"
    );


if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const userName =
                document.getElementById(
                    "user_name"
                ).value.trim();


            const email =
                document.getElementById(
                    "signupEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "signupPassword"
                ).value;


            const message =
                document.getElementById(
                    "signupMessage"
                );


            try {

                const response =
                    await fetch(
                        "/auth/signup",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    user_name:
                                        userName,

                                    email:
                                        email,

                                    password:
                                        password
                                })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    message.textContent =
                        data.detail ||
                        "Signup failed";

                    return;
                }


                message.textContent =
                    "Account created successfully!";


                setTimeout(
                    function () {

                        window.location.href =
                            "/login";

                    },
                    900
                );


            } catch (error) {

                console.error(error);

                message.textContent =
                    "Server error";
            }

        }
    );
}