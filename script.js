const systemInfo = {
    osPlatform: navigator.platform,
    userAgent: navigator.userAgent,
    language: navigator.language,
    browserVendor: navigator.vendor,
    cookiesEnabled: navigator.cookieEnabled,
    onlineStatus: navigator.onLine,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
};

Object.entries(systemInfo).forEach(([key, value]) => {
    localStorage.setItem(key, String(value));
});

const footer = document.getElementById("footer");

function renderLocalStorage() {
    let footerContent = '<h3 class="footer-title">Інформація з localStorage</h3>';

    if (localStorage.length === 0) {
        footerContent += '<p class="footer-item">localStorage порожній</p>';
    } else {
        for (let i = 0; i < localStorage.length; i += 1) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            footerContent += `<div class="footer-item"><strong>${key}:</strong> ${value}</div>`;
        }
    }

    footer.innerHTML = footerContent;
}

renderLocalStorage();

const commentsList = document.getElementById("commentsList");

fetch("https://jsonplaceholder.typicode.com/posts/9/comments")
    .then((response) => response.json())
    .then((comments) => {
        comments.forEach((comment) => {
            const commentItem = document.createElement("div");
            commentItem.className = "comment-item";
            commentItem.innerHTML = `
                <h3>${comment.name}</h3>
                <p>${comment.body}</p>
                <span>${comment.email}</span>
            `;
            commentsList.appendChild(commentItem);
        });
    })
    .catch(() => {
        commentsList.innerHTML = "<p>Не вдалося завантажити коментарі.</p>";
    });

const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");

setTimeout(() => {
    modal.classList.add("show");
}, 60000);

closeModal.addEventListener("click", () => {
    modal.classList.remove("show");
});

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.remove("show");
    }
});

const themeToggle = document.getElementById("themeToggle");

function applyThemeByTime() {
    const hour = new Date().getHours();

    if (hour >= 7 && hour < 21) {
        document.body.classList.remove("dark");
    } else {
        document.body.classList.add("dark");
    }
}

applyThemeByTime();

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});