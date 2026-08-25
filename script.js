/* ==========================================================================
   1. THE DATA
   This is the most important idea in the whole file: instead of hand-writing
   32 near-identical blocks of HTML, we describe them as plain data — an
   array of category objects, each holding an array of link objects — and
   then write ONE piece of code that turns data into HTML.

   Want to add a 33rd link, or a 9th category? You edit this array only.
   You never touch the HTML-building code below. This "data in, HTML out"
   pattern is how basically every real web app (and every JS framework
   like React) is structured under the hood.
   ========================================================================== */
const CATEGORIES = [
  {
    name: "Anime",
    subtitle: "For WEEBS",
    icon: "🎥",
    links: [
      { name: "Anitaku", domain: "anitaku.io/browse"},
      { name: "AnimeSuge", domain: "anisuge.tv/home" },
      { name: "Anime Nexus", domain: "anime.nexus" },
      { name: "AnimePahe", domain: "animepahe.pw"},
      { name: "Re:Anime", domain: "reanime.to/home"},
      { name: "JustAnime", domain: "justanime.to" },
      { name: "Animex", domain: "animex.one/home" },
      { name: "Yenime", domain: "yenime.net"},
      { name: "Anify", domain: "anify.to"},
      { name: "MiruroTV", domain: "miruro.to"},
      { name: "Enma", domain: "enma.lol/home"},
      { name: "Anikoto", domain: "anikototv.to/home"},
    ],
  },
  {
    name: "Movies & TV",
    subtitle: "FILMS, SERIES, DOCUMENTARIES",
    icon: "🎬",
    links: [
      { name: "RamoFlix", domain: "ramoflix.net"},
      { name: "WMovies", domain: "wmovies.org/home" },
      { name: "Cineby", domain: "cineby.at" },
      { name: "Aether", domain: "aether.bar" },
      { name: "Flixer", domain: "flixer.su" },
      { name: "P-Stream", domain: "pstream.cfd"},
      { name: "FlyStream", domain: "flystream.net"},
      { name: "Flaxfer", domain: "flaxfer.lol"},
      { name: "MovieKid", domain: "moviekids.bz"},
      { name: "fboxtv", domain: "fboxtv.bz"},
    ],  
  },
  {
    name: "Manga | Manwha",
    subtitle: "You hate BGM and SFX huh?",
    icon: "📚️",
    links: [  
      { name: "MangaBall", domain: "mangaball.net"},
      { name: "Mangakakalot", domain: "mangakakalot.gg"},
      { name: "MangaFire", domain: "mangafire.to"},
      { name: "Onisaga", domain: "onisaga.com/home"},
      { name: "Atsumaru", domain: "atsu.moe"},
      { name: "Manganato", domain: "manganato.gg"},
      { name: "WeebCentral", domain: "weebcentral.com"},
      { name: "MangaKatana", domain: "mangakatana.com"},
      { name: "LikeManga", domain: "likemanga.ink"},
      { name: "MangaXo", domain: "mangaxo.com/home"},
      { name: "KingOfShojo", domain: "kingofshojo.com"}, 
      { name: "Kagane", domain: "kagane.to"},
      { name: "Comix", domain: "comix.to"},
      { name: "Toonily", domain: "toonily.com"},
    ],
  },
  {
    name: "Boredom",
    subtitle: "Random shits",
    icon: "🥔",
    links: [
      { name: "TheUselessWeb", domain: "theuselessweb.com" },
      { name: "RadioGarden", domain: "radio.garden" },
      { name: "BoredButton", domain: "boredbutton.com" },
      { name: "FreeRice", domain: "freerice.com" },
      { name: "Neal.Fun", domain: "neal.fun"},
      { name: "Gnoosic", domain: "gnoosic.com"},
      { name: "LittleAlchemy2", domain: "littlealchemy2.com"},
      { name: "Patatap", domain: "patatap.com"},
      { name: "Pointer pointer", domain: "pointerpointer.com"},
    ],
  },
  {
    name: "Torrent",
    subtitle: "Use VPN for these shits",
    icon: "🏴‍☠️",
    links: [
      { name: "ThePirateBay", domain: "thepiratebay3.co" },
      { name: "YTS GG", domain: "yts.gg"},
      { name: "1337x", domain: "1337x.pro" },
      { name: "EXT", domain: "ext.to" },
      { name: "ExtraTorrent", domain: "extratorrent.st" },
      { name: "TorrentGalaxy", domain: "torrentgalaxy.one"},
      { name: "LimeTorrents", domain: "www.limetorrents.fun"},
    ],
  },
  {
    name: "Darkweb (Work in progress)",
    subtitle: "USE AT OWN RISK, USE TOR BROWSER FOR THESE SHITS (this is not negotiable)",
    icon: "🕵",
    links: [
      { name: "TOR Browser", domain: "kunawri link.ork" },
      { name: "Utorrent", domain: "kunwari link.com" },
      { name: "TorchSearchEngine", domain: "fake link.nigga" },
      { name: "If you read this u gae", domain: "lol u gay.fr" },
    ],
  },
];

/* ==========================================================================
   WEATHER CITIES
   Each city needs a name (for display) plus latitude/longitude — the
   weather API doesn't understand city names, only coordinates.
   ========================================================================== */
const WEATHER_CITIES = [
  { name: "Pasig City", lat: 14.5764, lon: 121.0851 },
  { name: "Marikina City", lat: 14.6507, lon: 121.1029 },
  { name: "Makati City", lat: 14.5547, lon: 121.0244 },
];

/* ==========================================================================
   2. GRAB THE ELEMENTS WE'LL BE WORKING WITH
   document.getElementById reaches into the HTML and hands back the actual
   element with that id, as a JavaScript object we can read and modify.
   Doing this once at the top (instead of re-querying every time) is a
   normal habit — it's cheap and keeps the code below readable.
   ========================================================================== */
const directoryEl = document.getElementById("directory");
const pillRowEl = document.getElementById("pill-row");
const searchInputEl = document.getElementById("search-input");

/* ==========================================================================
   3. BUILD THE HTML FROM THE DATA

   Template literals — the backtick `...` strings below — let us mix plain
   text with JavaScript values using ${ } and even loop with .map(). This
   is the core trick: for every category we produce a small HTML string,
   and for every link inside it we produce a small HTML string, and we
   glue them together with .join("").
   ========================================================================== */
function renderDirectory() {
  const html = CATEGORIES.map((category) => {
    const VISIBLE_LIMIT = 4; // how many cards show before "View all" is needed

    // Build one card per link in this category. .map() also hands us the
    // index (position) of each item, starting at 0 — that's the second
    // parameter here, which we use to decide which cards to hide at first.
    const cardsHtml = category.links
      .map((link, index) => {
        // We reuse Google's public favicon service to fetch each site's
        // real icon just from its domain name — no image files needed.
        const iconUrl = `https://www.google.com/s2/favicons?domain=${link.domain}&sz=64`;

        // Cards from position 4 onward (index 4, 5, 6...) get an extra
        // "extra hidden" class. "extra" marks them as part of the
        // collapsible group; "hidden" is what actually hides them via
        // CSS's display: none, same trick the search feature already uses.
        const extraClass = index >= VISIBLE_LIMIT ? " extra hidden" : "";

        return `
          <a
            class="card${extraClass}"
            href="https://${link.domain}"
            target="_blank"
            rel="noopener noreferrer"
            data-name="${link.name.toLowerCase()}"
            data-category="${category.name}"
          >
            <img class="card-icon" src="${iconUrl}" alt="" loading="lazy" />
            <div class="card-text">
              <div class="card-name">${link.name}</div>
              <div class="card-domain">${link.domain}</div>
            </div>
            <span class="card-arrow">↗</span>
          </a>
        `;
      })
      .join(""); // merge the array of card strings into one long string

    // Only build a "View all" button if this category actually has more
    // than VISIBLE_LIMIT links — no point showing it for a 4-link category.
    const hasExtra = category.links.length > VISIBLE_LIMIT;
    const viewAllHtml = hasExtra
      ? `<button class="view-all" data-category="${category.name}">View all</button>`
      : "";

    return `
      <section class="category" data-category="${category.name}">
        <div class="category-header">
          <div class="category-icon">${category.icon}</div>
          <div class="category-titles">
            <h2>${category.name}</h2>
            <p>${category.subtitle}</p>
          </div>
          <div class="category-meta">
            <div class="category-count">${category.links.length} links</div>
            ${viewAllHtml}
          </div>
        </div>
        <div class="card-grid">${cardsHtml}</div>
      </section>
    `;
  }).join("");

  // innerHTML replaces everything inside #directory with the string we
  // just built. This is the one moment where our data turns into real,
  // visible page content.
  directoryEl.innerHTML = html;
}

function renderPills() {
  // "All" plus one pill per category name.
  const names = ["All", ...CATEGORIES.map((c) => c.name)];

  pillRowEl.innerHTML = names
    .map(
      (name, i) =>
        `<button class="pill${i === 0 ? " active" : ""}" data-filter="${name}">${name}</button>`
    )
    .join("");
}

/* ==========================================================================
   4. INTERACTIVITY
   Everything above only DRAWS the page once. Everything below reacts to
   what the user does afterwards — this is what makes it a "web app"
   rather than a static document.
   ========================================================================== */

function setupPillFiltering() {
  // Event delegation: instead of adding a click listener to each of the 9
  // pill buttons individually, we add ONE listener to their shared parent
  // and check which button was actually clicked via event.target. This
  // also means pills added later would still work automatically.
  pillRowEl.addEventListener("click", (event) => {
    const clickedPill = event.target.closest(".pill");
    if (!clickedPill) return; // click landed on the row but not a pill

    // Swap the "active" class from whichever pill had it to the new one.
    pillRowEl.querySelectorAll(".pill").forEach((p) => p.classList.remove("active"));
    clickedPill.classList.add("active");

    const filter = clickedPill.dataset.filter; // reads data-filter="..."
    document.querySelectorAll(".category").forEach((section) => {
      const matches = filter === "All" || section.dataset.category === filter;
      section.classList.toggle("hidden", !matches);
    });

    // Clicking a category filter also clears any active search, so the
    // two controls don't fight each other.
    searchInputEl.value = "";
  });
}

function setupViewAll() {
  // Same event delegation trick as setupPillFiltering: one listener on
  // #directory catches clicks from every "View all" button, even though
  // there could be up to 8 of them (one per category).
  directoryEl.addEventListener("click", (event) => {
    const button = event.target.closest(".view-all");
    if (!button) return; // click wasn't on a View all button

    const categoryName = button.dataset.category;
    const section = button.closest(".category");
    const extraCards = section.querySelectorAll(".card.extra");

    // We check the FIRST extra card to decide the current state, then
    // flip every extra card in this category together, so they always
    // move as a group.
    const isCurrentlyHidden = extraCards[0].classList.contains("hidden");

    extraCards.forEach((card) => card.classList.toggle("hidden", !isCurrentlyHidden));
    button.textContent = isCurrentlyHidden ? "Show less" : "View all";
  });
}

function setupSearch() {
  // "input" fires on every keystroke (unlike "change", which waits until
  // you click away). That's what gives us live, as-you-type filtering.
  searchInputEl.addEventListener("input", () => {
    const query = searchInputEl.value.trim().toLowerCase();

    // If someone starts typing, drop back to "All" categories so search
    // can find matches anywhere on the page.
    if (query) {
      pillRowEl.querySelectorAll(".pill").forEach((p) =>
        p.classList.toggle("active", p.dataset.filter === "All")
      );
    }

    document.querySelectorAll(".category").forEach((section) => {
      let visibleCount = 0;

      section.querySelectorAll(".card").forEach((card) => {
        const matches = query === "" || card.dataset.name.includes(query);
        card.classList.toggle("hidden", !matches);
        if (matches) visibleCount++;
      });

      // Hide the whole category header if none of its cards matched.
      section.classList.toggle("hidden", visibleCount === 0);
    });
  });
}

async function getCityWeather(city) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code`;
  const response = await fetch(url);
  const data = await response.json();

  return {
    name: city.name,
    temp: Math.round(data.current.temperature_2m),
    code: data.current.weather_code,
  };
}

// Wraps the browser's geolocation API in a Promise, so we can use
// await with it just like fetch(). getCurrentPosition() itself is
// older-style JS that uses two callback functions (success, failure)
// instead of a Promise — this function is a small adapter between
// the old style and the modern async/await style we've been using.
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords), // success: hands back { latitude, longitude }
      (error) => reject(error) // failure: user denied, or it timed out
    );
  });
}

async function loadWeather() {
  const weatherSection = document.getElementById("weather");
  weatherSection.innerHTML = `<p class="weather-loading">Loading weather…</p>`;

  let citiesToShow = WEATHER_CITIES; // start with the 3 presets

  try {
    const coords = await getUserLocation();
    // Successfully got real location — ADD it to the front of the list
    // instead of replacing the presets. The spread syntax (...) below
    // copies every item out of WEATHER_CITIES into this new array,
    // right after "Your Location".
    citiesToShow = [
      { name: "Your Location", lat: coords.latitude, lon: coords.longitude },
      ...WEATHER_CITIES,
    ];
  } catch (error) {
    // Permission denied, unsupported browser, or timed out — silently
    // fall back to the 3 preset cities. console.log here just helps us
    // see WHY it fell back, without showing an ugly error to the user.
    console.log("Location unavailable, using presets:", error.message);
  }

  const results = await Promise.all(citiesToShow.map(getCityWeather));

  const WEATHER_CODES = {
    0: { desc: "Clear sky", icon: "☀️" },
    1: { desc: "Mostly clear", icon: "🌤️" },
    2: { desc: "Partly cloudy", icon: "⛅" },
    3: { desc: "Overcast", icon: "☁️" },
    45: { desc: "Foggy", icon: "🌫️" },
    51: { desc: "Light drizzle", icon: "🌦️" },
    61: { desc: "Light rain", icon: "🌧️" },
    63: { desc: "Rain", icon: "🌧️" },
    65: { desc: "Heavy rain", icon: "⛈️" },
    80: { desc: "Rain showers", icon: "🌦️" },
    95: { desc: "Thunderstorm", icon: "⛈️" },
  };

  const cardsHtml = results
    .map((city) => {
      const weather = WEATHER_CODES[city.code] || { desc: "—", icon: "🌡️" };
      return `
        <div class="weather-card">
          <div class="weather-icon">${weather.icon}</div>
          <div class="weather-city">${city.name}</div>
          <div class="weather-temp">${city.temp}°C</div>
          <div class="weather-desc">${weather.desc}</div>
        </div>
      `;
    })
    .join("");

  weatherSection.innerHTML = `<div class="weather-grid">${cardsHtml}</div>`;
}

/* ==========================================================================
   5. RUN EVERYTHING
   This is the only part of the file that actually executes top-to-bottom
   on page load; everything above is just defining functions and data for
   these calls to use.
   ========================================================================== */
function setupBadgePrank() {
  const trigger = document.getElementById("badge-trigger");
  const overlay = document.getElementById("video-overlay");
  const closeBtn = document.getElementById("overlay-close");
  const video = document.getElementById("prank-video");

  function openOverlay() {
    overlay.classList.remove("hidden");
    video.currentTime = 0;
    video.play();
  }

  function closeOverlay() {
    overlay.classList.add("hidden");
    video.pause();
  }

  trigger.addEventListener("click", openOverlay);
  closeBtn.addEventListener("click", closeOverlay);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeOverlay();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.classList.contains("hidden")) {
      closeOverlay();
    }
  });
}

setupBadgePrank();
loadWeather();
renderPills();
renderDirectory();
setupPillFiltering();
setupViewAll();
setupSearch();
setupBadgePrank();