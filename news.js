const newsApiKey = "db8a64e4c9c54a189e1ea90f97e92d55";
const newsContainer = document.getElementById("news-headlines");

// Dropdown toggle
document.querySelector(".news-btn").addEventListener("click", () => {
  newsContainer.style.display = newsContainer.style.display === "block" ? "none" : "block";
});

async function loadNews() {
  try {
    const keywords = "Filipino food OR Filipino cuisine OR food OR culture OR street food";
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      keywords
    )}&language=en&sortBy=publishedAt&apiKey=${newsApiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "ok" && data.articles.length > 0) {
      const headlines = data.articles.slice(0, 3);

      newsContainer.innerHTML = headlines
        .map(
          (article) => `
        <a href="${article.url}" target="_blank">
          ${article.title}
        </a>
      `
        )
        .join("");
    } else {
      newsContainer.innerHTML = "No food/culture news available.";
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    newsContainer.innerHTML = "News unavailable";
  }
}

loadNews();
