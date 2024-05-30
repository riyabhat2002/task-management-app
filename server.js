const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('your_mongodb_connection_string', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Define Task Schema and Model
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
});

const Task = mongoose.model('Task', taskSchema);

// CRUD routes
app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.send(task);
});

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(task);
});

app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send({ message: 'Task deleted' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
