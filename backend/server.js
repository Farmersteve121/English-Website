// backend/server.js
const cors = require('cors');

const app = express();

// 明确允许的前端来源
const allowedOrigins = [
  'https://farmersteve121.github.io',
  'http://localhost:5173' // 方便本地开发
];

app.use(cors({
  origin: function (origin, callback) {
    // 允许没有来源的请求（如 curl、Postman）或允许的来源
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // 允许携带凭证（如 Cookie）
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 处理预检请求 (OPTIONS)
app.options('*', cors());

// 解析 JSON 请求体
app.use(express.json());

// backend/server.js
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Memo App Backend is running',
    timestamp: new Date().toISOString()
  });
});