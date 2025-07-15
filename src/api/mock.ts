
// 模拟的推荐搜索词
export const mockRecommendations: string[] = [
  '英语口语',
  '单词记忆',
];

// 模拟的搜索结果
export const mockSearchResults = (query: string): string[] => {
  // 为了更好的演示效果，放宽匹配条件
  const matchedRecommendation = mockRecommendations.find(
    (rec) => rec.includes(query) || query.includes(rec),
  );

  if (!matchedRecommendation) {
    return [];
  }
  // 返回相关的搜索结果
  return [];
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
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/f8b3549a57984426bd563291f081f9bf.png',
    tag: '精选',
    tagColor: '#ff8c00',
    level: '中级',
    duration: 35,
    studentsCount: 2980,
    subject: '数学',
  },
  {
    id: 2,
    title: '初三物理实践课',
    brief: '通过有趣的实验激发学习兴趣，理解物理现象背后的原理',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/65e2cbeb958c47c4be3dcf06aa00057a.png',
    tag: '入门',
    tagColor: '#07c160',
    level: '初级',
    duration: 30,
    studentsCount: 1580,
    subject: '物理',
  },
  {
    id: 3,
    title: '初三化学实验室探索',
    brief: '动手做实验，探索科学奥秘',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/88e4f754e8d2413ea55a0c1c7d7f7b46.png',
    tag: '精品',
    tagColor: '#ff8c00',
    level: '初级',
    duration: 40,
    studentsCount: 567,
    subject: '科学',
  },
  // 英语课程
  {
    id: 4,
    title: '商务英语口语进阶',
    brief: '掌握商务场景下的专业英语表达，提升职场竞争力',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/e5a7ca50d81a4b4bb7cd3fb4e4c1d7e5.png',
    tag: '热门',
    tagColor: '#ee0a24',
    level: '中级',
    duration: 45,
    studentsCount: 1280,
    subject: '英语',
  },
  {
    id: 5,
    title: '雅思写作高分技巧',
    brief: '针对雅思写作常见题型的分析与解答，助你轻松突破6.5分',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/b71e5c4f1a9b41168bd7c4e79b04c04f.png',
    tag: '推荐',
    tagColor: '#1989fa',
    level: '高级',
    duration: 60,
    studentsCount: 968,
    subject: '英语',
  },
  // 数学课程
  {
    id: 6,
    title: '高中数学核心知识点解析',
    brief: '系统梳理高中数学必考知识点，解题思路与技巧',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/7f3e5c46d9874a8a9c2c4f08b6d0f2e7.png',
    tag: '精品',
    tagColor: '#ff8c00',
    level: '高级',
    duration: 50,
    studentsCount: 1876,
    subject: '数学',
  },
  {
    id: 7,
    title: '初中数学几何证明题专项突破',
    brief: '掌握几何证明题的解题技巧和思路，培养数学思维',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/23a4f89bd0c94b8c9e8d6f9a0d1c7b5e.png',
    tag: '推荐',
    tagColor: '#1989fa',
    level: '中级',
    duration: 40,
    studentsCount: 1355,
    subject: '数学',
  },
  {
    id: 8,
    title: '小学奥数思维训练',
    brief: '培养孩子的数学思维能力，提升解决问题的能力',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/f8b3549a57984426bd563291f081f9bf.png',
    tag: '入门',
    tagColor: '#07c160',
    level: '初级',
    duration: 35,
    studentsCount: 2980,
    subject: '数学',
  },
  // 语文课程
  {
    id: 9,
    title: '高考作文写作技巧与范例',
    brief: '掌握高考作文写作技巧，了解评分标准，提供优秀范文赏析',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/a5c6d7e8f9b0a1c2d3e4f5a6b7c8d9e0.png',
    tag: '热门',
    tagColor: '#ee0a24',
    level: '高级',
    duration: 55,
    studentsCount: 2150,
    subject: '语文',
  },
  {
    id: 10,
    title: '初中文言文精讲',
    brief: '详细讲解初中必考文言文，掌握常见实词虚词用法',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p.png',
    tag: '精品',
    tagColor: '#ff8c00',
    level: '中级',
    duration: 45,
    studentsCount: 1680,
    subject: '语文',
  },
  {
    id: 11,
    title: '小学生阅读能力提升',
    brief: '培养良好的阅读习惯，提升阅读理解能力和阅读速度',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/p1o2n3m4l5k6j7i8h9g0f1e2d3c4b5a6.png',
    tag: '推荐',
    tagColor: '#1989fa',
    level: '初级',
    duration: 30,
    studentsCount: 2460,
    subject: '语文',
  },
  // 物理课程
  {
    id: 12,
    title: '高中物理力学题型解析',
    brief: '系统讲解力学中的重点难点，掌握公式推导与计算技巧',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/f8b3549a57984426bd563291f081f9bf.png',
    tag: '精品',
    tagColor: '#ff8c00',
    level: '高级',
    duration: 60,
    studentsCount: 1120,
    subject: '物理',
  },
  {
    id: 13,
    title: '初中物理电学基础',
    brief: '通过实验和动画演示，轻松理解电学基本概念和定律',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/65e2cbeb958c47c4be3dcf06aa00057a.png',
    tag: '推荐',
    tagColor: '#1989fa',
    level: '中级',
    duration: 40,
    studentsCount: 950,
    subject: '物理',
  },
  {
    id: 14,
    title: '趣味物理实验课',
    brief: '通过有趣的实验激发学习兴趣，理解物理现象背后的原理',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/88e4f754e8d2413ea55a0c1c7d7f7b46.png',
    tag: '入门',
    tagColor: '#07c160',
    level: '初级',
    duration: 30,
    studentsCount: 1580,
    subject: '物理',
  },
  // 化学课程
  {
    id: 15,
    title: '高中有机化学系统讲解',
    brief: '梳理有机化学知识体系，掌握常见反应机理和解题思路',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/e5a7ca50d81a4b4bb7cd3fb4e4c1d7e5.png',
    tag: '精品',
    tagColor: '#ff8c00',
    level: '高级',
    duration: 55,
    studentsCount: 870,
    subject: '化学',
  },
  {
    id: 16,
    title: '初中化学方程式专项训练',
    brief: '系统掌握化学方程式的书写与配平，提高计算能力',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/b71e5c4f1a9b41168bd7c4e79b04c04f.png',
    tag: '推荐',
    tagColor: '#1989fa',
    level: '中级',
    duration: 35,
    studentsCount: 1050,
    subject: '化学',
  },
  {
    id: 17,
    title: '化学实验安全与基本操作',
    brief: '学习化学实验的基本操作技能和安全注意事项',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/88e4f754e8d2413ea55a0c1c7d7f7b46.png',
    tag: '入门',
    tagColor: '#07c160',
    level: '初级',
    duration: 25,
    studentsCount: 1320,
    subject: '化学',
  },
  // 生物课程
  {
    id: 18,
    title: '高中生物遗传学精讲',
    brief: '深入讲解孟德尔遗传定律与现代遗传学理论，解析经典题型',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/e5a7ca50d81a4b4bb7cd3fb4e4c1d7e5.png',
    tag: '精品',
    tagColor: '#ff8c00',
    level: '高级',
    duration: 50,
    studentsCount: 920,
    subject: '生物',
  },
  {
    id: 19,
    title: '初中生物细胞与人体系统',
    brief: '通过图解和动画，了解细胞结构与人体各大系统的功能',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/b71e5c4f1a9b41168bd7c4e79b04c04f.png',
    tag: '推荐',
    tagColor: '#1989fa',
    level: '中级',
    duration: 40,
    studentsCount: 880,
    subject: '生物',
  },
  {
    id: 20,
    title: '趣味生物学探秘',
    brief: '通过有趣的案例和实验，激发对生物学的兴趣和热爱',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/88e4f754e8d2413ea55a0c1c7d7f7b46.png',
    tag: '入门',
    tagColor: '#07c160',
    level: '初级',
    duration: 30,
    studentsCount: 1450,
    subject: '生物',
  },
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
    courses: [9, 10, 11],
  },
  {
    id: 2,
    name: '数学',
    icon: 'chart-trending-o',
    courses: [6, 7, 8],
  },
  {
    id: 3,
    name: '英语',
    icon: 'chat-o',
    courses: [4, 5],
  },
  {
    id: 4,
    name: '物理',
    icon: 'bulb-o',
    courses: [12, 13, 14],
  },
  {
    id: 5,
    name: '化学',
    icon: 'filter-o',
    courses: [15, 16, 17],
  },
  {
    id: 6,
    name: '生物',
    icon: 'flower-o',
    courses: [18, 19, 20],
  },
];

// 按学科获取课程
export const getCoursesBySubject = (subject: string): Course[] => {
  return mockPopularCourses.filter((course) => course.subject === subject);
};

// 按分类ID获取课程
export const getCoursesByCategory = (categoryId: number): Course[] => {
  const category = courseCategories.find((cat) => cat.id === categoryId);

  if (!category) return [];

  return category.courses
    .map((courseId) =>
      mockPopularCourses.find((course) => course.id === courseId),
    )
    .filter((course): course is Course => course !== undefined);
};

// 按难度等级获取课程
export const getCoursesByLevel = (level: string): Course[] => {
  return mockPopularCourses.filter((course) => course.level === level);
};

// 模拟获取热门课程数据
export const fetchMockPopularCourses = (): Promise<Course[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockPopularCourses]);
    }, 500);
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

// 课程表相关接口
export interface ScheduleCourse {
  id: number; // 课程ID
  title: string; // 课程标题
  subject: string; // 学科
  teacher: string; // 教师姓名
  classroom: string; // 教室
  startTime: string; // 开始时间
  endTime: string; // 结束时间
  day: number; // 星期几 (0-6，0代表周日，1代表周一，以此类推)
  color: string; // 课程卡片颜色
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
    color: '#1989fa',
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
    color: '#ff976a',
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
    color: '#07c160',
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
    color: '#ee0a24',
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
    color: '#7232dd',
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
    color: '#07c160',
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
    color: '#1989fa',
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
    color: '#ff976a',
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
    color: '#ee0a24',
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
    color: '#7232dd',
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
    color: '#1989fa',
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
    color: '#07c160',
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
    color: '#ff976a',
  },
];

// 获取指定日期的课程表
export const getScheduleByDay = (day: number): ScheduleCourse[] => {
  return mockSchedule.filter((course) => course.day === day);
};

// 获取整周课程表
export const getWeekSchedule = (): ScheduleCourse[] => {
  return mockSchedule;
};

// 课程任务计划接口
export interface TaskPlan {
  id: number; // 任务ID
  title: string; // 任务标题
  description: string; // 任务描述
  courseId: number; // 关联课程ID
  courseName: string; // 课程名称
  startDate: string; // 开始日期
  endDate: string; // 截止日期
  completed: boolean; // 是否已完成
  progress: number; // 完成进度(0-100)
  priority: 'high' | 'medium' | 'low'; // 优先级
  color: string; // 任务标签颜色
}

// 模拟任务计划数据
const mockTaskPlans: TaskPlan[] = [
  {
    id: 1,
    title: '完成数学作业第三章',
    description: '完成高等数学第三章习题，包括导数和微分的计算',
    courseId: 6,
    courseName: '高中数学核心知识点解析',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    completed: false,
    progress: 65,
    priority: 'high',
    color: '#07c160',
  },
  {
    id: 2,
    title: '英语口语练习',
    description: '练习商务英语对话，提升口语表达能力',
    courseId: 4,
    courseName: '商务英语口语进阶',
    startDate: '2024-01-16',
    endDate: '2024-01-25',
    completed: false,
    progress: 30,
    priority: 'medium',
    color: '#1989fa',
  },
  {
    id: 3,
    title: '物理实验报告',
    description: '完成力学实验的数据分析和实验报告撰写',
    courseId: 12,
    courseName: '高中物理力学题型解析',
    startDate: '2024-01-10',
    endDate: '2024-01-18',
    completed: true,
    progress: 100,
    priority: 'high',
    color: '#1989fa',
  },
  {
    id: 4,
    title: '化学方程式练习',
    description: '掌握有机化学反应方程式的书写和配平',
    courseId: 15,
    courseName: '高中有机化学系统讲解',
    startDate: '2024-01-20',
    endDate: '2024-01-28',
    completed: false,
    progress: 0,
    priority: 'medium',
    color: '#ff976a',
  },
  {
    id: 5,
    title: '语文作文练习',
    description: '练习议论文写作，提升写作技巧和表达能力',
    courseId: 9,
    courseName: '高考作文写作技巧与范例',
    startDate: '2024-01-22',
    endDate: '2024-01-30',
    completed: false,
    progress: 15,
    priority: 'low',
    color: '#ee0a24',
  },
];

// 获取所有任务计划
export const getAllTaskPlans = (): TaskPlan[] => {
  return [...mockTaskPlans];
};
