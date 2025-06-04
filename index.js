// Prompt the user for a username (stored in localStorage for future visits)
let username = localStorage.getItem("username");
if (!username) {
  username = prompt("Please enter your username:") || "User";
  localStorage.setItem("username", username);
}
// Display the username in the header
document.getElementById("usernameDisplay").textContent = "Welcome, " + username;

// Auto-Search Suggestions
const questions = [
  "How to learn JavaScript?",
  "Best CSS frameworks?",
  "How to start coding?",
  "What is HTML?",
  "Best programming languages in 2025?"
];

document.getElementById("searchBar").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const suggestionBox = document.getElementById("searchSuggestions");
  suggestionBox.innerHTML = "";
  if (query.length > 2) {
    const filtered = questions.filter((q) => q.toLowerCase().includes(query));
    filtered.forEach((q) => {
      const div = document.createElement("div");
      div.textContent = q;
      div.classList.add("search-suggestion");
      div.addEventListener("click", () => {
        document.getElementById("searchBar").value = q;
        suggestionBox.style.display = "none";
      });
      suggestionBox.appendChild(div);
    });
    suggestionBox.style.display = filtered.length ? "block" : "none";
  } else {
    suggestionBox.style.display = "none";
  }
});

// Add Question to the Recent Questions list and show a notification
function addQuestionToList(questionText) {
  const questionsContainer = document.getElementById("questionsContainer");

  // Create a new question element that displays the username and question text
  const questionItem = document.createElement("div");
  questionItem.classList.add("question");
  questionItem.innerHTML = `<p><strong>${username}:</strong> ${questionText}</p>`;

  questionsContainer.prepend(questionItem);

  // Scroll smoothly to the new question
  questionItem.scrollIntoView({ behavior: "smooth", block: "start" });

  showNewQuestionNotification(questionText);
}

// Show a temporary notification for a new question
function showNewQuestionNotification(questionText) {
  const notification = document.getElementById("newQuestionNotification");
  notification.textContent = `✅ New Question Added: "${questionText}"`;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.opacity = 1;
  }, 100); // Fade in effect

  // Auto-hide after 3 seconds
  setTimeout(() => {
    notification.style.opacity = 0;
    setTimeout(() => {
      notification.style.display = "none";
    }, 500);
  }, 3000);
}

// Handle question submission
document.getElementById("submitQuestion").addEventListener("click", function () {
  const questionText = document.getElementById("questionInput").value;
  if (questionText.trim()) {
    addQuestionToList(questionText);
    document.getElementById("questionInput").value = "";
  }
});

// Add Comment to Discussion (Facebook-like comment section)
function addComment(text, usernameForComment = "User") {
  const container = document.getElementById("discussionContainer");

  const comment = document.createElement("div");
  comment.classList.add("comment");

  comment.innerHTML = `
    <img src="https://img.icons8.com/?size=100&id=14736&format=png" alt="Avatar">
    <div class="comment-content">
      <p><strong>${usernameForComment}:</strong> ${text}</p>
      <div class="comment-meta">
        ${new Date().toLocaleTimeString()} · <span class="reply-btn">Reply</span>
      </div>
      <div class="reactions">
        <span class="reaction">👍</span> <span>0</span>
        <span class="reaction">❤️</span> <span>0</span>
        <span class="reaction">😂</span> <span>0</span>
        <span class="reaction">🔥</span> <span>0</span>
      </div>
      <span class="like-btn">👍 Like</span> <span class="like-count">0</span>
    </div>
  `;

  container.prepend(comment);

  // Attach emoji reaction functionality for this comment
  comment.querySelectorAll(".reaction").forEach((emoji) => {
    emoji.addEventListener("click", () => {
      const countSpan = emoji.nextElementSibling;
      let count = parseInt(countSpan.textContent, 10);
      countSpan.textContent = count + 1;
    });
  });

  // Enable like button functionality
  comment.querySelector(".like-btn").addEventListener("click", function () {
    this.classList.toggle("liked");
    const countSpan = this.nextElementSibling;
    let count = parseInt(countSpan.textContent, 10);
    countSpan.textContent = this.classList.contains("liked") ? count + 1 : count - 1;
  });

  // Enable reply functionality
  comment.querySelector(".reply-btn").addEventListener("click", function () {
    const replyBox = document.createElement("textarea");
    replyBox.placeholder = "Write a reply...";
    replyBox.classList.add("reply-input");
    this.parentElement.appendChild(replyBox);

    const replyBtn = document.createElement("button");
    replyBtn.textContent = "Reply";
    this.parentElement.appendChild(replyBtn);

    replyBtn.addEventListener("click", function () {
      if (replyBox.value.trim()) {
        const reply = document.createElement("p");
        reply.textContent = `🔁 ${usernameForComment}: ${replyBox.value.trim()}`;
        this.parentElement.appendChild(reply);
        replyBox.remove();
        this.remove();
      }
    });
  });
}

// Handle comment submission for the discussion section
document.getElementById("submitDiscussion").addEventListener("click", function () {
  const text = document.getElementById("discussionInput").value;
  if (text.trim()) {
    addComment(text, username);
    document.getElementById("discussionInput").value = "";
  }
});
