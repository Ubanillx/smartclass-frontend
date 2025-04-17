// 确保数组不为空的辅助函数
function ensureNonEmpty<T>(arr: T[], defaultItem?: T): T[] {
  if (arr.length === 0 && defaultItem) {
    return [defaultItem];
  }
  return arr;
}

// 模拟的推荐搜索词
export const mockRecommendations: string[] = [
    '英语口语', '数学思维', '语文阅读', '物理实验', '化学基础',
    '历史人物', '地理知识', '生物科学', '编程入门', '美术技巧',
    '音乐欣赏', '体育锻炼', '作文技巧', '阅读理解', '课外知识',
    '学习方法', '记忆技巧', '考试技巧', '思维导图', '课程表',
    '古诗词', '文言文', '数学竞赛', '英语听力', '口语练习',
    '物理定律', '化学方程式', '生物结构', '地理地图', '历史事件',
    '政治理论', '奥数题', '科学实验', '阅读笔记', '课堂互动',
    '书法练习', '演讲技巧', '写作素材', '语法知识', '单词记忆'
];

// 模拟的搜索结果
export const mockSearchResults = (query: string): string[] => {
    // 为了更好的演示效果，放宽匹配条件
    const matchedRecommendation = mockRecommendations.find(rec => 
        rec.includes(query) || query.includes(rec)
    );
    
    if (!matchedRecommendation) {
        return [];
    }

    // 返回相关的搜索结果
    return [
        `${matchedRecommendation}课程`,
        `${matchedRecommendation}学习方法`,
        `${matchedRecommendation}练习题`,
        `${matchedRecommendation}经典案例`
    ];
};

// 公告接口
export interface Notice {
  id: number;
  title: string;
  date: string;
  content: string;
}

// 课程接口
export interface Course {
  id: number;
  title: string;
  brief: string;
  cover: string;
  tag: string;
  tagColor: string;
  level: string;
  duration: number;
  studentsCount: number;
  subject?: string; // 添加学科字段
}

// 热门课程数据
export const mockPopularCourses: Course[] = [
  // 课程页面推荐的课程
  {
    id: 1,
    title: '高一数学思维训练',
    brief: '培养孩子的数学思维能力，提升解决问题的能力',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/f8b3549a57984426bd563291f081f9bf.png',
    tag: '精选',
    tagColor: '#ff8c00',
    level: '中级',
    duration: 35,
    studentsCount: 2980,
    subject: '数学'
  },
  {
    id: 2,
    title: '初三物理实践课',
    brief: '通过有趣的实验激发学习兴趣，理解物理现象背后的原理',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/65e2cbeb958c47c4be3dcf06aa00057a.png',
    tag: '入门',
    tagColor: '#07c160',
    level: '初级',
    duration: 30,
    studentsCount: 1580,
    subject: '物理'
  },
  {
    id: 3,
    title: '初三化学实验室探索',
    brief: '动手做实验，探索科学奥秘',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/88e4f754e8d2413ea55a0c1c7d7f7b46.png',
    tag: '精品',
    tagColor: '#ff8c00',
    level: '初级',
    duration: 40,
    studentsCount: 567,
    subject: '科学'
  },
  // 英语课程
  {
    id: 4,
    title: '商务英语口语进阶',
    brief: '掌握商务场景下的专业英语表达，提升职场竞争力',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/e5a7ca50d81a4b4bb7cd3fb4e4c1d7e5.png',
    tag: '热门',
    tagColor: '#ee0a24',
    level: '中级',
    duration: 45,
    studentsCount: 1280,
    subject: '英语'
  },
  {
    id: 5,
    title: '雅思写作高分技巧',
    brief: '针对雅思写作常见题型的分析与解答，助你轻松突破6.5分',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/b71e5c4f1a9b41168bd7c4e79b04c04f.png',
    tag: '推荐',
    tagColor: '#1989fa',
    level: '高级',
    duration: 60,
    studentsCount: 968,
    subject: '英语'
  },
  // 数学课程
  {
    id: 6,
    title: '高中数学核心知识点解析',
    brief: '系统梳理高中数学必考知识点，解题思路与技巧',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/7f3e5c46d9874a8a9c2c4f08b6d0f2e7.png',
    tag: '精品',
    tagColor: '#ff8c00',
    level: '高级',
    duration: 50,
    studentsCount: 1876,
    subject: '数学'
  },
  {
    id: 7,
    title: '初中数学几何证明题专项突破',
    brief: '掌握几何证明题的解题技巧和思路，培养数学思维',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/23a4f89bd0c94b8c9e8d6f9a0d1c7b5e.png',
    tag: '推荐',
    tagColor: '#1989fa',
    level: '中级',
    duration: 40,
    studentsCount: 1355,
    subject: '数学'
  },
  {
    id: 8,
    title: '小学奥数思维训练',
    brief: '培养孩子的数学思维能力，提升解决问题的能力',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/f8b3549a57984426bd563291f081f9bf.png',
    tag: '入门',
    tagColor: '#07c160',
    level: '初级',
    duration: 35,
    studentsCount: 2980,
    subject: '数学'
  },
  // 语文课程
  {
    id: 9,
    title: '高考作文写作技巧与范例',
    brief: '掌握高考作文写作技巧，了解评分标准，提供优秀范文赏析',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/a5c6d7e8f9b0a1c2d3e4f5a6b7c8d9e0.png',
    tag: '热门',
    tagColor: '#ee0a24',
    level: '高级',
    duration: 55,
    studentsCount: 2150,
    subject: '语文'
  },
  {
    id: 10,
    title: '初中文言文精讲',
    brief: '详细讲解初中必考文言文，掌握常见实词虚词用法',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p.png',
    tag: '精品',
    tagColor: '#ff8c00',
    level: '中级',
    duration: 45,
    studentsCount: 1680,
    subject: '语文'
  },
  {
    id: 11,
    title: '小学生阅读能力提升',
    brief: '培养良好的阅读习惯，提升阅读理解能力和阅读速度',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/p1o2n3m4l5k6j7i8h9g0f1e2d3c4b5a6.png',
    tag: '推荐',
    tagColor: '#1989fa',
    level: '初级',
    duration: 30,
    studentsCount: 2460,
    subject: '语文'
  },
  // 物理课程
  {
    id: 12,
    title: '高中物理力学题型解析',
    brief: '系统讲解力学中的重点难点，掌握公式推导与计算技巧',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/f8b3549a57984426bd563291f081f9bf.png',
    tag: '精品',
    tagColor: '#ff8c00',
    level: '高级',
    duration: 60,
    studentsCount: 1120,
    subject: '物理'
  },
  {
    id: 13,
    title: '初中物理电学基础',
    brief: '通过实验和动画演示，轻松理解电学基本概念和定律',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/65e2cbeb958c47c4be3dcf06aa00057a.png',
    tag: '推荐',
    tagColor: '#1989fa',
    level: '中级',
    duration: 40,
    studentsCount: 950,
    subject: '物理'
  },
  {
    id: 14,
    title: '趣味物理实验课',
    brief: '通过有趣的实验激发学习兴趣，理解物理现象背后的原理',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/88e4f754e8d2413ea55a0c1c7d7f7b46.png',
    tag: '入门',
    tagColor: '#07c160',
    level: '初级',
    duration: 30,
    studentsCount: 1580,
    subject: '物理'
  },
  // 化学课程
  {
    id: 15,
    title: '高中有机化学系统讲解',
    brief: '梳理有机化学知识体系，掌握常见反应机理和解题思路',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/e5a7ca50d81a4b4bb7cd3fb4e4c1d7e5.png',
    tag: '精品',
    tagColor: '#ff8c00',
    level: '高级',
    duration: 55,
    studentsCount: 870,
    subject: '化学'
  },
  {
    id: 16,
    title: '初中化学方程式专项训练',
    brief: '系统掌握化学方程式的书写与配平，提高计算能力',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/b71e5c4f1a9b41168bd7c4e79b04c04f.png',
    tag: '推荐',
    tagColor: '#1989fa',
    level: '中级',
    duration: 35,
    studentsCount: 1050,
    subject: '化学'
  },
  {
    id: 17,
    title: '化学实验安全与基本操作',
    brief: '学习化学实验的基本操作技能和安全注意事项',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/88e4f754e8d2413ea55a0c1c7d7f7b46.png',
    tag: '入门',
    tagColor: '#07c160',
    level: '初级',
    duration: 25,
    studentsCount: 1320,
    subject: '化学'
  },
  // 生物课程
  {
    id: 18,
    title: '高中生物遗传学精讲',
    brief: '深入讲解孟德尔遗传定律与现代遗传学理论，解析经典题型',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/e5a7ca50d81a4b4bb7cd3fb4e4c1d7e5.png',
    tag: '精品',
    tagColor: '#ff8c00',
    level: '高级',
    duration: 50,
    studentsCount: 920,
    subject: '生物'
  },
  {
    id: 19,
    title: '初中生物细胞与人体系统',
    brief: '通过图解和动画，了解细胞结构与人体各大系统的功能',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/b71e5c4f1a9b41168bd7c4e79b04c04f.png',
    tag: '推荐',
    tagColor: '#1989fa',
    level: '中级',
    duration: 40,
    studentsCount: 880,
    subject: '生物'
  },
  {
    id: 20,
    title: '趣味生物学探秘',
    brief: '通过有趣的案例和实验，激发对生物学的兴趣和热爱',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/88e4f754e8d2413ea55a0c1c7d7f7b46.png',
    tag: '入门',
    tagColor: '#07c160',
    level: '初级',
    duration: 30,
    studentsCount: 1450,
    subject: '生物'
  }
];

// 课程主题分类
export interface CourseCategory {
  id: number;
  name: string;
  icon: string;
  courses: number[]; // 该分类下的课程ID
}

// 课程分类数据
export const courseCategories: CourseCategory[] = [
  {
    id: 1,
    name: '语文',
    icon: 'bookmark-o',
    courses: [9, 10, 11]
  },
  {
    id: 2,
    name: '数学',
    icon: 'chart-trending-o',
    courses: [6, 7, 8]
  },
  {
    id: 3,
    name: '英语',
    icon: 'chat-o',
    courses: [4, 5]
  },
  {
    id: 4,
    name: '物理',
    icon: 'bulb-o',
    courses: [12, 13, 14]
  },
  {
    id: 5,
    name: '化学',
    icon: 'filter-o',
    courses: [15, 16, 17]
  },
  {
    id: 6,
    name: '生物',
    icon: 'flower-o',
    courses: [18, 19, 20]
  }
];

// 按学科获取课程
export const getCoursesBySubject = (subject: string): Course[] => {
  return mockPopularCourses.filter(course => course.subject === subject);
};

// 按分类ID获取课程
export const getCoursesByCategory = (categoryId: number): Course[] => {
  const category = courseCategories.find(cat => cat.id === categoryId);
  
  if (!category) return [];
  
  return category.courses.map(courseId => 
    mockPopularCourses.find(course => course.id === courseId)
  ).filter((course): course is Course => course !== undefined);
};

// 按难度等级获取课程
export const getCoursesByLevel = (level: string): Course[] => {
  return mockPopularCourses.filter(course => course.level === level);
};

// 模拟获取热门课程数据
export const fetchMockPopularCourses = (): Promise<Course[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockPopularCourses]);
    }, 500);
  });
};

// 模拟获取课程详情
export const fetchCourseDetail = (id: number): Promise<Course> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const course = mockPopularCourses.find(c => c.id === id);
      // 如果找不到课程，返回第一个作为默认值
      if (course) {
        resolve(course);
      } else {
        resolve(mockPopularCourses[0]);
      }
    }, 800);
  });
};

// 模拟获取课程分类
export const fetchCourseCategories = (): Promise<CourseCategory[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...courseCategories]);
    }, 800);
  });
};

// 文章接口
export interface Article {
  id: number;
  title: string;
  brief: string;
  cover: string;
  category: string;
  readTime: number;
  difficulty: string;
  content: string;
  publishDate?: string;
  viewCount?: number;
  likeCount?: number;
}

// 美文数据
export const mockArticles: Article[] = [
  {
    id: 1,
    title: 'The Power of Positive Thinking',
    brief: 'How optimism can change your life and lead to success...',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/a5c6d7e8f9b0a1c2d3e4f5a6b7c8d9e0.png',
    category: '励志',
    readTime: 5,
    difficulty: '初级',
    content: `<p>Positive thinking is more than just a catchphrase. It changes the way we behave. And I firmly believe that when I am positive, it not only makes me better, but it also makes those around me better.</p>
              <p>I think that's something that we all have within us. When we're positive, it has an impact on our health, our relationships, and our careers. Here are some ways to cultivate a more positive mindset:</p>
              <p><strong>1. Start the day with positive affirmations.</strong> How you start your morning sets the tone for the rest of the day. Instead of focusing on how tired you are, try thinking of something positive.</p>
              <p><strong>2. Focus on the good things, however small.</strong> When challenges occur, focus on the benefits, no matter how slight or unimportant they seem.</p>
              <p><strong>3. Find humor in bad situations.</strong> Allow yourself to experience humor in even the darkest or most trying situations. Remind yourself that this situation will probably make for a good story later.</p>
              <p><strong>4. Turn failures into lessons.</strong> You aren't perfect. You're going to make mistakes and experience failure in multiple contexts, at multiple jobs, and with multiple people. Instead of focusing on how you failed, think about what you're going to do next time.</p>
              <p><strong>5. Practice gratitude.</strong> Gratitude has been proven to reduce stress, improve self-esteem, and foster resilience even in very difficult times.</p>
              <p>Remember, positive thinking isn't about burying your head in the sand and ignoring life's less pleasant situations. It's about approaching the good and the bad in life with the expectation that things will go well.</p>`,
    publishDate: '2024-03-15T10:30:00Z',
    viewCount: 128,
    likeCount: 42,
  },
  {
    id: 2,
    title: 'A Journey Through Ancient Rome',
    brief: 'Exploring the history and legacy of the Roman Empire...',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p.png',
    category: '历史',
    readTime: 8,
    difficulty: '中级',
    content: `<p>The Roman Empire stands as one of the most influential civilizations in world history. At its height, it encompassed vast territories spanning from Britain to Egypt, from Spain to Mesopotamia.</p>
              <p>Founded traditionally in 753 BCE, Rome grew from a small settlement on the Italian Peninsula to become the center of one of the largest empires in the ancient world. The Roman legacy includes remarkable achievements in governance, law, architecture, engineering, language, and culture that continue to shape our world today.</p>
              <p>This republican system influenced many modern governments, including the United States, which adopted elements like separation of powers and checks and balances.</p>
              <p>Roman architecture and engineering achievements were equally impressive. The Romans perfected the use of concrete, arches, and domes, enabling them to construct massive and durable structures.</p>`,
    publishDate: '2024-03-14T14:45:00Z',
    viewCount: 95,
    likeCount: 31,
  },
  {
    id: 3,
    title: 'The Future of Artificial Intelligence',
    brief: 'How AI is transforming our world and what lies ahead...',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/p1o2n3m4l5k6j7i8h9g0f1e2d3c4b5a6.png',
    category: '科技',
    readTime: 6,
    difficulty: '高级',
    content: `<p>Artificial Intelligence (AI) is rapidly transforming our world in ways that were once confined to science fiction. From virtual assistants and recommendation systems to autonomous vehicles and advanced medical diagnostics, AI technologies are becoming increasingly integrated into our daily lives and professional environments.</p>
              <p>At its core, AI refers to computer systems designed to perform tasks that typically require human intelligence. These include learning from experience, recognizing patterns, understanding language, making decisions, and solving problems.</p>
              <p>The impact of AI extends across numerous sectors including healthcare, transportation, finance, and education.</p>`,
    publishDate: '2024-03-13T09:15:00Z',
    viewCount: 156,
    likeCount: 53,
  },
  // 添加中文科普文章 - 天文学
  {
    id: 4,
    title: '宇宙的奥秘：黑洞是什么？',
    brief: '探索宇宙中最神秘的天体现象之一...',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/a5c6d7e8f9b0a1c2d3e4f5a6b7c8d9e0.png',
    category: '天文',
    readTime: 7,
    difficulty: '中级',
    content: `<p>黑洞是时空中的一个区域，那里的引力如此强大，以至于没有任何东西，甚至光都无法逃脱。黑洞的形成通常源于大质量恒星的死亡。</p>
              <p>当一颗质量是太阳至少20倍的恒星耗尽燃料时，它会崩塌到自身的引力之下，形成一个奇点——一个密度无限大、体积无限小的点。这个奇点周围的区域就是我们所说的黑洞。</p>
              <p>黑洞的边界被称为"事件视界"，一旦越过这个边界，就无法返回。即使是光也无法从黑洞内部逃脱，这就是为什么我们无法直接"看到"黑洞的原因。</p>
              <p>尽管如此，科学家们仍然可以通过观察黑洞对周围物质和光线的影响来研究它们。2019年，人类首次拍摄到了黑洞的"照片"——确切地说，是M87星系中心超大质量黑洞周围吸积盘的图像。</p>
              <p>黑洞的研究对于理解宇宙的基本规律至关重要，它们是时空扭曲最极端的例子，是检验爱因斯坦广义相对论的理想实验室。</p>`,
    publishDate: '2024-03-10T13:25:00Z',
    viewCount: 187,
    likeCount: 65,
  },
  // 添加中文科普文章 - 生物学
  {
    id: 5,
    title: '微生物世界：肉眼看不见的生命',
    brief: '探索生活在我们周围却肉眼不可见的微小生物...',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p.png',
    category: '生物',
    readTime: 6,
    difficulty: '初级',
    content: `<p>微生物是肉眼无法直接观察到的微小生物，包括细菌、病毒、真菌和原生生物等。尽管它们极其微小，但在数量上它们是地球上最主要的生命形式，也是地球上最早的生命形式之一。</p>
              <p>微生物无处不在——它们存在于土壤、水、空气中，也存在于我们的身体内外。人体内的微生物数量甚至超过了人体细胞的数量，形成了被称为"微生物组"的复杂生态系统。</p>
              <p>许多微生物对人类和环境非常有益。例如，肠道内的某些细菌帮助消化食物，产生维生素，保护我们免受有害细菌的侵害。在自然界中，微生物在分解有机物质、循环营养物质和维持生态系统平衡方面发挥着关键作用。</p>
              <p>当然，某些微生物也可能导致疾病。病原体是一类能引起感染和疾病的微生物，如导致流感的流感病毒和引起肺炎的肺炎链球菌等。</p>
              <p>微生物学的研究对医学、农业、环保和生物技术等领域有着深远的影响。抗生素、疫苗、发酵食品和生物燃料等创新都源于对微生物世界的探索和理解。</p>`,
    publishDate: '2024-03-08T09:40:00Z',
    viewCount: 142,
    likeCount: 48,
  },
  // 添加英文科普文章 - 环境
  {
    id: 6,
    title: 'The Hidden Life of Coral Reefs',
    brief: 'Discovering the complex ecosystems beneath the waves...',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/p1o2n3m4l5k6j7i8h9g0f1e2d3c4b5a6.png',
    category: '环境',
    readTime: 8,
    difficulty: '中级',
    content: `<p>Coral reefs are often called the "rainforests of the sea" due to their incredible biodiversity and complex ecosystems. Though they cover less than 1% of the ocean floor, they are home to more than 25% of all marine species.</p>
              <p>Corals themselves are fascinating creatures. What appears to be a single organism is actually a colony of thousands of tiny animals called polyps. These polyps have a symbiotic relationship with photosynthetic algae called zooxanthellae, which live within the coral tissue and provide nutrients through photosynthesis.</p>
              <p>Reef ecosystems support an extraordinary variety of life, from microscopic plankton to large predators like sharks. They provide food, shelter, and breeding grounds for countless species, creating intricate food webs and ecological relationships.</p>
              <p>Beyond their ecological importance, coral reefs provide valuable services to humans. They act as natural barriers that protect coastlines from storms and erosion, support fisheries that feed millions of people, and contain compounds with potential medical applications.</p>
              <p>Unfortunately, coral reefs face severe threats from climate change, ocean acidification, pollution, and destructive fishing practices. Rising sea temperatures cause coral bleaching—a stress response where corals expel their zooxanthellae, often leading to coral death if the stress persists.</p>
              <p>Conservation efforts worldwide aim to protect these valuable ecosystems through marine protected areas, sustainable fishing practices, climate action, and innovative restoration techniques. Understanding and preserving coral reefs is crucial for maintaining ocean health and biodiversity.</p>`,
    publishDate: '2024-03-05T11:20:00Z',
    viewCount: 119,
    likeCount: 37,
  },
  // 添加英文科普文章 - 物理
  {
    id: 7,
    title: 'Quantum Computing: The Next Technological Revolution',
    brief: 'Understanding the principles and potential of quantum computers...',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/a5c6d7e8f9b0a1c2d3e4f5a6b7c8d9e0.png',
    category: '物理',
    readTime: 9,
    difficulty: '高级',
    content: `<p>Quantum computing represents a paradigm shift in computational technology, leveraging the principles of quantum mechanics to process information in ways that classical computers cannot.</p>
              <p>While classical computers use bits that exist in one of two states (0 or 1), quantum computers use quantum bits, or qubits, which can exist in multiple states simultaneously due to a property called superposition. This allows quantum computers to explore multiple solutions to a problem at once.</p>
              <p>Another key quantum property is entanglement, where qubits become interconnected in such a way that the state of one qubit instantly influences the state of another, regardless of the distance between them. Einstein famously referred to this as "spooky action at a distance."</p>
              <p>These properties enable quantum computers to potentially solve certain problems exponentially faster than classical computers. For example, Shor's algorithm, which runs on quantum computers, could theoretically break widely used encryption methods that would take classical computers millions of years to crack.</p>
              <p>Other promising applications include drug discovery, materials science, optimization problems, and machine learning. Quantum simulations could help scientists understand complex molecular interactions, leading to breakthroughs in medicine and materials.</p>
              <p>However, quantum computing faces significant challenges. Qubits are extremely fragile and susceptible to environmental interference, a problem known as decoherence. Maintaining quantum states requires extreme cooling and isolation. Error correction and scaling up quantum systems remain major hurdles.</p>
              <p>Despite these challenges, companies like IBM, Google, Microsoft, and numerous startups are making rapid advances in quantum hardware and software. While widespread practical quantum computing may still be years away, its potential to transform our technological landscape makes it one of the most exciting frontiers in science and technology today.</p>`,
    publishDate: '2024-03-02T16:15:00Z',
    viewCount: 203,
    likeCount: 71,
  },
  // 添加中文科普文章 - 心理学
  {
    id: 8,
    title: '记忆的奥秘：我们如何存储和检索记忆？',
    brief: '探索人类大脑如何保存和回忆信息的复杂过程...',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p.png',
    category: '心理',
    readTime: 7,
    difficulty: '中级',
    content: `<p>记忆是人类认知功能的核心，它使我们能够学习新知识、形成个人身份、保持社会关系，并指导未来的行为。但记忆的工作方式远比我们想象的要复杂。</p>
              <p>科学家们通常将记忆分为几种主要类型：短期记忆（或工作记忆）、长期记忆（包括陈述性记忆和程序性记忆）。短期记忆容量有限，通常只能保持信息几秒到几分钟。长期记忆则可以存储信息数月、数年甚至终身。</p>
              <p>记忆的形成是一个多阶段过程。首先是编码阶段，即我们将信息转换为大脑可以存储的形式。接着是存储阶段，大脑保留这些信息。最后是检索阶段，我们需要访问并回忆存储的信息。</p>
              <p>在神经层面，记忆与大脑中神经元之间连接的变化有关。当我们学习新信息时，神经元之间形成新的连接或强化现有连接，这个过程称为突触可塑性。海马体是大脑中对记忆形成特别重要的结构，尤其是将短期记忆转化为长期记忆。</p>
              <p>年龄、压力、睡眠质量、注意力水平和情绪状态都会影响记忆功能。例如，充足的睡眠对记忆巩固至关重要，而长期压力则可能损害记忆。</p>
              <p>记忆也并非完美无缺。我们的记忆容易受到多种偏见和错误的影响，如确认偏见（倾向于记住支持现有信念的信息）和重构偏见（无意识地修改记忆以符合当前知识或观点）。</p>
              <p>了解记忆的工作机制不仅对基础科学研究有价值，也有助于开发更有效的学习策略，以及理解和治疗记忆相关障碍，如阿尔茨海默病和其他形式的痴呆症。</p>`,
    publishDate: '2024-02-28T10:35:00Z',
    viewCount: 165,
    likeCount: 58,
  },
  // 添加中文科普文章 - 医学
  {
    id: 9,
    title: '免疫系统：身体的守护者',
    brief: '了解人体免疫系统如何保护我们免受病原体侵害...',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/a5c6d7e8f9b0a1c2d3e4f5a6b7c8d9e0.png',
    category: '医学',
    readTime: 6,
    difficulty: '初级',
    content: `<p>免疫系统是一个复杂的细胞和分子网络，共同保护我们的身体免受有害病原体和物质的侵害。它能够区分"自我"和"非自我"，从而识别并清除可能导致疾病的入侵者。</p>
              <p>免疫系统主要分为两部分：先天性免疫和适应性免疫。先天性免疫是我们的第一道防线，包括物理屏障（如皮肤和黏膜）和快速响应的免疫细胞，如中性粒细胞和巨噬细胞。它能快速但非特异性地对抗入侵病原体。</p>
              <p>适应性免疫则更加精确，由B细胞和T细胞负责。B细胞产生抗体，这些蛋白质能特异性地结合病原体。T细胞则直接攻击被病毒感染的细胞，并协调整个免疫反应。适应性免疫的一个关键特点是免疫记忆——当遇到已知病原体时，它能更快更强地响应。</p>
              <p>疫苗正是利用了免疫记忆原理：通过引入无害的病原体成分，触发免疫系统产生记忆，而不会引起疾病。这样，当实际病原体入侵时，免疫系统已经做好了准备。</p>
              <p>虽然免疫系统通常运作良好，但有时会出现问题。自身免疫疾病（如类风湿性关节炎和多发性硬化症）发生在免疫系统错误地攻击自身组织时。过敏则是免疫系统对通常无害的物质（如花粉或食物）过度反应的结果。</p>
              <p>随着年龄增长，免疫功能逐渐下降，这可能解释了为什么老年人更容易感染和患某些疾病。然而，健康的生活方式可以帮助维持免疫系统功能，包括均衡饮食、定期锻炼、充足睡眠和有效管理压力。</p>`,
    publishDate: '2024-02-25T14:50:00Z',
    viewCount: 178,
    likeCount: 63,
  },
  // 添加英文科普文章 - 地理
  {
    id: 10,
    title: 'The Power of Plate Tectonics',
    brief: 'How the movement of Earth\'s crustal plates shapes our world...',
    cover: 'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/p1o2n3m4l5k6j7i8h9g0f1e2d3c4b5a6.png',
    category: '地理',
    readTime: 8,
    difficulty: '中级',
    content: `<p>Plate tectonics is the scientific theory that explains how Earth's outer shell, the lithosphere, is divided into several large and small plates that float on the semi-fluid asthenosphere beneath. These plates move relative to one another, typically at rates of a few centimeters per year—about as fast as your fingernails grow.</p>
              <p>The boundaries where these plates meet are sites of intense geological activity. At convergent boundaries, where plates move toward each other, one plate may dive beneath another in a process called subduction, creating deep ocean trenches and volcanic mountain ranges like the Andes. When continental plates collide, they form massive mountain ranges like the Himalayas.</p>
              <p>At divergent boundaries, plates move away from each other, allowing magma to rise from the mantle and create new crust. This process forms mid-ocean ridges underwater and rift valleys on land. Transform boundaries occur where plates slide horizontally past each other, creating fault lines like the San Andreas Fault in California.</p>
              <p>Plate tectonics is responsible for many of Earth's major features and phenomena. Earthquakes occur when stress builds up at plate boundaries and is suddenly released. Volcanoes form where magma from the mantle reaches the surface, often at or near plate boundaries. Over millions of years, plate movements have created and destroyed oceans, assembled and broken apart continents, and shaped the landscapes we see today.</p>
              <p>The theory of plate tectonics emerged in the mid-20th century, building on earlier concepts like continental drift proposed by Alfred Wegener. Modern technologies like GPS and satellite imaging have confirmed that plates are indeed moving and have allowed scientists to measure these movements with remarkable precision.</p>
              <p>Understanding plate tectonics has profound implications for natural hazard assessment, resource exploration, and our understanding of Earth's history and evolution. It helps explain why earthquakes and volcanic eruptions occur where they do, guides the search for mineral and energy resources, and provides a framework for reconstructing the arrangement of continents and oceans throughout geological time.</p>`,
    publishDate: '2024-02-22T12:10:00Z',
    viewCount: 131,
    likeCount: 45,
  }
];

// 确保不会有undefined被返回
if (mockArticles.length === 0) {
  throw new Error('mockArticles array must not be empty');
}

// 文章分类接口
export interface ArticleCategory {
  id: number;
  name: string;
  icon: string;
  description: string;
}

// 文章分类数据
export const articleCategories: ArticleCategory[] = [
  {
    id: 1,
    name: '科技',
    icon: 'phone-o',
    description: '最新科技发展与创新'
  },
  {
    id: 2,
    name: '历史',
    icon: 'clock-o',
    description: '探索过去的文明与事件'
  },
  {
    id: 3,
    name: '环境',
    icon: 'flower-o',
    description: '自然环境与生态保护'
  },
  {
    id: 4,
    name: '医学',
    icon: 'first-aid-bag-o',
    description: '医学发现与健康知识'
  },
  {
    id: 5,
    name: '心理',
    icon: 'smile-o',
    description: '心理学与精神健康'
  },
  {
    id: 6,
    name: '物理',
    icon: 'bulb-o',
    description: '物理学原理与发现'
  },
  {
    id: 7,
    name: '生物',
    icon: 'knowledge-o',
    description: '生物学与生命科学'
  },
  {
    id: 8,
    name: '天文',
    icon: 'star-o',
    description: '宇宙探索与天文现象'
  },
  {
    id: 9,
    name: '地理',
    icon: 'location-o',
    description: '地球科学与地理探索'
  },
  {
    id: 10,
    name: '励志',
    icon: 'like-o',
    description: '激励人心的故事与思考'
  }
];

// 模拟获取文章数据
export const fetchMockArticles = (): Promise<Article[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockArticles]);
    }, 1000);
  });
};

// 根据分类获取文章
export const getArticlesByCategory = (category: string): Article[] => {
  return mockArticles.filter(article => article.category === category);
};

// 根据难度获取文章
export const getArticlesByDifficulty = (difficulty: string): Article[] => {
  return mockArticles.filter(article => article.difficulty === difficulty);
};

// 获取推荐文章（基于浏览量和点赞数）
export const getRecommendedArticles = (count: number = 5): Article[] => {
  return [...mockArticles]
    .sort((a, b) => {
      const scoreA = (a.viewCount || 0) + (a.likeCount || 0) * 2;
      const scoreB = (b.viewCount || 0) + (b.likeCount || 0) * 2;
      return scoreB - scoreA;
    })
    .slice(0, count);
};

// 获取每日推荐文章（随机选择一篇）
export const getDailyRecommendedArticle = (): Article => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const randomIndex = seed % mockArticles.length;
  return mockArticles[randomIndex] || mockArticles[0]; // 确保总是返回文章，即使随机索引出错
};

// 获取随机美文（返回指定数量的随机美文）
export const getRandomArticles = (count: number = 4): Article[] => {
  if (count >= mockArticles.length) {
    return [...mockArticles];
  }
  
  // 复制数组并打乱顺序
  const shuffled = [...mockArticles].sort(() => 0.5 - Math.random());
  
  // 返回前count个元素
  return shuffled.slice(0, count);
};

// 模拟获取文章详情
export const fetchArticleDetail = (id: number): Promise<Article> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const article = mockArticles.find(a => a.id === id);
      // 如果找不到文章，返回第一个作为默认值
      if (article) {
        resolve(article);
      } else {
        resolve(mockArticles[0]);
      }
    }, 800);
  });
};

// 模拟获取文章分类
export const fetchArticleCategories = (): Promise<ArticleCategory[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...articleCategories]);
    }, 800);
  });
};

// 生成模拟文章数据
export const generateMockArticles = (count: number): Article[] => {
  // 复制并修改模拟数据以生成更多文章
  const result: Article[] = [];
  for (let i = 0; i < count; i++) {
    const index = i % mockArticles.length;
    const baseArticle = mockArticles[index];

    if (!baseArticle) continue; // 额外的安全检查

    const newId = 100 + i; // 避免ID冲突
    const daysAgo = Math.floor(Math.random() * 30); // 0-30天前发布
    const publishDate = new Date();
    publishDate.setDate(publishDate.getDate() - daysAgo);

    result.push({
      id: newId,
      title: baseArticle.title,
      brief: baseArticle.brief,
      cover: baseArticle.cover,
      category: baseArticle.category,
      readTime: baseArticle.readTime,
      difficulty: baseArticle.difficulty,
      content: baseArticle.content,
      publishDate: publishDate.toISOString(),
      viewCount: Math.floor(Math.random() * 200) + 50,
      likeCount: Math.floor(Math.random() * 80) + 10,
    });
  }

  return result;
};

// 词汇单词含义接口
export interface WordMeaning {
  partOfSpeech: string;
  definition: string;
  example: string;
}

// 词汇单词接口
export interface Word {
  id: number;
  text: string;
  phonetic: string;
  translation: string;
  example: string;
  isCollected: boolean;
  meanings: WordMeaning[];
  viewCount: number;
  collectCount: number;
  lastViewTime: string;
  difficulty: string;
  category?: string; // 添加类别字段，方便筛选
  audioUrl?: string;
  exampleTranslation?: string;
  notes?: string;
}

// 词汇分类接口
export interface VocabularyCategory {
  id: number;
  name: string;
  icon: string;
  path: string;
}

// 词汇分类数据
export const vocabularyCategories: VocabularyCategory[] = [
  {
    id: 0,
    name: '每日单词',
    icon: 'calendar-o',
    path: '/vocabulary/daily',
  },
  {
    id: 1,
    name: '商务',
    icon: 'shop-o',
    path: '/vocabulary/business',
  },
  {
    id: 2,
    name: '日常',
    icon: 'clock-o',
    path: '/vocabulary/daily',
  },
  {
    id: 3,
    name: '考试',
    icon: 'records',
    path: '/vocabulary/exam',
  },
];

// 每日单词数据
export const dailyWords: Word[] = [
  {
    id: 1,
    text: 'serendipity',
    phonetic: 'ˌserənˈdɪpəti',
    translation: '意外发现美好事物的能力',
    example: 'Finding this cafe was pure serendipity.',
    isCollected: false,
    meanings: [
      {
        partOfSpeech: 'n.',
        definition: '意外发现美好事物的能力',
        example: 'The discovery of penicillin was a perfect example of serendipity.',
      },
    ],
    viewCount: 42,
    collectCount: 15,
    lastViewTime: '2024-03-15T10:30:00Z',
    difficulty: '高级',
    category: 'daily',
  },
  {
    id: 2,
    text: 'ephemeral',
    phonetic: 'ɪˈfemərəl',
    translation: '短暂的，瞬息的',
    example: 'The beauty of cherry blossoms is ephemeral.',
    isCollected: true,
    meanings: [
      {
        partOfSpeech: 'adj.',
        definition: '短暂的，瞬息的',
        example: 'Social media fame can be ephemeral.',
      },
    ],
    viewCount: 28,
    collectCount: 9,
    lastViewTime: '2024-03-14T15:45:00Z',
    difficulty: '中级',
    category: 'daily',
  },
  {
    id: 3,
    text: 'ubiquitous',
    phonetic: 'juːˈbɪkwɪtəs',
    translation: '无所不在的，普遍存在的',
    example: 'Smartphones have become ubiquitous in modern society.',
    isCollected: false,
    meanings: [
      {
        partOfSpeech: 'adj.',
        definition: '无所不在的，普遍存在的',
        example: 'Coffee shops are ubiquitous in urban areas.',
      },
    ],
    viewCount: 35,
    collectCount: 12,
    lastViewTime: '2024-03-13T09:20:00Z',
    difficulty: '高级',
    category: 'daily',
  },
];

// 商务词汇数据
export const businessWords: Word[] = [
  {
    id: 4,
    text: 'negotiate',
    phonetic: 'nɪˈɡoʊʃieɪt',
    translation: '谈判，协商',
    example: 'We need to negotiate the terms of the contract.',
    isCollected: false,
    meanings: [
      {
        partOfSpeech: 'v.',
        definition: '谈判，协商',
        example: 'They negotiated a better deal with the supplier.',
      },
    ],
    viewCount: 31,
    collectCount: 14,
    lastViewTime: '2024-03-12T11:25:00Z',
    difficulty: '中级',
    category: 'business',
  },
  {
    id: 5,
    text: 'revenue',
    phonetic: 'ˈrevənuː',
    translation: '收入，收益',
    example: 'The company reported increased revenue this quarter.',
    isCollected: true,
    meanings: [
      {
        partOfSpeech: 'n.',
        definition: '收入，收益',
        example: 'Their annual revenue exceeded one million dollars.',
      },
    ],
    viewCount: 45,
    collectCount: 18,
    lastViewTime: '2024-03-11T14:10:00Z',
    difficulty: '初级',
    category: 'business',
  },
  {
    id: 6,
    text: 'entrepreneur',
    phonetic: 'ˌɑːntrəprəˈnɜːr',
    translation: '企业家，创业者',
    example: 'She is a successful entrepreneur with multiple businesses.',
    isCollected: false,
    meanings: [
      {
        partOfSpeech: 'n.',
        definition: '企业家，创业者',
        example: 'Many entrepreneurs start their first business in college.',
      },
    ],
    viewCount: 39,
    collectCount: 21,
    lastViewTime: '2024-03-10T09:45:00Z',
    difficulty: '中级',
    category: 'business',
  },
];

// 日常词汇数据
export const dailyLifeWords: Word[] = [
  {
    id: 7,
    text: 'procrastinate',
    phonetic: 'prəˈkrӕstɪneɪt',
    translation: '拖延，耽搁',
    example: 'Stop procrastinating and finish your homework.',
    isCollected: false,
    meanings: [
      {
        partOfSpeech: 'v.',
        definition: '拖延，耽搁',
        example: 'He tends to procrastinate when faced with difficult tasks.',
      },
    ],
    viewCount: 33,
    collectCount: 11,
    lastViewTime: '2024-03-09T16:30:00Z',
    difficulty: '中级',
    category: 'daily',
  },
  {
    id: 8,
    text: 'meticulous',
    phonetic: 'məˈtɪkjələs',
    translation: '一丝不苟的，极为谨慎的',
    example: 'She is meticulous about keeping her workspace clean.',
    isCollected: true,
    meanings: [
      {
        partOfSpeech: 'adj.',
        definition: '一丝不苟的，极为谨慎的',
        example: 'The chef is known for his meticulous attention to detail.',
      },
    ],
    viewCount: 25,
    collectCount: 8,
    lastViewTime: '2024-03-08T10:15:00Z',
    difficulty: '高级',
    category: 'daily',
  },
  {
    id: 9,
    text: 'nostalgic',
    phonetic: 'nəˈstӕldʒɪk',
    translation: '怀旧的，思乡的',
    example: 'The song made her feel nostalgic for her childhood.',
    isCollected: false,
    meanings: [
      {
        partOfSpeech: 'adj.',
        definition: '怀旧的，思乡的',
        example: 'Looking at old photos often makes people nostalgic.',
      },
    ],
    viewCount: 29,
    collectCount: 13,
    lastViewTime: '2024-03-07T13:40:00Z',
    difficulty: '中级',
    category: 'daily',
  },
];

// 考试词汇数据
export const examWords: Word[] = [
  {
    id: 10,
    text: 'paradigm',
    phonetic: 'ˈpӕrədaɪm',
    translation: '范例，模式',
    example: 'This represents a new paradigm in scientific research.',
    isCollected: false,
    meanings: [
      {
        partOfSpeech: 'n.',
        definition: '范例，模式',
        example: 'The discovery led to a paradigm shift in our understanding.',
      },
    ],
    viewCount: 47,
    collectCount: 22,
    lastViewTime: '2024-03-06T11:05:00Z',
    difficulty: '高级',
    category: 'exam',
  },
  {
    id: 11,
    text: 'juxtapose',
    phonetic: 'ˈdʒʌkstəpoʊz',
    translation: '并置，并列',
    example: 'The artist juxtaposed images of war and peace.',
    isCollected: true,
    meanings: [
      {
        partOfSpeech: 'v.',
        definition: '并置，并列',
        example: 'The essay juxtaposes different perspectives on the issue.',
      },
    ],
    viewCount: 26,
    collectCount: 10,
    lastViewTime: '2024-03-05T15:55:00Z',
    difficulty: '高级',
    category: 'exam',
  },
  {
    id: 12,
    text: 'empirical',
    phonetic: 'ɪmˈpɪrɪkl',
    translation: '经验主义的，实证的',
    example: 'The theory is supported by empirical evidence.',
    isCollected: false,
    meanings: [
      {
        partOfSpeech: 'adj.',
        definition: '经验主义的，实证的',
        example: 'Scientists rely on empirical methods to test hypotheses.',
      },
    ],
    viewCount: 36,
    collectCount: 16,
    lastViewTime: '2024-03-04T09:30:00Z',
    difficulty: '高级',
    category: 'exam',
  },
];

// 根据分类获取词汇数据
export const getWordsByCategory = (categoryId: number): Word[] => {
  switch(categoryId) {
    case 0: // 每日单词
      return [...dailyWords];
    case 1: // 商务
      return [...businessWords];
    case 2: // 日常
      return [...dailyLifeWords];
    case 3: // 考试
      return [...examWords];
    default:
      return [...dailyWords];
  }
};

// 获取随机单词
export const getRandomWord = (): Word => {
  // 合并所有词汇
  const allWords = [
    ...dailyWords,
    ...businessWords,
    ...dailyLifeWords,
    ...examWords
  ];
  
  // 随机选择一个单词
  const randomIndex = Math.floor(Math.random() * allWords.length);
  return allWords[randomIndex] || allWords[0]; // 确保总是返回一个单词，即使随机索引出错
};

// 生成随机的词汇数据
export const generateMockWords = (count: number, categoryId: number): Word[] => {
  const baseWords = getWordsByCategory(categoryId);
  const result: Word[] = [];
  
  for (let i = 0; i < count; i++) {
    const index = i % baseWords.length;
    const baseWord = baseWords[index];
    
    if (!baseWord) continue; // 安全检查
    
    const newId = 100 + i; // 避免ID冲突
    result.push({
      ...baseWord,
      id: newId,
      viewCount: Math.floor(Math.random() * 50) + 5,
      collectCount: Math.floor(Math.random() * 20),
      lastViewTime: new Date(
        Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  }
  
  return result;
};

// 收藏单词接口
export interface MockCollectedWord {
  id: number;
  text: string;
  phonetic: string;
  translation: string;
  example: string;
  meanings: WordMeaning[];
  viewCount: number;
  collectedTime: string;
  lastViewTime: string;
  difficulty: string;
  mastered: boolean;
}

// 生词本数据
export const mockCollectedWords: MockCollectedWord[] = [
  {
    id: 1,
    text: 'ephemeral',
    phonetic: 'ɪˈfemərəl',
    translation: '短暂的，瞬息的',
    example: 'The beauty of cherry blossoms is ephemeral.',
    meanings: [
      {
        partOfSpeech: 'adj.',
        definition: '短暂的，瞬息的',
        example: 'Social media fame can be ephemeral.',
      },
    ],
    viewCount: 28,
    collectedTime: '2024-03-14T15:45:00Z',
    lastViewTime: '2024-03-15T10:30:00Z',
    difficulty: '中级',
    mastered: true,
  },
  {
    id: 2,
    text: 'ubiquitous',
    phonetic: 'juːˈbɪkwɪtəs',
    translation: '无所不在的，普遍存在的',
    example: 'Smartphones have become ubiquitous in modern society.',
    meanings: [
      {
        partOfSpeech: 'adj.',
        definition: '无所不在的，普遍存在的',
        example: 'Coffee shops are ubiquitous in urban areas.',
      },
    ],
    viewCount: 35,
    collectedTime: '2024-03-13T09:20:00Z',
    lastViewTime: '2024-03-14T16:45:00Z',
    difficulty: '高级',
    mastered: false,
  },
  {
    id: 3,
    text: 'eloquent',
    phonetic: 'ˈeləkwənt',
    translation: '雄辩的，有说服力的',
    example: 'She gave an eloquent speech at the conference.',
    meanings: [
      {
        partOfSpeech: 'adj.',
        definition: '雄辩的，有说服力的',
        example: 'His eloquent defense of the policy won over many skeptics.',
      },
    ],
    viewCount: 15,
    collectedTime: '2024-03-12T14:30:00Z',
    lastViewTime: '2024-03-13T08:15:00Z',
    difficulty: '中级',
    mastered: false,
  },
];

// 模拟获取收藏单词数据
export const fetchMockCollectedWords = (): Promise<MockCollectedWord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockCollectedWords]);
    }, 1000);
  });
};

// 生成更多模拟收藏单词数据
export const generateMockCollectedWords = (count: number): MockCollectedWord[] => {
  // 复制并修改模拟数据以生成更多单词
  const result: MockCollectedWord[] = [];
  for (let i = 0; i < count; i++) {
    // 确保索引在有效范围内
    const index = i % mockCollectedWords.length;
    const baseWord = mockCollectedWords[index];

    if (!baseWord) continue; // 额外的安全检查

    const newId = mockCollectedWords.length + i + 1;
    const daysAgo = Math.floor(Math.random() * 30); // 0-30天前收藏
    const collectedDate = new Date();
    collectedDate.setDate(collectedDate.getDate() - daysAgo);

    const viewsAfterCollection = Math.floor(Math.random() * 10); // 收藏后查看0-10次
    const lastViewDate = new Date(collectedDate);
    lastViewDate.setDate(
      lastViewDate.getDate() + Math.floor(Math.random() * daysAgo),
    );

    result.push({
      id: newId,
      text: baseWord.text,
      phonetic: baseWord.phonetic,
      translation: baseWord.translation,
      example: baseWord.example,
      meanings: [...baseWord.meanings],
      viewCount: Math.floor(Math.random() * 30) + viewsAfterCollection,
      collectedTime: collectedDate.toISOString(),
      lastViewTime: lastViewDate.toISOString(),
      difficulty: baseWord.difficulty,
      mastered: Math.random() > 0.7, // 30%概率已掌握
    });
  }

  return result;
};

// 课程表相关接口
export interface ScheduleCourse {
  id: number;          // 课程ID
  title: string;       // 课程标题
  subject: string;     // 学科
  teacher: string;     // 教师姓名
  classroom: string;   // 教室
  startTime: string;   // 开始时间
  endTime: string;     // 结束时间
  day: number;         // 星期几 (0-6，0代表周日，1代表周一，以此类推)
  color: string;       // 课程卡片颜色
}

// 一周的课程表数据
export const mockSchedule: ScheduleCourse[] = [
  // 周一课程
  {
    id: 101,
    title: '高中物理力学',
    subject: '物理',
    teacher: '张老师',
    classroom: '理科楼301',
    startTime: '08:00',
    endTime: '09:30',
    day: 1,
    color: '#1989fa'
  },
  {
    id: 102,
    title: '高考作文指导',
    subject: '语文',
    teacher: '李老师',
    classroom: '文科楼203',
    startTime: '10:00',
    endTime: '11:30',
    day: 1,
    color: '#ff976a'
  },
  {
    id: 103,
    title: '概率统计',
    subject: '数学',
    teacher: '王老师',
    classroom: '理科楼202',
    startTime: '14:00',
    endTime: '15:30',
    day: 1,
    color: '#07c160'
  },

  // 周二课程
  {
    id: 104,
    title: '有机化学',
    subject: '化学',
    teacher: '赵老师',
    classroom: '理科楼305',
    startTime: '08:00',
    endTime: '09:30',
    day: 2,
    color: '#ee0a24'
  },
  {
    id: 105,
    title: '英语听力训练',
    subject: '英语',
    teacher: '史密斯',
    classroom: '外语楼501',
    startTime: '10:00',
    endTime: '11:30',
    day: 2,
    color: '#7232dd'
  },

  // 周三课程
  {
    id: 106,
    title: '函数与导数',
    subject: '数学',
    teacher: '王老师',
    classroom: '理科楼202',
    startTime: '08:00',
    endTime: '09:30',
    day: 3,
    color: '#07c160'
  },
  {
    id: 107,
    title: '电磁学基础',
    subject: '物理',
    teacher: '张老师',
    classroom: '理科楼301',
    startTime: '10:00',
    endTime: '11:30',
    day: 3,
    color: '#1989fa'
  },
  {
    id: 108,
    title: '古代文学赏析',
    subject: '语文',
    teacher: '李老师',
    classroom: '文科楼203',
    startTime: '14:00',
    endTime: '15:30',
    day: 3,
    color: '#ff976a'
  },

  // 周四课程
  {
    id: 109,
    title: '化学实验课',
    subject: '化学',
    teacher: '赵老师',
    classroom: '实验楼102',
    startTime: '08:00',
    endTime: '09:30',
    day: 4,
    color: '#ee0a24'
  },
  {
    id: 110,
    title: '英语写作技巧',
    subject: '英语',
    teacher: '史密斯',
    classroom: '外语楼501',
    startTime: '10:00',
    endTime: '11:30',
    day: 4,
    color: '#7232dd'
  },

  // 周五课程
  {
    id: 111,
    title: '物理实验课',
    subject: '物理',
    teacher: '张老师',
    classroom: '实验楼103',
    startTime: '08:00',
    endTime: '09:30',
    day: 5,
    color: '#1989fa'
  },
  {
    id: 112,
    title: '数学综合题解析',
    subject: '数学',
    teacher: '王老师',
    classroom: '理科楼202',
    startTime: '10:00',
    endTime: '11:30',
    day: 5,
    color: '#07c160'
  },
  {
    id: 113,
    title: '语文阅读理解',
    subject: '语文',
    teacher: '李老师',
    classroom: '文科楼203',
    startTime: '14:00',
    endTime: '15:30',
    day: 5,
    color: '#ff976a'
  }
];

// 获取指定日期的课程表
export const getScheduleByDay = (day: number): ScheduleCourse[] => {
  return mockSchedule.filter(course => course.day === day);
};

// 获取整周课程表
export const getWeekSchedule = (): ScheduleCourse[] => {
  return mockSchedule;
};

// 任务计划相关接口
export interface TaskPlan {
  id: number;         // 任务ID
  title: string;      // 任务标题
  subject: string;    // 相关学科
  description: string; // 任务描述
  deadline: string;   // 截止日期
  priority: 'high' | 'medium' | 'low'; // 优先级
  status: 'todo' | 'in-progress' | 'completed'; // 任务状态
  completedAt?: string; // 完成时间
  tags: string[];     // 任务标签
  createdAt: string;  // 创建时间
  color: string;      // 任务颜色
}

// 模拟任务计划数据
export const mockTasks: TaskPlan[] = [
  {
    id: 1,
    title: '物理力学期中复习',
    subject: '物理',
    description: '完成力学章节的所有练习题，重点复习牛顿定律和动量守恒',
    deadline: '2023-12-15T23:59:59',
    priority: 'high',
    status: 'in-progress',
    tags: ['期中考试', '复习'],
    createdAt: '2023-12-01T10:30:00',
    color: '#1989fa'
  },
  {
    id: 2,
    title: '英语单词背诵',
    subject: '英语',
    description: '背诵课本第三单元的单词，至少30个',
    deadline: '2023-12-10T18:00:00',
    priority: 'medium',
    status: 'todo',
    tags: ['单词', '背诵'],
    createdAt: '2023-12-05T09:15:00',
    color: '#7232dd'
  },
  {
    id: 3,
    title: '数学作业完成',
    subject: '数学',
    description: '完成老师布置的函数与导数章节习题',
    deadline: '2023-12-08T20:00:00',
    priority: 'high',
    status: 'todo',
    tags: ['作业', '必交'],
    createdAt: '2023-12-04T14:20:00',
    color: '#07c160'
  },
  {
    id: 4,
    title: '语文作文修改',
    subject: '语文',
    description: '根据老师的反馈修改上次的作文，注意修改论点论据的逻辑性',
    deadline: '2023-12-12T16:30:00',
    priority: 'medium',
    status: 'todo',
    tags: ['作文', '修改'],
    createdAt: '2023-12-06T11:00:00',
    color: '#ff976a'
  },
  {
    id: 5,
    title: '化学实验报告',
    subject: '化学',
    description: '完成上周实验课的实验报告，包括实验目的、步骤、结果和分析',
    deadline: '2023-12-09T23:59:59',
    priority: 'high',
    status: 'completed',
    completedAt: '2023-12-08T15:30:00',
    tags: ['实验', '报告'],
    createdAt: '2023-12-03T16:45:00',
    color: '#ee0a24'
  },
  {
    id: 6,
    title: '生物知识点整理',
    subject: '生物',
    description: '整理细胞结构与功能相关的知识点，制作思维导图',
    deadline: '2023-12-18T22:00:00',
    priority: 'low',
    status: 'todo',
    tags: ['整理', '思维导图'],
    createdAt: '2023-12-07T13:10:00',
    color: '#2196f3'
  },
  {
    id: 7,
    title: '历史论文撰写',
    subject: '历史',
    description: '完成关于近代中国社会变革的论文，字数不少于1500字',
    deadline: '2023-12-20T23:59:59',
    priority: 'medium',
    status: 'in-progress',
    tags: ['论文', '研究'],
    createdAt: '2023-12-02T09:00:00',
    color: '#ff9800'
  },
  {
    id: 8,
    title: '地理地图标记',
    subject: '地理',
    description: '完成世界主要国家和地形的地图标记练习',
    deadline: '2023-12-14T17:00:00',
    priority: 'low',
    status: 'completed',
    completedAt: '2023-12-13T14:20:00',
    tags: ['地图', '练习'],
    createdAt: '2023-12-09T10:30:00',
    color: '#795548'
  }
];

// 获取所有任务
export const getAllTasks = (): Promise<TaskPlan[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockTasks]);
    }, 800);
  });
};

// 根据状态获取任务
export const getTasksByStatus = (status: 'todo' | 'in-progress' | 'completed'): Promise<TaskPlan[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredTasks = mockTasks.filter(task => task.status === status);
      resolve(filteredTasks);
    }, 600);
  });
};

// 根据优先级获取任务
export const getTasksByPriority = (priority: 'high' | 'medium' | 'low'): Promise<TaskPlan[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredTasks = mockTasks.filter(task => task.priority === priority);
      resolve(filteredTasks);
    }, 600);
  });
};

// 根据学科获取任务
export const getTasksBySubject = (subject: string): Promise<TaskPlan[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredTasks = mockTasks.filter(task => task.subject === subject);
      resolve(filteredTasks);
    }, 600);
  });
};

// 创建新任务（模拟）
export const createTask = (task: Omit<TaskPlan, 'id' | 'createdAt'>): Promise<TaskPlan> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTask: TaskPlan = {
        ...task,
        id: mockTasks.length + 1,
        createdAt: new Date().toISOString()
      };
      mockTasks.push(newTask);
      resolve(newTask);
    }, 800);
  });
};

// 更新任务状态
export const updateTaskStatus = (taskId: number, status: 'todo' | 'in-progress' | 'completed'): Promise<TaskPlan> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const taskIndex = mockTasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        reject(new Error('Task not found'));
        return;
      }
      
      const task = mockTasks[taskIndex];
      const updatedTask: TaskPlan = {
        ...task,
        status,
        completedAt: status === 'completed' ? new Date().toISOString() : undefined
      };
      
      mockTasks[taskIndex] = updatedTask;
      resolve(updatedTask);
    }, 600);
  });
};

// 课程任务计划接口
export interface TaskPlan {
  id: number;         // 任务ID
  title: string;      // 任务标题
  description: string; // 任务描述
  courseId: number;   // 关联课程ID
  courseName: string; // 课程名称
  startDate: string;  // 开始日期
  endDate: string;    // 截止日期
  completed: boolean; // 是否已完成
  progress: number;   // 完成进度(0-100)
  priority: 'high' | 'medium' | 'low'; // 优先级
  color: string;      // 任务标签颜色
}

// 模拟任务计划数据
export const mockTaskPlans: TaskPlan[] = [
  {
    id: 1,
    title: '高中物理力学作业',
    description: '完成牛顿定律相关习题，预习动量定理',
    courseId: 101,
    courseName: '高中物理力学',
    startDate: '2023-12-05',
    endDate: '2023-12-10',
    completed: false,
    progress: 30,
    priority: 'high',
    color: '#1989fa'
  },
  {
    id: 2,
    title: '高考作文素材积累',
    description: '搜集整理近期热点社会话题，准备素材卡片',
    courseId: 102,
    courseName: '高考作文指导',
    startDate: '2023-12-06',
    endDate: '2023-12-15',
    completed: false,
    progress: 45,
    priority: 'medium',
    color: '#ff976a'
  },
  {
    id: 3,
    title: '概率统计课后练习',
    description: '完成课本P78-P80的习题，整理错题笔记',
    courseId: 103,
    courseName: '概率统计',
    startDate: '2023-12-01',
    endDate: '2023-12-08',
    completed: true,
    progress: 100,
    priority: 'medium',
    color: '#07c160'
  },
  {
    id: 4,
    title: '有机化学实验报告',
    description: '撰写乙醇氧化实验报告，包含实验数据分析和误差分析',
    courseId: 104,
    courseName: '有机化学',
    startDate: '2023-12-03',
    endDate: '2023-12-12',
    completed: false,
    progress: 60,
    priority: 'high',
    color: '#ee0a24'
  },
  {
    id: 5,
    title: '英语听力训练',
    description: '完成30分钟英语听力训练，整理生词和短语',
    courseId: 105,
    courseName: '英语听力训练',
    startDate: '2023-12-07',
    endDate: '2023-12-09',
    completed: false,
    progress: 0,
    priority: 'low',
    color: '#7232dd'
  },
  {
    id: 6,
    title: '函数与导数期中复习',
    description: '复习导数的应用、极值和函数单调性',
    courseId: 106,
    courseName: '函数与导数',
    startDate: '2023-12-02',
    endDate: '2023-12-11',
    completed: false,
    progress: 75,
    priority: 'high',
    color: '#07c160'
  },
  {
    id: 7,
    title: '电磁学基础知识点整理',
    description: '整理法拉第电磁感应定律和安培定则的应用',
    courseId: 107,
    courseName: '电磁学基础',
    startDate: '2023-12-08',
    endDate: '2023-12-18',
    completed: false,
    progress: 10,
    priority: 'medium',
    color: '#1989fa'
  },
  {
    id: 8,
    title: '古代文学赏析读书笔记',
    description: '阅读《论语》并完成读书笔记',
    courseId: 108,
    courseName: '古代文学赏析',
    startDate: '2023-12-04',
    endDate: '2023-12-14',
    completed: false,
    progress: 50,
    priority: 'medium',
    color: '#ff976a'
  }
];

// 获取所有任务计划
export const getAllTaskPlans = (): TaskPlan[] => {
  return mockTaskPlans;
};

// 获取特定课程的任务计划
export const getTaskPlansByCourseId = (courseId: number): TaskPlan[] => {
  return mockTaskPlans.filter(task => task.courseId === courseId);
};

// 获取特定任务计划
export const getTaskPlanById = (taskId: number): TaskPlan | undefined => {
  return mockTaskPlans.find(task => task.id === taskId);
};


