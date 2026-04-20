const app = require('./app');

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`FPSTris API server running on port ${PORT}`);
});
