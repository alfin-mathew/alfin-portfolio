const feedbackForm = document.getElementById("feedbackForm");
const feedbackMessage = document.getElementById("feedbackMessage");
const feedbackButton = document.getElementById("feedbackButton");
const feedbackList = document.getElementById("feedbackList");

// Load previously submitted feedback.
async function loadFeedback() {
    feedbackList.replaceChildren();

    try {
        const response = await fetch("/api/feedback");
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Could not load feedback.");
        }

        // Accept an array returned directly or inside a named property.
        const feedbackItems = Array.isArray(result)
            ? result
            : result.feedback || result.feedbacks || [];

        if (feedbackItems.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "empty-feedback";
            emptyMessage.textContent = "No feedback yet. Be the first to leave a message!";
            feedbackList.appendChild(emptyMessage);
            return;
        }

        feedbackItems.forEach(function (item) {
            const card = document.createElement("article");
            card.className = "feedback-card";

            const name = document.createElement("h3");
            name.textContent = item.name || "Anonymous";

            const message = document.createElement("p");
            message.textContent = item.message || "";

            card.appendChild(name);
            card.appendChild(message);

            if (item.createdAt) {
                const date = document.createElement("small");
                date.textContent = new Date(item.createdAt).toLocaleDateString();
                card.appendChild(date);
            }

            feedbackList.appendChild(card);
        });

    } catch (error) {
        feedbackList.replaceChildren();

        const errorMessage = document.createElement("p");
        errorMessage.className = "empty-feedback error";
        errorMessage.textContent = error.message;

        feedbackList.appendChild(errorMessage);
    }
}

// Submit new feedback.
feedbackForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    feedbackButton.disabled = true;
    feedbackMessage.textContent = "Submitting your feedback...";
    feedbackMessage.className = "form-message";

    const feedbackData = {
        name: document.getElementById("name").value.trim(),
        message: document.getElementById("message").value.trim()
    };

    try {
        const response = await fetch("/api/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(feedbackData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Could not submit feedback.");
        }

        feedbackMessage.textContent = "Thank you! Your feedback was submitted.";
        feedbackMessage.classList.add("success");

        feedbackForm.reset();

        await loadFeedback();

    } catch (error) {
        feedbackMessage.textContent = error.message;
        feedbackMessage.classList.add("error");

    } finally {
        feedbackButton.disabled = false;
    }
});

// Load feedback when the page opens.
loadFeedback();