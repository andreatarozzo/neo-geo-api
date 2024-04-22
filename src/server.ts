import app from './app';

// Start the server
app.listen(process.env.PORT || 3000, async () => {
  console.log(`Server is running at http://localhost:${process.env.PORT || 3000}`);
});
