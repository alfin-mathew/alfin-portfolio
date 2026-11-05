const aboutMessage = document.getElementById("aboutMessage");

async function loadProfile() {
    try {
        const response = await fetch("/api/profile");
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to load profile.");
        }

        // Supports either a direct profile response or { profile: ... }.
        const profile = result.profile || result;

        if (!profile || !profile.fullName) {
            throw new Error("No profile found. Please create your profile first.");
        }

        function displayText(elementId, value) {
            document.getElementById(elementId).textContent = value || "Not provided";
        }

        displayText("displayName", profile.fullName);
        displayText("displayHeadline", profile.headline);
        displayText("displaySummary", profile.summary);

        displayText("displayCourse", profile.course);
        displayText("displayInstitution", profile.institution);
        displayText("displayUniversity", profile.university);
        displayText("displayStudyYear", profile.studyYear);
        displayText("displayGraduationYear", profile.graduationYear);

        displayText("displaySkills", profile.skills);
        displayText("displayLanguages", profile.languages);
        displayText("displayInterests", profile.interests);
        displayText("displayProjects", profile.projects);
        displayText("displayCertification", profile.certification);

        displayText("displayEmail", "Email: " + (profile.email || "Not provided"));
        displayText("displayPhone", "Phone: " + (profile.phone || "Not provided"));

        // Display social links only when valid URLs have been saved.
        const linkedinLink = document.getElementById("linkedinLink");
        const githubLink = document.getElementById("githubLink");

        if (profile.linkedin) {
            linkedinLink.href = profile.linkedin;
            linkedinLink.hidden = false;
        }

        if (profile.github) {
            githubLink.href = profile.github;
            githubLink.hidden = false;
        }

        // Hide certifications section when no certification was entered.
        if (!profile.certification) {
            document.getElementById("certificationSection").hidden = true;
        }

        aboutMessage.textContent = "";

    } catch (error) {
        aboutMessage.textContent = error.message;
        aboutMessage.className = "form-message error";
    }
}

loadProfile();