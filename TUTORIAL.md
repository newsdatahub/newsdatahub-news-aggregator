# Build a News Aggregator in 10 Minutes with NewsDataHub API

> Learn real-world API integration, caching strategies, and deployment patterns while building a complete news aggregator.
>
> **BONUS:** Deploy it and get 50% off NewsDataHub API for 3 months!

## What You'll Learn

This isn't just copy-paste code. You'll understand core web development concepts:

1. **What a Proxy Is** - And why every app needs one
2. **Caching Fundamentals** - Speed up apps and reduce costs
3. **Smart Caching Strategies** - Cache different data differently
4. **Docker Deployment** - Package and deploy anywhere
5. **Boolean Search** - Build powerful query interfaces
6. **Demo Mode Pattern** - Let users try before they buy

**Perfect for:** Developers learning API integration, full-stack development, or building news/content platforms.

## What You'll Build

![News Aggregator Demo](assets/newsdatahub-aggregator-live.gif)

A working news aggregator with:
- Real-time news from 170+ countries and 40+ languages
- Advanced filtering (country, topic, political leaning, source type)
- Boolean search (AND, OR, NOT operators)
- Dark mode with theme persistence
- Responsive design (mobile, tablet, desktop)

**Tech Stack:** React, TypeScript, Express, NewsDataHub API, Docker

---

## Try the Demo First (2 minutes)

Before building, see what you'll create:

```bash
git clone https://github.com/newsdatahub/newsdatahub-news-aggregator.git
cd newsdatahub-news-aggregator
docker compose up
```

Open http://localhost - explore the features, then build your own!

**Note:** Demo mode uses pre-cached data and mimics free tier limitations (no keywords/topics/sentiment, truncated content). To get real-time news with the same free tier features, you'll need a free API key from [NewsDataHub](https://newsdatahub.com).

---

## Part 1: Understanding the Architecture (10 min read)

### Why This Architecture?

Most tutorials show frontend directly calling an API. **This doesn't work well.** Here's why:

```
❌ BASIC ARCHITECTURE (insecure, inefficient)
[Browser] → [News API]
Problems:
- API key exposed in browser code
- Every request hits API (slow + expensive)
- CORS issues
- Can't filter sensitive data
- No offline/demo mode

✅ BETTER ARCHITECTURE (what we're building)
[Browser] → [Your Backend Proxy] → [NewsDataHub API]
              ↓
         [Cache Layer]
         [Demo Mode]
Benefits:
- API key stays secure on server
- Cache reduces API calls by 90%
- Full control over responses
- Demo mode possible
- Can add auth, rate limiting, etc.
```

[Architecture Diagram]

Let's understand each piece...

---

### Concept #1: What is a Proxy?

**Simple explanation:** A proxy is a middleman server that forwards requests between your frontend and external APIs.

**Real-world analogy:**

Imagine you want to order from a restaurant that only does phone orders, but you don't speak their language. You call a translator (proxy) who:
1. Takes your order
2. Translates it
3. Calls the restaurant
4. Gets the food
5. Brings it to you

Your translator is a proxy - they act on your behalf.

**In our app:**

```
User requests news
    ↓
Your backend (proxy) receives request
    ↓
Your backend calls NewsDataHub API (with API key)
    ↓
NewsDataHub sends news data
    ↓
Your backend forwards it to user
```

[Proxy Sequence Diagram]

**Why use a proxy for APIs?**

1. **Security** - API keys stay on your server, never exposed to users
   ```typescript
   // WITHOUT PROXY: API key visible in browser
   fetch('https://api.newsdatahub.com/news', {
     headers: { 'X-API-Key': 'abc123' } // Anyone can steal this!
   })

   // WITH PROXY: API key safe on server
   fetch('https://your-backend.com/api/news') // No key needed!
   // Your backend adds the key securely
   ```

2. **Caching** - Store responses to avoid repeated API calls (save money + speed)

3. **Control** - Filter, modify, or enhance responses before sending to users

4. **Rate Limiting** - Protect yourself from abuse

5. **Monitoring** - Log usage, track errors, analyze patterns

**Real-world examples:**
- **Stripe** - Never put your secret key in frontend
- **Google Maps** - Use server-side key
- **OpenAI** - API keys must stay server-side

**The Pattern:**

```typescript
// Your frontend calls your backend
const response = await fetch('/api/news?topic=tech');

// Your backend proxies to the real API
app.get('/api/news', async (req, res) => {
  // Add authentication, check cache, etc.
  const data = await fetch('https://api.newsdatahub.com/v1/news', {
    headers: { 'X-API-Key': process.env.API_KEY } // Safe!
  });
  res.json(data);
});
```

This is called the **API Gateway Pattern** or **Backend-for-Frontend (BFF) Pattern**. Most modern apps use this architecture to keep API credentials secure and add server-side logic like caching, authentication, and rate limiting.

---

### Concept #2: What is Caching?

**Simple explanation:** Caching means storing results so you don't have to recalculate or re-fetch them.

**Real-world analogy:**

Your friend asks: "What's 547 × 923?"

**Without caching:**
- You calculate: 547 × 923 = 504,881
- Friend asks again tomorrow
- You calculate again: 547 × 923 = 504,881
- Friend asks next week
- You calculate AGAIN: 547 × 923 = 504,881

**With caching:**
- You calculate once: 547 × 923 = 504,881
- You write it down (cache it)
- Friend asks again? You just read your note
- Instant answer, no recalculation!

**In web apps:**

```typescript
// WITHOUT CACHING (slow + expensive)
User requests news about "technology"
  → Call API ($)
  → Wait 500ms
  → Return results

User requests SAME news again
  → Call API AGAIN ($)
  → Wait 500ms AGAIN
  → Return SAME results

// WITH CACHING (fast + cheap)
User requests news about "technology"
  → Check cache (is it stored?)
  → Not found
  → Call API ($)
  → Wait 500ms
  → Store in cache
  → Return results

User requests SAME news again
  → Check cache
  → Found it!
  → Return results (instant, free!)
```

[Caching Flow Diagram]

**Why caching is crucial:**

1. **Speed** - Cached responses are 100x faster (1-5ms vs 100-500ms)
   - Improves user experience dramatically
   - Reduces server load

2. **Cost** - Reduce API calls = lower bills
   - Most APIs charge per request
   - With good caching, you can reduce API calls by 90%+

3. **Reliability** - If API goes down, cache keeps working
   - Your app stays functional during API outages
   - Graceful degradation

4. **User Experience** - Pages load instantly
   - No waiting for API responses
   - Smooth, responsive interface

5. **API Quota** - Stay within free tier limits
   - Avoid hitting rate limits
   - Maximize free tier usage

**Why TTL (Time To Live) is important:**

TTL determines how long cached data remains valid before it expires. This is critical because:

- **Too short TTL**: Defeats the purpose of caching - you'll still make too many API calls
- **Too long TTL**: Users see stale data - yesterday's news shown as "latest"
- **Smart TTL**: Match cache duration to how often data actually changes

In our news aggregator:
- Fresh news (today): 1 hour TTL - balances freshness with reduced API calls
- Historical news (last week): 24 hour TTL - this data never changes, so cache it longer
- This means 100 users viewing the same article = 1 API call instead of 100

**Types of caching:**

- **Browser Cache** - Browser stores images, CSS, JS
- **CDN Cache** - CloudFlare stores your static files
- **Server Cache** - Your backend stores API responses (what we're building!)
- **Database Cache** - Redis/Memcached for frequent queries

**When NOT to cache:**

- User-specific data (personal info, shopping carts)
- Real-time data (stock prices, live sports scores)
- Frequently changing data (unless short TTL)

---

### Concept #3: Smart Caching Strategy

Not all data should be cached the same way. Our app uses **dynamic TTL** (Time To Live):

```typescript
// SMART CACHING
function getCacheTTL(startDate, endDate) {
  const today = new Date().toISOString().split('T')[0];

  // Recent news changes frequently → short cache
  if (!endDate || endDate >= today) {
    return 60 * 60; // 1 hour
  }

  // Historical news never changes → long cache
  return 60 * 60 * 24; // 24 hours
}
```

**Why this is clever:**

| News Type | Changes? | Cache Duration | Why? |
|-----------|----------|----------------|------|
| Today's news | New articles every minute | 1 hour | Balance freshness vs API calls |
| Yesterday's news | Rarely changes | 24 hours | Mostly static |
| Last week's news | Never changes | 24 hours | Completely static |

**Real impact in our app:**

```
WITHOUT SMART CACHING:
- 100 users browse today's news
- 100 API calls
- Cost: $X

WITH SMART CACHING:
- 100 users browse today's news
- First user: 1 API call (then cached for 1 hour)
- Next 99 users: 0 API calls (served from cache)
- Cost: $X/100

90% reduction in API calls!
```

**Other caching strategies:**

1. **Cache-Aside** (what we use)
   - Check cache first
   - If miss, fetch from API
   - Store in cache

2. **Write-Through**
   - Write to cache and database simultaneously

3. **Cache Invalidation**
   - Remove cache when data changes
   - "The two hard things: naming and cache invalidation"

**Cache key design:**

```typescript
// Build unique cache key from parameters
const cacheKey = `news:${JSON.stringify({
  q: "technology",
  country: "us",
  language: "en"
})}`;

// Different queries = different cache keys
"news:{'q':'tech','country':'us'}"  ← Separate cache
"news:{'q':'tech','country':'gb'}"  ← Separate cache
```

---

### Concept #4: Demo Mode Pattern

**Problem:** You want users to try your app without burning your API credits.

**Solution:** Demo data service that mimics real API with free tier restrictions.

```typescript
// Check if demo mode enabled
const result = config.ENABLE_DEMO_MODE
  ? demoDataService.getArticles(params)  // Local JSON files
  : newsService.searchArticles(params);   // Real NewsDataHub API
```

**How it works:**

1. Store sample API responses as JSON files (`demo-data/*.json`)
2. Load them on server startup
3. Apply free tier restrictions (remove keywords/topics/sentiment, truncate content)
4. Filter locally using same parameters
5. Return in same format as real API

**Benefits:**

- Landing page visitors can explore for free
- Unlimited demos without API costs
- Works offline
- Perfect for development/testing
- Same code paths (just different data source)
- **Accurately represents free tier limitations** so users know what to expect

**Real-world use:**

```bash
# Public demo site (demo mode)
ENABLE_DEMO_MODE=true

# Your production site (real API)
ENABLE_DEMO_MODE=false
NEWSDATAHUB_API_KEY=your_key
```

---

### Concept #5: What is Docker?

**Simple explanation:** Docker packages your app with everything it needs to run, so it works the same everywhere.

**Real-world analogy:**

**Without Docker:**

You bake a cake at home. Recipe says:
- "Bake at 350°F for 30 minutes"

You send the recipe to a friend. They bake it:
- Their oven runs hot → cake burns
- They use different flour → wrong texture
- Different altitude → doesn't rise

Same recipe, different results!

**With Docker:**

You bake the cake, then:
- Put the cake in a special container
- Container keeps it perfect
- Send container to friend
- They open it → perfect cake, exactly like yours

Docker is the container!

**In software:**

```
WITHOUT DOCKER:
You: "My app works fine!"
Coworker: "Doesn't work on my laptop"
You: "What Node version?"
Coworker: "16"
You: "I use 18"
Coworker: "What packages installed?"
You: "Uh... not sure"
Works on my machine!

WITH DOCKER:
You: "Here's the Docker image"
Coworker: docker run yourapp
Everything works perfectly!
Works everywhere!
```

**What Docker does:**

1. **Packages your app** with:
   - Your code
   - Node.js (exact version)
   - All dependencies
   - System libraries
   - Environment setup

2. **Creates identical environments**:
   - Dev laptop
   - Coworker's laptop
   - Staging server
   - Production server

   All run EXACTLY the same!

**Docker concepts:**

```dockerfile
# Dockerfile - Recipe for building your app container
FROM node:18-alpine          # Start with Node.js 18
WORKDIR /app                 # Set working directory
COPY package*.json ./        # Copy dependency list
RUN npm install              # Install dependencies
COPY . .                     # Copy your code
RUN npm run build            # Build app
CMD ["npm", "start"]         # Run app
```

```yaml
# docker-compose.yml - Recipe for multiple containers
services:
  backend:                   # Your backend container
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - API_KEY=xyz

  frontend:                  # Your frontend container
    build: ./frontend
    ports:
      - "80:80"
```

**Why Docker is useful:**

1. **Consistency**
   - Eliminate "works on my machine" problems
   - Dev, staging, prod all identical

2. **Easy deployment**
   ```bash
   docker compose up -d
   # App is running!
   ```

3. **Isolation**
   - Each app in its own container
   - No dependency conflicts

4. **Portability**
   - Works on Mac, Windows, Linux
   - Move between cloud providers easily

5. **Scalability**
   ```bash
   docker compose up --scale backend=5
   # Now running 5 backend instances!
   ```

**Alternatives to Docker:**

| Approach | Pros | Cons | When to Use |
|----------|------|------|-------------|
| **Manual deployment** | Simple, no new tools | Inconsistent, error-prone | Tiny projects, learning |
| **Virtual Machines** | Full OS isolation | Heavy (GBs), slow to start | Legacy apps, Windows apps |
| **Platform-as-a-Service** (Heroku, Railway, Vercel) | Dead simple, managed | Less control, vendor lock-in | Quick deployments, prototypes |
| **Serverless** (AWS Lambda, Vercel Functions) | Auto-scaling, pay-per-use | Cold starts, limited runtime | APIs, event-driven apps |
| **Docker** | Portable, consistent, efficient | Learning curve | Most production apps |
| **Kubernetes** | Orchestrates 1000s of containers | Very complex | Large-scale deployments |

**For this tutorial:**
- **Development:** Docker Compose (easy multi-container setup)
- **Production options:** Docker (any host), Railway (PaaS), Vercel (serverless frontend)

**Quick Docker commands:**

```bash
# Start your app
docker compose up

# Start in background
docker compose up -d

# View logs
docker compose logs -f

# Stop app
docker compose down

# Rebuild after code changes
docker compose up --build
```

---

### About NewsDataHub API

Now that you understand the concepts, here's what NewsDataHub provides:

**NewsDataHub** gives you access to 200,000+ fresh articles daily from 6,500+ unique sources across 170+ countries in 40+ languages — enriched with topics, source metadata, and more.

**Key Features:**

- **170+ countries** - True global coverage
- **40+ languages** - Build multilingual apps
- **6,500+ sources** - Newspapers, magazines, digital native, broadcast, wire services
- **200,000+ daily articles** - Fresh content updated continuously
- **Advanced filtering** - Political leaning, source type, topics, date ranges
- **Boolean search** - AND/OR/NOT operators built-in
- **Rich metadata** - Topics, source information, political leaning
- **High rate limits** - Generous free tier
- **No credit card** - Start building immediately
- **Developer-friendly** - Clean REST API, excellent docs

**Perfect for:**
- News aggregator websites
- Content curation platforms
- Media monitoring tools
- Research applications
- Custom news apps

---

## Part 2: Build It (Quick Start)

### Option 1: Clone & Customize (5 minutes)

Fastest path to a working app:

```bash
# 1. Clone the repository
git clone https://github.com/newsdatahub/newsdatahub-news-aggregator.git
cd newsdatahub-news-aggregator

# 2. Get your free API key
# Visit: https://newsdatahub.com
# Sign up (no credit card required)
# Copy your API key

# 3. Configure backend environment
cp backend/.env.example backend/.env
# Edit backend/.env and set:
# NEWSDATAHUB_API_KEY=your_key_here
# ENABLE_DEMO_MODE=false

# 4. Run with Docker
docker compose up

# 5. Open browser
# http://localhost
```

Done! You have a working news aggregator with real-time data from NewsDataHub.

**Try it:**
- Search: "quantum AND computing"
- Filter by country: United States
- Filter by topic: Technology

---

### Option 2: Understanding the Code (15 minutes)

Want to understand how it works? Let's walk through the key files.

#### Backend: The Smart Proxy

**File: `backend/src/services/newsService.ts`**

This is where the magic happens:

```typescript
class NewsService {
  async searchArticles(params: NewsSearchParams): Promise<NewsApiResponse> {
    // STEP 1: Build cache key using utility function
    const cacheKey: string = buildCacheKey(params);

    // STEP 2: Check cache first
    const cached: NewsApiResponse | null = cacheService.get<NewsApiResponse>(cacheKey);
    if (cached) {
      return cached; // Instant response!
    }

    // STEP 3: Build query parameters using utility
    const queryParams: Record<string, string | number> = buildNewsQuery(params);
    if (!queryParams.per_page) {
      queryParams.per_page = DEFAULT_PAGE_SIZE;
    }

    // STEP 4: Build URL and make API request
    const queryString: string = buildQueryString(queryParams);
    const url: string = `${API_BASE_URL}${API_ENDPOINTS.NEWS}${queryString}`;

    try {
      const response: NewsApiResponse = await makeGetRequest<NewsApiResponse>(url, {
        'X-API-Key': this.apiKey, // Secure - only on server!
      });

      // STEP 5: Cache with smart TTL
      const ttl: number = this.getCacheTTL(params.start_date, params.end_date);
      cacheService.set(cacheKey, response, ttl);

      return response;
    } catch (error) {
      logger.error('Failed to fetch news', { error });
      throw error;
    }
  }

  // Smart TTL: recent news = short cache, old news = long cache
  private getCacheTTL(_startDate?: string, endDate?: string): number {
    const today: string = new Date().toISOString().split('T')[0];

    if (!endDate || endDate >= today) {
      return CACHE_TTL.CURRENT_DAY; // 1 hour for current news
    }

    return CACHE_TTL.HISTORICAL; // 24 hours for historical news
  }
}
```

**What you learned:**
- Proxy pattern (frontend → backend → API)
- Cache-aside pattern (check cache → fetch if needed → store)
- Dynamic TTL (different cache times for different data)
- Secure API key handling (server-side only)

#### Frontend: Calling the Proxy

**File: `frontend/src/services/newsApi.ts`**

Frontend calls your backend (not NewsDataHub directly):

```typescript
export async function searchNews(params: NewsSearchParams) {
  // Call YOUR backend, not NewsDataHub
  const API_BASE_URL = 'http://localhost:3001';

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, String(value));
  });

  try {
    // No API key needed - backend handles it!
    const response = await fetch(`${API_BASE_URL}/api/news/search?${query}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch news:', error);
    throw error;
  }
}
```

**Notice:**
- No API key in frontend code
- Simple fetch - complexity hidden in backend
- Same interface whether using cache or live API

#### Cache Service

**File: `backend/src/services/cacheService.ts`**

Simple in-memory cache with TTL:

```typescript
interface CacheEntry<T> {
  data: T;
  expiresAt: number; // Timestamp when cache expires
}

class CacheService {
  private cache = new Map<string, CacheEntry<any>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlSeconds: number): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }
}
```

**Cache lifecycle:**

```
1. set('news:tech', data, 3600)
   → Stored with expiry = now + 1 hour

2. get('news:tech') [30 mins later]
   → now < expiry
   → Return cached data

3. get('news:tech') [2 hours later]
   → now > expiry
   → Delete expired cache
   → Return null (will fetch fresh)
```

**Note:** This uses in-memory cache (resets on server restart). For production, consider Redis for persistent cache across server restarts and multiple instances.

---

## Part 3: Key Features Deep Dive

### Boolean Search with NewsDataHub

NewsDataHub supports powerful Boolean operators for precise queries:

```typescript
// AND - both terms must appear
"quantum AND computing"
→ Articles containing both "quantum" AND "computing"

// OR - either term can appear
"tesla OR spacex"
→ Articles about Tesla or SpaceX or both

// NOT - exclude results
"apple NOT fruit"
→ Articles about Apple (the company), not apples (the fruit)

// Complex queries with parentheses
"(tesla OR spacex) AND musk NOT twitter"
→ Articles about (Tesla or SpaceX) AND Musk, excluding Twitter mentions

// Phrase search with quotes
"artificial intelligence"
→ Exact phrase match
```

**Try it yourself:**

1. Run your app
2. Search: `technology AND (AI OR "artificial intelligence")`
3. Notice precise, relevant results

**How it works:**

NewsDataHub parses Boolean operators server-side. You just pass the query string:

```typescript
// Frontend
const params = {
  q: "(tesla OR spacex) AND musk NOT twitter",
  country: "us",
  language: "en"
};

// Backend proxies to NewsDataHub
const response = await fetch(
  'https://api.newsdatahub.com/v1/news?' +
  'q=(tesla OR spacex) AND musk NOT twitter&country=us&language=en',
  { headers: { 'X-API-Key': apiKey }}
);

// NewsDataHub returns precisely filtered results
```

**Use cases:**
- **Research:** `"climate change" AND (policy OR legislation) NOT opinion`
- **Brand monitoring:** `"YourBrand" NOT competitor`
- **Topic tracking:** `(AI OR "machine learning") AND (ethics OR regulation)`

---

### Multi-Dimensional Filtering

NewsDataHub provides rich metadata for filtering:

#### By Country (170+ countries)

```typescript
// Single country
country: "us"

// Multiple countries
country: "us,gb,ca"

// Available: us, gb, ca, au, de, fr, es, it, jp, kr, in, br, mx, and 160+ more
```

#### By Language (40+ languages)

```typescript
// English only
language: "en"

// Available: en, es, fr, de, zh, ar, pt, ru, ja, ko, and 30+ more
```

#### By Political Leaning

```typescript
// Center sources only
political_leaning: "center"

// Center and center-left
political_leaning: "center,center_left"

// Available values:
// - far_left
// - left
// - center_left
// - center
// - center_right
// - right
// - far_right
```

**Use case:** Build balanced news feeds or analyze media bias.

#### By Topic

```typescript
// Technology news
topic: "tech"

// Multiple topics
topic: "tech,business"

// Exclude topics
exclude_topic: "sports,entertainment"

// Available: tech, business, politics, health, science,
//            sports, entertainment, world, lifestyle, ...
```

#### By Source Type

```typescript
// Newspapers only
source_type: "newspaper"

// Multiple types
source_type: "newspaper,magazine"

// Available:
// - newspaper
// - magazine
// - digital_native
// - mainstream_news
// - blog
// - specialty_news
// - press_release
```

#### By Date Range

```typescript
// Last 7 days
start_date: "2024-01-01"
end_date: "2024-01-07"

// Format: YYYY-MM-DD
```

**Combine filters:**

```typescript
const params = {
  q: "artificial intelligence",
  country: "us,gb",
  language: "en",
  topic: "tech,business",
  political_leaning: "center,center_left,center_right",
  source_type: "newspaper,magazine",
  start_date: "2024-01-01",
  end_date: "2024-01-31"
};

// Returns: English articles about AI from US/UK newspapers
// and magazines with center political leaning, Jan 2024
```

---

### Pagination with Cursors

NewsDataHub uses cursor-based pagination (better than offset):

```typescript
// First page
const page1 = await searchNews({ q: "technology", per_page: 10 });
// Returns: { data: [...10 articles], next_cursor: "abc123" }

// Next page
const page2 = await searchNews({ cursor: "abc123" });
// Returns: { data: [...10 more articles], next_cursor: "def456" }

// Continue until next_cursor is null
```

**Why cursors > offsets:**

```
OFFSET PAGINATION (bad for large datasets):
Page 1: OFFSET 0 LIMIT 10   ← Fast
Page 100: OFFSET 1000 LIMIT 10  ← Slow! Database scans 1000 rows

CURSOR PAGINATION (scales well):
Page 1: Start from beginning
Page 100: Start from cursor "xyz"  ← Same speed as page 1!
```

**Implementation:**

```typescript
const loadMore = async () => {
  if (!nextCursor) return; // No more pages

  const result = await searchNews({ cursor: nextCursor });
  setArticles(prev => [...prev, ...result.data]); // Append
  setNextCursor(result.next_cursor); // Update cursor
};
```

---

## Special Offer: Deploy & Get 50% Off!

**Deploy your news aggregator and get 50% off NewsDataHub API for 3 months!**

### How to Claim Your Discount:

1. **Deploy your news aggregator**
   - Use Railway, Vercel, your own server, or any platform
   - Must be publicly accessible via URL

2. **Connect to NewsDataHub API**
   - Set `ENABLE_DEMO_MODE=false`
   - Use your real API key
   - Verify it's fetching live news

3. **Email us at support@newsdatahub.com** with:
   - **Subject:** "News Aggregator Deployment - 50% Discount"
   - Your live app URL
   - Your NewsDataHub account email
   - Brief description of what you built/customized (1-2 sentences)
   - Screenshot (optional but encouraged!)

4. **We verify your deployment**
   - We'll check that your app is live and using NewsDataHub API
   - Usually within 1 business day

5. **Get your discount automatically applied**
   - 50% off for 3 months
   - Applied to your NewsDataHub account

### Requirements:

- Must be publicly accessible (we need to verify it works)
- Must use real NewsDataHub API (not demo mode)
- Must keep "Powered by NewsDataHub" attribution
- One discount per person
- Valid for new and existing NewsDataHub accounts

### Bonus: Get Featured!

We showcase the best deployments on our [Community Examples](https://newsdatahub.com/examples) page!

**Benefits of being featured:**
- Exposure to thousands of developers
- Backlink to your app (SEO boost)
- Portfolio piece you can show employers
- Recognition in our community

**What gets featured:**
- Unique UI/theme customizations
- Additional features (email alerts, RSS feeds, etc.)
- Niche focus (tech news only, local news, specific topics)
- Creative use of NewsDataHub filters
- Great mobile experience
- Accessibility improvements

**To be considered for showcase:**
- Mention in your email that you'd like to be featured
- Include 2-3 screenshots
- Brief description of what makes it special

---

## Part 4: Customize & Extend

### Quick Customizations (5-10 minutes each)

#### Change Theme Colors

Edit `frontend/src/index.css`:

```css
:root {
  /* Change primary color */
  --color-primary: #3b82f6;     /* Blue - change to your brand color */

  /* Change background */
  --bg-primary: #ffffff;        /* Light mode background */

  /* Change text */
  --text-primary: #111827;      /* Main text color */
}

.dark {
  /* Dark mode colors */
  --bg-primary: #111827;
  --text-primary: #f9fafb;
}
```

#### Add Your Logo

Replace in `frontend/src/components/Header.tsx`:

```typescript
<header className="header">
  <img src="/your-logo.png" alt="Your Site" />
  <h1>Your News Site</h1>
</header>
```

#### Change Default Filters

Edit `frontend/src/App.tsx`:

```typescript
const INITIAL_FILTERS: FilterState = {
  countries: ['us'],           // Default to US news
  language: 'en',              // Default to English
  topics: ['tech'],            // Default to tech news
  politicalLeanings: [],
  excludeTopics: ['sports'],   // Exclude sports
  sourceTypes: [],
  startDate: '',
  endDate: '',
};
```

#### Customize Results Per Page

Edit `frontend/src/App.tsx`:

```typescript
const params = {
  // ... other params
  per_page: 50, // Change from 100 to 50
};
```

---

### Advanced Extensions (30-60 minutes each)

#### 1. Add Email Notifications

When specific topics are mentioned, email the user:

```typescript
// backend/src/services/notificationService.ts
import nodemailer from 'nodemailer';

export async function checkAndNotify(articles, userPreferences) {
  const matches = articles.filter(article =>
    article.topics.some(topic =>
      userPreferences.alertTopics.includes(topic)
    )
  );

  if (matches.length > 0) {
    await sendEmail(userPreferences.email, matches);
  }
}
```

**Use case:** Alert me when articles mention "climate policy"

#### 2. Add User Accounts

Save preferences, bookmarks, reading history:

```typescript
// Add PostgreSQL/MongoDB
// Store:
// - User preferences (default filters)
// - Saved articles
// - Reading history
// - Custom alerts
```

**Stack:** Add Prisma (PostgreSQL) or Mongoose (MongoDB)

#### 3. Generate RSS Feeds

Create custom RSS feeds from NewsDataHub queries:

```typescript
// backend/src/routes/rss.ts
import RSS from 'rss';

app.get('/rss/:topic', async (req, res) => {
  const articles = await newsService.searchArticles({
    topic: req.params.topic
  });

  const feed = new RSS({
    title: `${req.params.topic} News`,
    description: `Latest ${req.params.topic} news`,
    feed_url: `https://yoursite.com/rss/${req.params.topic}`,
    site_url: 'https://yoursite.com',
  });

  articles.data.forEach(article => {
    feed.item({
      title: article.title,
      description: article.description,
      url: article.url,
      date: article.pub_date,
    });
  });

  res.type('application/rss+xml');
  res.send(feed.xml());
});
```

**Use case:** Subscribe to tech news in your RSS reader

#### 4. Sentiment Analysis

Track positive/negative news trends:

```typescript
// Use sentiment analysis library
import Sentiment from 'sentiment';

const sentiment = new Sentiment();

articles.forEach(article => {
  const score = sentiment.analyze(article.title + ' ' + article.description);
  article.sentiment = score.comparative; // -1 to 1
});

// Show sentiment indicator in UI
// Track sentiment over time
// Alert on negative news spikes
```

#### 5. Mobile App (React Native)

Reuse your backend, build mobile frontend:

```bash
npx react-native init NewsAggregatorMobile
# Copy frontend/src/services/newsApi.ts
# Build mobile UI with React Native components
# Deploy to iOS/Android
```

---

## What You Learned

Congratulations! You now understand:

### Core Concepts
- **What a proxy is** - And why apps need one
- **API Gateway Pattern** - Secure, controllable API access
- **Caching fundamentals** - Speed + cost savings
- **Smart caching strategies** - Dynamic TTL based on data freshness
- **Docker basics** - Package and deploy anywhere
- **Docker Compose** - Multi-container applications

### NewsDataHub API
- **Boolean search** - AND/OR/NOT operators
- **Multi-dimensional filtering** - Country, language, topic, political leaning
- **Cursor pagination** - Efficient, scalable pagination
- **API best practices** - Rate limiting, error handling, caching

### Full-Stack Development
- **Backend proxy** - Express + TypeScript
- **Frontend SPA** - React + TypeScript
- **Type safety** - Shared types across frontend/backend
- **Environment config** - Secure secrets management

### Testing & Quality Assurance
This project includes **97 tests** covering backend, frontend, and end-to-end workflows:
- ✅ **41 backend tests** - Unit tests for utilities and integration tests for API endpoints
- ✅ **52 frontend tests** - Unit tests for formatters and API client, plus component tests
- ✅ **4 E2E tests** - Full user workflows with Playwright

**Run the tests:**
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# E2E tests (from project root)
npm run test:e2e

# All tests
npm run test:all
```

For detailed testing documentation, see [TESTING.md](TESTING.md).

---

## Next Steps

### Master NewsDataHub API

- Read [API Documentation](https://newsdatahub.com/docs)
- Explore all [filter options](https://newsdatahub.com/docs/filters)
- Check [example use cases](https://newsdatahub.com/examples)
- Join community discussions

### Improve Your App

**Short-term (this week):**
- Customize theme/branding
- Add more filters to UI
- Improve mobile responsive design
- Add loading skeletons
- Implement error boundaries

**Medium-term (this month):**
- User accounts + authentication
- Save articles for later
- Email notifications
- Share functionality
- SEO optimization (meta tags, sitemap)

**Long-term (next 3 months):**
- Sentiment analysis
- Custom RSS feeds
- Mobile app (React Native)
- Analytics dashboard
- Monetization strategy

### Learn More

**Advanced topics to explore:**
- Redis for distributed caching
- PostgreSQL for data persistence
- Elasticsearch for custom search
- GraphQL API layer
- Server-side rendering (Next.js)
- Real-time updates (WebSockets)
- A/B testing
- Analytics integration

### Share Your Work

Built something cool?

- Star the [GitHub repo](https://github.com/newsdatahub/newsdatahub-news-aggregator)
- Share on Twitter/X - tag @newsdatahub
- Email us: support@newsdatahub.com
- Add to your portfolio
- Write a blog post about your experience

---

## Resources

### NewsDataHub

- **Website:** [https://newsdatahub.com](https://newsdatahub.com)
- **Sign Up (Free):** [https://newsdatahub.com](https://newsdatahub.com)
- **Documentation:** [https://newsdatahub.com/docs](https://newsdatahub.com/docs)
- **API Reference:** [https://newsdatahub.com/docs/api](https://newsdatahub.com/docs/api)
- **Support:** support@newsdatahub.com

### This Project

- **GitHub:** [https://github.com/newsdatahub/newsdatahub-news-aggregator](https://github.com/newsdatahub/newsdatahub-news-aggregator)
- **Live Demo:** [Try demo mode](https://github.com/newsdatahub/newsdatahub-news-aggregator#demo)
- **Issues:** [Report bugs](https://github.com/newsdatahub/newsdatahub-news-aggregator/issues)

### Learning Resources

- **React:** [https://react.dev](https://react.dev)
- **TypeScript:** [https://www.typescriptlang.org](https://www.typescriptlang.org)
- **Express:** [https://expressjs.com](https://expressjs.com)
- **Docker:** [https://docs.docker.com](https://docs.docker.com)
- **Caching Strategies:** [Web.dev Caching Guide](https://web.dev/cache-api-quick-guide/)

---

## FAQ

### About NewsDataHub

**Q: How much does NewsDataHub cost?**

A: NewsDataHub offers a generous **free tier** with no credit card required - perfect for learning, prototyping, and small projects. For production apps with higher volume, paid plans start at affordable rates with increased quotas and features. Visit [https://newsdatahub.com](https://newsdatahub.com) for current pricing.

**Q: What's included in the free tier?**

A: The free tier includes:
- Access to news from 90+ countries
- All 50+ languages
- Full filtering capabilities (topic, political leaning, source type, etc.)
- Boolean search operators
- Generous daily API quota

Perfect for learning, small projects, and MVPs!

**Q: How fresh is the news data?**

A: Depends on your plan:
- **Free tier:** News from a few days ago
- **Paid tiers:** More recent news, with higher tiers offering near real-time updates

Check [https://newsdatahub.com](https://newsdatahub.com) for current tier details.

**Q: Can I use NewsDataHub commercially?**

A: Yes! NewsDataHub is designed for commercial use. Free tier is for development/small projects, and paid tiers are for production applications. Review terms at [https://newsdatahub.com/terms](https://newsdatahub.com/terms).

**Q: What languages are supported?**

A: NewsDataHub supports **40+ languages** including:
- English, Spanish, French, German, Italian, Portuguese
- Chinese (Simplified & Traditional), Japanese, Korean
- Arabic, Russian, Hindi, Dutch, Swedish, Turkish
- And many more!

Use the `language` parameter to filter.

---

### About This Tutorial

**Q: I'm a beginner - can I follow this?**

A: You should be comfortable with:
- Basic JavaScript/TypeScript
- React fundamentals (components, hooks, state)
- Node.js basics
- Command line usage

If you're newer, work through [React tutorial](https://react.dev/learn) first, then come back!

**Q: How long does this take?**

A:
- **Quick start** (clone & run): 5 minutes
- **Understanding concepts**: 30 minutes reading
- **Building from scratch**: 2-3 hours
- **Customization**: 30 minutes - ongoing
- **Deployment**: 10-30 minutes depending on platform

**Q: Can I use this in production?**

A: Yes! This codebase is ready with:
- Security best practices (API key on server)
- Performance optimization (caching)
- Error handling
- TypeScript for type safety
- Docker for deployment

For high-traffic use:
- Consider Redis instead of in-memory cache
- Add rate limiting
- Set up monitoring (Sentry, Datadog)
- Use CDN for static assets
- Add database for user data

**Q: Why Docker and not just Node?**

A: Docker provides:
- **Consistency:** Works same on dev, staging, production
- **Portability:** Move between cloud providers easily
- **Isolation:** No dependency conflicts
- **Scalability:** Easy to scale with orchestration

Alternatives:
- **Manual deployment:** Fine for learning
- **PaaS** (Heroku, Railway): Easier but less control
- **Serverless** (Vercel, Netlify): Great for frontend

Docker is industry standard for full-stack apps.

---

### Technical Questions

**Q: Why proxy instead of direct API calls?**

A: Direct API calls from frontend:
- Exposes API key in browser (security risk)
- Can't cache efficiently (browser cache is limited)
- CORS issues
- Can't add server-side logic
- Can't have demo mode

Backend proxy solves all of these!

**Q: Why in-memory cache instead of Redis?**

A: In-memory cache is:
- Simpler (no extra service to run)
- Faster (no network hop)
- Free (no Redis hosting cost)

For this tutorial, in-memory is perfect.

For multiple servers, use Redis for:
- Persistent cache (survives restarts)
- Shared cache across instances
- More advanced features (cache invalidation patterns)

**Q: How do I handle rate limits?**

A: This app already handles rate limits well:
1. **Caching reduces calls by 90%**
2. **Demo mode** for public showcases
3. **Smart TTL** caches historical data longer

If you still hit limits:
- Increase cache TTL
- Use demo mode for landing page
- Upgrade your NewsDataHub plan
- Implement request queuing

**Q: Can I add authentication?**

A: Yes! Add:
- **JWT authentication** for API routes
- **OAuth** for social login (Google, GitHub)
- **Database** for user accounts (PostgreSQL + Prisma)
- **Sessions** for state management

Example:
```typescript
// Protect routes
app.get('/api/news', authenticateUser, async (req, res) => {
  // Only authenticated users can access
});
```

**Q: How do I monitor API usage?**

A:
1. **NewsDataHub Dashboard:** Check your quota usage
2. **Backend logging:** Track which queries are made
3. **Cache hit rate:** Monitor cache effectiveness

```typescript
logger.info('API call', {
  query: params.q,
  cached: !!cached,
  userId: req.user?.id
});
```

Use tools like Datadog, New Relic, or simple log analysis.

---

### About the Discount Offer

**Q: Is the 50% discount real?**

A: Yes! Deploy your app, email us at support@newsdatahub.com, we verify and apply 50% off for 3 months.

**Q: Can I use demo mode for the discount?**

A: No, you must use the real NewsDataHub API with your API key. We verify that your app is making actual API calls.

**Q: What if my app doesn't work perfectly?**

A: It just needs to work and use NewsDataHub API. Minor bugs are fine - we're looking for genuine deployment effort, not perfection!

**Q: How long does verification take?**

A: Usually within 1 business day. We'll test your app and reply with confirmation.

**Q: Can I remove the "Powered by NewsDataHub" attribution after getting the discount?**

A: No, keeping the attribution is a requirement for the discount. It's a small link that helps us grow!

---

## Troubleshooting

### Common Issues

**Issue: "API key invalid"**

```bash
# Check your .env file
cat .env

# Make sure it's:
NEWSDATAHUB_API_KEY=your_actual_key_here
# NOT:
NEWSDATAHUB_API_KEY=your_api_key_here  # Placeholder
```

**Issue: "CORS errors"**

```typescript
// backend/src/config/env.ts
// Make sure frontend URL is in allowed origins
ALLOWED_ORIGINS: ['http://localhost:5173', 'http://localhost:3000']
```

**Issue: "No results returned"**

```bash
# Check if demo mode is enabled
# .env
ENABLE_DEMO_MODE=false  # Make sure it's false

# Check API key is set
echo $NEWSDATAHUB_API_KEY
```

**Issue: "Docker won't start"**

```bash
# Check if ports are in use
lsof -i :80
lsof -i :3001

# Kill processes using those ports
kill -9 <PID>

# Or change ports in docker-compose.yml
```

**Issue: "Rate limit exceeded"**

- Check NewsDataHub dashboard for quota
- Verify caching is working (`docker compose logs backend`)
- Consider increasing cache TTL
- Upgrade your plan if needed

**Issue: "Cache not working"**

```typescript
// Check logs
docker compose logs backend | grep "Cache hit"

// Should see cache hits for repeated queries
// If not, verify cacheService is imported correctly
```

---

## Conclusion

You did it!

You've built a news aggregator and learned valuable concepts:

- API proxy pattern for security
- Caching for performance and cost savings
- Docker for consistent deployment
- Boolean search for powerful queries
- Full-stack TypeScript development

### Your Next Move

1. **Deploy it** → Get 50% off NewsDataHub for 3 months
2. **Customize it** → Make it yours with unique features
3. **Share it** → Add to your portfolio, show employers
4. **Extend it** → Email alerts, user accounts, mobile app

### Get Started with NewsDataHub

Ready to build your own news application?

[Sign up free at NewsDataHub.com](https://newsdatahub.com)

No credit card required. Start building in minutes.

---

### Stay Connected

- Follow us on Twitter: [@newsdatahub](https://twitter.com/newsdatahub)
- Questions? Email: support@newsdatahub.com
- Star the repo: [GitHub](https://github.com/newsdatahub/newsdatahub-news-aggregator)
- Newsletter: Subscribe on [newsdatahub.com](https://newsdatahub.com)

---

**Built something awesome with NewsDataHub?** We'd love to see it! Email support@newsdatahub.com

---

*Keywords: news aggregator tutorial, news API tutorial, NewsDataHub, build news app, React news aggregator, Node.js news API, API proxy pattern, caching tutorial, Docker tutorial, Boolean search, news API integration, full-stack tutorial, TypeScript tutorial, news application development, API best practices*
