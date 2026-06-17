const form = document.getElementById("registerForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById("age").value;
    const troops = document.getElementById("troops").value;
    const reason = document.getElementById("reason").value;

    if (name.trim() === "") {
        alert("Name must be filled");
    } 
    else if (name.trim().length < 5){
        alert("Name must be at least 5 characters long");
    }
    else if (email.trim() === "") {
        alert("Email must be filled");
    } 
    else if (!email.endsWith("@gmail.com")) {
        alert("Email must end with @gmail.com");
    } 
    else if (!gender) {
        alert("Please select a gender");
    } 
    else if (age.trim() === "") {
        alert("Age must be filled");
    } 
    else if (isNaN(age)) {
        alert("Age must be a number");
    } 
    else if (isNaN(age) || Number(age) < 18) {
        alert("Age must be at least 18 years old");
    } 
    else if (troops.trim() === "") {
        alert("Favorite troops must be filled");
    } 
    else if (reason.trim() === "") {
        alert("Reason must be filled");
    }
    else {
        alert("Registration successful!");
    }
});