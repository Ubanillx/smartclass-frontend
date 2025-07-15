import { Course, mockPopularCourses } from "./mock";

// 模拟获取课程详情

export const fetchCourseDetail = (id: number): Promise<Course> => {
return new Promise((resolve) => {
setTimeout(() => {
const course = mockPopularCourses.find((c) => c.id === id);
// 如果找不到课程，返回第一个作为默认值
if (course) {
resolve(course);
} else {
resolve(mockPopularCourses[0]);
}
}, 800);
});
};
