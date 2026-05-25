// 主应用逻辑
document.addEventListener('DOMContentLoaded', () => {
    console.log('应用已加载');
    
    // 初始化
    init();
});

function init() {
    // 初始化代码
    console.log('初始化完成');
}

// API调用示例
async function fetchData() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('API响应:', data);
        return data;
    } catch (error) {
        console.error('请求失败:', error);
    }
}
