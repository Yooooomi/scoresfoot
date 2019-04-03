const axios = require('axios');

async function main()
{
  try {
    const users = await axios.get('http://localhost:8081/users/ranking');
    console.log(JSON.stringify(users.data, null, '  '));
    console.log(users.data.length);
  } catch (e) {
    console.error(e);
  }
}

main();