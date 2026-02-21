# BudgetFlow - Personal Expense Tracker 💰

A beautiful, full-featured expense tracking application with user authentication, category budgets, analytics charts, and CSV export capabilities.

![BudgetFlow](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)

## ✨ Features

- ✅ **User Authentication** - Secure login and signup
- ✅ **Expense Management** - Add, edit, and delete expenses
- ✅ **Category Organization** - Organize expenses into customizable categories
- ✅ **Budget Tracking** - Set monthly budgets per category with alerts
- ✅ **Visual Analytics** - Interactive pie charts and 6-month trend graphs
- ✅ **CSV Export** - Download your expense data
- ✅ **Responsive Design** - Beautiful UI that works on all devices
- ✅ **Real-time Stats** - Track totals, monthly spending, and transactions

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

## 📦 Deploy to Vercel

### Easy Method: Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

Your app will be live at `https://your-project-name.vercel.app` 🎉

### Alternative: Vercel CLI

```bash
npm i -g vercel
vercel
```

## 🗂️ Project Structure

```
budgetflow-app/
├── components/
│   └── ExpenseTracker.jsx    # Main app component
├── pages/
│   ├── _app.js               # App wrapper
│   ├── index.js              # Home page
│   └── api/
│       └── expenses.js       # API routes
├── styles/
│   └── globals.css           # Global styles
├── package.json              # Dependencies
├── next.config.js            # Next.js config
└── README.md                 # This file
```

## 🎨 Tech Stack

- **Frontend**: Next.js 14, React 18
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: Custom CSS-in-JS
- **Storage**: LocalStorage (ready for database)

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env.local` file for database connection:

```env
DATABASE_URL="your-database-url"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-secret-key"
```

## 📊 Adding a Real Database

The app currently uses localStorage. To add a database:

### Option 1: Vercel Postgres

1. In Vercel dashboard → Storage → Create Database
2. Install Prisma:
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```
3. Update schema and migrate
4. Connect API routes to database

### Option 2: Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Install client:
   ```bash
   npm install @supabase/supabase-js
   ```
3. Update hooks to use Supabase

## 🛠️ Customization

### Categories

Edit the `categories` array in `components/ExpenseTracker.jsx`:

```javascript
const [categories, setCategories] = useState([
  'Food & Dining',
  'Transportation',
  'Your Custom Category',
  // Add more...
]);
```

### Colors & Theme

Customize colors in the component by updating:
- Gradient backgrounds
- Button colors
- Chart colors array

## 📱 Features Roadmap

- [ ] Receipt image upload with OCR
- [ ] Recurring expenses
- [ ] Multi-currency support
- [ ] Expense sharing
- [ ] Mobile app (React Native)
- [ ] Bank integration
- [ ] Tax reporting

## 🔒 Security Notes

**⚠️ For Production:**

1. Current authentication is mock (localStorage)
2. Implement real authentication (NextAuth.js)
3. Use a secure database
4. Add input validation
5. Implement rate limiting
6. Enable HTTPS

## 🐛 Troubleshooting

### Build Errors

**Error: Can't find pages directory**
- Make sure `pages` folder exists at root level
- Verify `pages/index.js` exists

**Module not found errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Vercel deployment fails**
- Check folder structure matches this README
- Ensure all files are committed to GitHub
- Review build logs in Vercel dashboard

## 📝 License

MIT License - Free to use for personal or commercial projects!

## 💬 Support

Need help?
1. Check the documentation
2. Review error messages carefully
3. Ensure folder structure is correct
4. Verify all dependencies are installed

---

Built with ❤️ using Next.js and React

**Ready to deploy? Push to GitHub and connect to Vercel!** 🚀
