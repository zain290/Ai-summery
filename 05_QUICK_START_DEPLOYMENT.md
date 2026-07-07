# AI Text Summarizer - Quick Start & Deployment Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- **Node.js** 16+ installed
- **npm** or **yarn**
- **Groq API Key** (free from https://console.groq.com)

---

## Step-by-Step Setup

### 1. Create Project
```bash
npm create vite@latest ai-text-summarizer -- --template react-ts
cd ai-text-summarizer
```

### 2. Install All Dependencies
```bash
npm install
npm install -D tailwindcss postcss autoprefixer
npm install express cors axios dotenv
npm install -D @types/express @types/node ts-node typescript
npm install -D concurrently
```

### 3. Initialize Tailwind
```bash
npx tailwindcss init -p
```

### 4. Get Groq API Key
1. Go to https://console.groq.com/home
2. Sign up (free account)
3. Create API key in dashboard
4. Copy the key

### 5. Create `.env.local`
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_API_URL=http://localhost:5000/api
PORT=5000
```

### 6. Copy Files from Documentation
- Create `src/components/` folder with all component files (from 02_COMPONENTS.md)
- Create `src/services/groqAPI.ts` (from 04_FRONTEND_LOGIC.md)
- Create `src/types/index.ts` (from 02_COMPONENTS.md)
- Create `server/routes/summarize.ts` (from 03_BACKEND_API.md)
- Create `server/index.ts` (from 03_BACKEND_API.md)
- Create `src/styles/app.css` (from 04_FRONTEND_LOGIC.md)

### 7. Update package.json scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "server": "ts-node --project tsconfig.json server/index.ts",
    "dev:all": "concurrently \"npm run dev\" \"npm run server\""
  }
}
```

### 8. Run the Application
```bash
# Option A: Run frontend and backend separately
# Terminal 1:
npm run dev

# Terminal 2:
npm run server

# Option B: Run both together
npm run dev:all
```

### 9. Open Browser
```
http://localhost:5173
```

---

## Project File Structure

```
ai-text-summarizer/
├── src/
│   ├── components/
│   │   ├── TextInput.tsx
│   │   ├── SummaryOutput.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ErrorAlert.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── (other components)
│   ├── services/
│   │   └── groqAPI.ts
│   ├── types/
│   │   └── index.ts
│   ├── pages/
│   │   └── App.tsx
│   ├── styles/
│   │   └── app.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── server/
│   ├── routes/
│   │   └── summarize.ts
│   └── index.ts
├── .env.local (CREATE THIS)
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

---

## 🧪 Testing

### Test the API Endpoint
```bash
curl -X POST http://localhost:5000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Artificial intelligence is transforming industries around the world. From healthcare to finance, AI applications are improving efficiency and decision-making. Machine learning models can analyze vast amounts of data quickly, identifying patterns that humans might miss. However, the adoption of AI also raises important questions about data privacy, job displacement, and ethical considerations. Organizations must balance the benefits of AI with responsible implementation practices.",
    "bulletCount": 5
  }'
```

### Expected Response
```json
{
  "success": true,
  "summary": [
    "Artificial intelligence is transforming industries globally...",
    "Machine learning models analyze data quickly...",
    "AI adoption raises concerns about privacy and ethics...",
    ...
  ],
  "originalLength": 85,
  "summaryLength": 42,
  "processingTime": 1523,
  "tokenUsage": {
    "promptTokens": 156,
    "completionTokens": 89,
    "totalTokens": 245
  }
}
```

---

## 📱 Troubleshooting

### Issue: "VITE_GROQ_API_KEY not found"
**Solution**: Create `.env.local` and add your API key:
```env
VITE_GROQ_API_KEY=your_key_here
```

### Issue: "Backend server not available"
**Solution**: Make sure backend is running:
```bash
npm run server
# Should show: ✅ Server running on http://localhost:5000
```

### Issue: "Invalid Groq API key"
**Solution**: Check your API key at https://console.groq.com/home
- Verify key is correct
- Check it hasn't expired
- Try creating a new key

### Issue: CORS errors
**Solution**: Backend should have CORS enabled:
```typescript
import cors from 'cors';
app.use(cors());
```

### Issue: "Text exceeds maximum length"
**Solution**: Keep text under 50,000 characters. For longer texts, implement pagination.

### Issue: Rate limit (429 error)
**Solution**: 
- Free tier: 30 requests/minute
- Wait 1-2 minutes before retrying
- Consider implementing request queuing

---

## 🌐 Deployment Options

### Option 1: Deploy on Vercel (Recommended)

**Frontend + Backend on Vercel:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

**vercel.json** configuration:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_GROQ_API_KEY": "@groq-api-key",
    "VITE_API_URL": "@api-url"
  }
}
```

Set environment variables in Vercel dashboard:
- `VITE_GROQ_API_KEY` → Your Groq API key
- `VITE_API_URL` → Your API endpoint

---

### Option 2: Deploy on Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set VITE_GROQ_API_KEY=your_key_here

# Deploy
git push heroku main
```

**Procfile**:
```
web: npm run server
```

---

### Option 3: Deploy on Railway

1. Connect GitHub repo to Railway
2. Add environment variables in dashboard
3. Set start command: `npm run server`
4. Deploy!

---

### Option 4: Deploy on Render

```yaml
# render.yaml
services:
  - type: web
    name: ai-text-summarizer
    runtime: node
    buildCommand: "npm install && npm run build"
    startCommand: "npm run server"
    envVars:
      - key: VITE_GROQ_API_KEY
        scope: build
        sync: false
```

---

## 📊 Environment Variables Checklist

### Local Development (.env.local)
```env
VITE_GROQ_API_KEY=sk_... (from https://console.groq.com)
VITE_API_URL=http://localhost:5000/api
PORT=5000
```

### Production (Set in deployment platform)
```
VITE_GROQ_API_KEY=sk_...
VITE_API_URL=https://your-domain.com/api
NODE_ENV=production
```

---

## 🔒 Security Best Practices

✅ **Do:**
- Store API keys in `.env.local` (local) or platform secrets (production)
- Use HTTPS in production
- Implement rate limiting
- Validate user input on both client and server
- Keep dependencies updated

❌ **Don't:**
- Commit `.env.local` to git
- Expose API keys in frontend code
- Use API keys in client-side requests directly
- Skip input validation

---

## 🎯 Features Implemented

- ✅ Single-page React app
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Groq Cloud API integration
- ✅ Error handling and validation
- ✅ Loading states
- ✅ Responsive design
- ✅ Character counting
- ✅ Processing time display
- ✅ Compression ratio calculation

---

## 🚀 Next Steps for Enhancement

### Easy Additions:
1. **Copy to clipboard** - Add button to copy summary
2. **Export as PDF** - Generate PDF with summary
3. **Summary history** - Store past summaries in localStorage
4. **Dark mode** - Toggle between light/dark theme
5. **Word count** - Show detailed word statistics

### Medium Additions:
1. **Multiple models** - Let user choose between Groq models
2. **Adjust bullet count** - Slider to change summary length
3. **Different formats** - Summary, paragraph, or headline formats
4. **Language support** - Summarize in different languages
5. **File upload** - Accept .txt or .pdf files

### Advanced Features:
1. **User authentication** - Save summaries to user account
2. **API usage dashboard** - Track API calls and costs
3. **Batch processing** - Summarize multiple texts
4. **Custom prompts** - User-defined summarization style
5. **Integration with other services** - Send summaries via email

---

## 📚 Documentation Links

- **Groq Documentation**: https://console.groq.com/docs
- **Available Models**: https://console.groq.com/docs/models
- **API Rate Limits**: https://console.groq.com/docs/rate-limits
- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com

---

## 💬 Getting Help

### Check these first:
1. **Error logs** - Check browser console and server terminal
2. **API key** - Verify at https://console.groq.com/home
3. **Server running** - Make sure `npm run server` is active
4. **Port conflicts** - Ensure port 5000 and 5173 are available

### Debugging commands:
```bash
# Check if port is in use
lsof -i :5000    # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process using port
kill -9 <PID>     # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

---

## 📄 License

This project is open source and available under the MIT License.

---

## Summary

You now have a fully functional AI Text Summarizer that:
- Takes user input and processes it with Groq API
- Returns concise bullet-point summaries
- Displays processing metrics
- Handles errors gracefully
- Works on mobile and desktop
- Deploys easily to production

**Estimated time to complete**: 15-20 minutes

**Total code**: ~500 lines (excluding node_modules)

Enjoy building! 🎉

