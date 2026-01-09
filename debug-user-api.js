const axios = require('axios');

async function testUserApi() {
  console.log('开始测试用户API...\n');
  
  const baseURL = 'http://localhost:3000';
  
  try {
    // 测试1: 正确的JSON请求
    console.log('测试1: 发送正确的JSON请求');
    const response1 = await axios.post(`${baseURL}/users`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ 响应状态:', response1.status);
    console.log('✅ 响应数据:', JSON.stringify(response1.data, null, 2));
  } catch (error) {
    console.log('❌ 错误:', error.response?.data || error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  try {
    // 测试2: 缺少Content-Type头部
    console.log('测试2: 缺少Content-Type头部');
    const response2 = await axios.post(`${baseURL}/users`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ 响应状态:', response2.status);
    console.log('✅ 响应数据:', JSON.stringify(response2.data, null, 2));
  } catch (error) {
    console.log('❌ 错误:', error.response?.data || error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  try {
    // 测试3: 空请求体
    console.log('测试3: 空请求体');
    const response3 = await axios.post(`${baseURL}/users`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ 响应状态:', response3.status);
    console.log('✅ 响应数据:', JSON.stringify(response3.data, null, 2));
  } catch (error) {
    console.log('❌ 错误:', error.response?.data || error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  try {
    // 测试4: 使用纯文本请求
    console.log('测试4: 使用纯文本请求（应该失败）');
    const response4 = await axios.post(`${baseURL}/users`, 'username=testuser&email=test@example.com&password=password123', {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
    console.log('✅ 响应状态:', response4.status);
    console.log('✅ 响应数据:', JSON.stringify(response4.data, null, 2));
  } catch (error) {
    console.log('❌ 错误:', error.response?.data || error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  try {
    // 测试5: 使用表单数据请求
    console.log('测试5: 使用表单数据请求');
    const params = new URLSearchParams();
    params.append('username', 'testuser');
    params.append('email', 'test@example.com');
    params.append('password', 'password123');
    
    const response5 = await axios.post(`${baseURL}/users`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    console.log('✅ 响应状态:', response5.status);
    console.log('✅ 响应数据:', JSON.stringify(response5.data, null, 2));
  } catch (error) {
    console.log('❌ 错误:', error.response?.data || error.message);
  }
}

testUserApi().catch(console.error);