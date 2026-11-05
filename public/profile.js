const profileForm = document.getElementById("profileForm");
const formMessage = document.getElementById("formMessage");
const submitButton = document.getElementById("submitButton");

profileForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    formMessage.textContent = "Saving your profile...";
    formMessage.className = "form-message";
    submitButton.disabled = true;

    const profileData = Object.fromEntries(
        new FormData(profileForm).entries()
    );

    // Convert graduation year to a number when provided.
    if (profileData.graduationYear) {
        profileData.graduationYear = Number(profileData.graduationYear);
    }

    try {
        const response = await fetch("/api/profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(profileData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Could not save the profile.");
        }

        formMessage.textContent = "Profile saved successfully!";
        formMessage.classList.add("success");

        setTimeout(function () {
            window.location.href = "/about.html";
        }, 1000);

    } catch (error) {
        formMessage.textContent = error.message;
        formMessage.classList.add("error");
        submitButton.disabled = false;
    }
});