# its vibe coded nothing else bro..
# Gen-Z Slang Quiz 🎉

A mobile-first web application that teaches Gen-Z slang through interactive pronunciation and meaning quizzes. Master modern slang with customizable quizzes, real-time feedback, and progress tracking.

## 🌟 Features

### Quiz Types
- **Pronunciation Quiz**: Listen to audio pronunciation and identify the correct meaning
- **Meaning Quiz**: Read a slang term and select the correct definition from multiple choices

### Customization
- **Category Selection**: Choose from 5 slang categories:
  - TikTok & Social Media Slang
  - Gaming & Streaming Terms
  - Fashion & Style
  - Emotions & Reactions
  - General/Everyday Slang
- **Quiz Length Options**: Select 10, 20, 30, or 100 questions per quiz
- **Mix & Match**: Combine multiple categories for a diverse learning experience

### Smart Features
- **Question Shuffling**: Questions are randomly selected to ensure variety
- **Randomized Answers**: Multiple-choice options are shuffled each question to prevent pattern recognition
- **Real-time Feedback**: Instant feedback on correct/incorrect answers
- **Progress Tracking**: Dashboard shows accuracy percentage, correct answers, and current streaks

### User Experience
- **Mobile-First Design**: Fully responsive layout optimized for all screen sizes
- **User Authentication**: Secure sign-in with progress persistence across sessions
- **Progress Dashboard**: Track your learning journey with detailed statistics
- **Streak Counter**: Maintain and monitor your consecutive correct answer streaks

## 📊 Database

The app includes **124 unique Gen-Z slang terms** organized into 5 categories:

| Category | Count | Examples |
|----------|-------|----------|
| TikTok & Social Media | 25 | Skibidi, Sigma, Gyatt, Slay, Bussin |
| Gaming & Streaming | 25 | Clutch, Noob, Pwned, Carry, Toxic |
| Fashion & Style | 20 | Fit, Drip, Flex, Cheugy, Boujee |
| Emotions & Reactions | 20 | Shook, Gagged, Pressed, Salty, Hyped |
| General/Everyday | 34 | Finna, Bruh, Homie, Bestie, Lit |

Each term includes:
- **Term**: The slang word or phrase
- **Meaning**: Clear, concise definition
- **Pronunciation**: Phonetic guide for proper pronunciation
- **Example**: Real-world usage example
- **Category**: Classification for targeted learning

## 🚀 Getting Started

### Prerequisites
- Node.js 22.13.0 or higher
- pnpm (or npm/yarn)
- MySQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd genz_slang_quiz
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Create a .env file with the following:
   DATABASE_URL=mysql://user:password@localhost:3306/genz_slang_quiz
   JWT_SECRET=your_jwt_secret_key
   VITE_APP_ID=your_app_id
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
   ```

4. **Initialize the database**
   ```bash
   pnpm db:push
   ```

5. **Seed the database with slang terms**
   ```bash
   node seed-db.js
   node seed-expanded.js
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

The app will be available at `http://localhost:3000`

## 📱 How to Use

### Taking a Quiz

1. **Sign In**: Click "Sign In to Start" and authenticate with your account
2. **Customize Your Quiz**: 
   - Select one or more categories
   - Choose your preferred quiz length (10, 20, 30, or 100 questions)
   - Click "Start Quiz"
3. **Choose Quiz Type**:
   - **Pronunciation**: Listen to audio and identify meaning
   - **Meaning**: Read the term and select the correct definition
4. **Answer Questions**: Select your answer from the shuffled options
5. **Get Feedback**: See if you're correct and view the right answer
6. **View Results**: Check your final score, accuracy percentage, and streak

### Tracking Progress

Visit your **Dashboard** to see:
- Total quizzes taken
- Overall accuracy percentage
- Pronunciation quiz score
- Meaning quiz score
- Current streak count
- Quiz history

## 🏗️ Architecture

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **tRPC** for type-safe API calls
- **Wouter** for routing
- **Shadcn/UI** components for consistent UI

### Backend
- **Express 4** server
- **tRPC 11** for RPC procedures
- **Drizzle ORM** for database management
- **MySQL** database

### Key Files
```
client/
  src/
    pages/
      Home.tsx           # Landing page
      QuizSetup.tsx      # Quiz customization
      Quiz.tsx           # Main quiz interface
      Dashboard.tsx      # Progress tracking
    components/          # Reusable UI components
    lib/trpc.ts          # tRPC client setup

server/
  db.ts                  # Database helpers
  routers.ts             # tRPC procedures
  quiz.test.ts           # Unit tests

drizzle/
  schema.ts              # Database schema
  migrations/            # Database migrations
```

## 🔧 Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
```

### Database Management

**Push schema changes:**
```bash
pnpm db:push
```

**Generate migrations:**
```bash
pnpm db:generate
```

**View database:**
```bash
pnpm db:studio
```

## 📝 API Endpoints

### Public Endpoints
- `GET /api/trpc/slang.getAll` - Get all slang terms
- `GET /api/trpc/slang.getCategories` - Get available categories
- `GET /api/trpc/slang.getQuizTerms` - Get quiz terms with filters
- `GET /api/trpc/quiz.getQuizLengths` - Get available quiz lengths

### Protected Endpoints (Requires Authentication)
- `POST /api/trpc/quiz.recordAnswer` - Record quiz answer
- `GET /api/trpc/quiz.getUserStats` - Get user statistics
- `GET /api/trpc/quiz.getHistory` - Get quiz history

## 🎨 Customization

### Adding New Slang Terms

Edit `seed-expanded.js` and add terms to the `expandedSlangData` array:

```javascript
{
  term: "Your Slang",
  meaning: "Definition here",
  pronunciation: "PRON-un-see-ay-shun",
  category: "general", // or tiktok, gaming, fashion, emotions
  example: "Usage example in a sentence"
}
```

Then run:
```bash
node seed-expanded.js
```

### Adding New Categories

1. Update `drizzle/schema.ts` - Add to `mysqlEnum` in `slangTerms` table
2. Update `SLANG_CATEGORIES` constant
3. Run `pnpm db:push`
4. Update seed scripts with new category terms

## 📊 Performance

- **Mobile Optimized**: Responsive design works on all screen sizes
- **Fast Load Times**: Optimized assets and lazy loading
- **Efficient Queries**: Database queries use proper indexing
- **Real-time Feedback**: Instant response to user interactions

## 🔒 Security

- **User Authentication**: Manus OAuth integration
- **Session Management**: Secure JWT-based sessions
- **Database Security**: Parameterized queries prevent SQL injection
- **Input Validation**: All user inputs validated with Zod schemas

## 📈 Future Enhancements

- [ ] Difficulty levels (Easy/Medium/Hard)
- [ ] Global leaderboard system
- [ ] Streak bonuses and achievements
- [ ] Spaced repetition algorithm
- [ ] Audio recording for pronunciation practice
- [ ] Social sharing of quiz results
- [ ] Offline mode support
- [ ] Dark mode theme
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Gen-Z slang data compiled from multiple sources
- Built with React, TypeScript, and Tailwind CSS
- Powered by Manus platform

## 📞 Support

For issues, questions, or suggestions, please open an issue on the repository or contact the development team.

---

**Happy Learning! Master Gen-Z slang and stay up with the trends! 🎯**
