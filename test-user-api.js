const axios = require('axios');

async function testCreateUser() {
  try {
    const response = await axios.post('http://localhost:3000/users', {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('用户创建成功:', response.data);
  } catch (error) {
    console.error('创建用户失败:', error.response?.data || error.message);
  }
}

testCreateUser();