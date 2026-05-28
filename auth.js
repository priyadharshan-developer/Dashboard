function login() {

    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    console.log(user, pass); // 🔥 debug

    if (user === "Priyadharshan" && pass === "Pri@123") {

        localStorage.setItem("loggedIn", "true");
        window.location.href = "index.html";

    } else {
        document.getElementById("error").innerText = "Invalid Login";
    }
}
function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}