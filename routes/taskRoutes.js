const express = require('express');
const router = express.Router();
const { Tasks } = require('./../models/Tasks'); 
const { User } = require('./../models/User');

router.post('/', async (req, res) => {
  try {
    const {
      name,
      created_at,
      due_date,
      description,
      status,
      priority,
      assigned_to,
      created_by
    } = req.body;

    
    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Task name is required"
      });
    }

    // Check if user exists (if created_by is provided)
    if (created_by) {
      const user = await User.findOne({ where: { id: created_by } });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found"
        });
      }
    }

  
    if (assigned_to) {
      const assignedUser = await User.findOne({ where: { id: assigned_to } });
      if (!assignedUser) {
        return res.status(404).json({
          status: "error",
          message: "Assigned user not found"
        });
      }
    }

   
    const newTask = await Tasks.create({
      name,
      created_at: created_at || new Date(),
      due_date,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      assigned_to,
      created_by
    });

    res.status(201).json({
      status: "success",
      message: "Task created successfully",
      task: {
        id: newTask.id,
        name: newTask.name,
        created_at: newTask.created_at,
        due_date: newTask.due_date,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        assigned_to: newTask.assigned_to,
        created_by: newTask.created_by
      }
    });

  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({
      status: "error",
      message: "Failed to create task",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


router.get('/', async (req, res) => {
  try {
    const tasks = await Tasks.findAll({
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      status: "success",
      message: "Tasks retrieved successfully",
      tasks: tasks
    });

  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch tasks"
    });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Tasks.findByPk(id);
    
    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found"
      });
    }

    res.status(200).json({
      status: "success",
      message: "Task retrieved successfully",
      task: task
    });

  } catch (err) {
    console.error('Error fetching task:', err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch task"
    });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

  
    const task = await Tasks.findByPk(id);
    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found"
      });
    }

   
    if (updateData.assigned_to) {
      const assignedUser = await User.findOne({ where: { id: updateData.assigned_to } });
      if (!assignedUser) {
        return res.status(404).json({
          status: "error",
          message: "Assigned user not found"
        });
      }
    }

    await task.update(updateData);

    res.status(200).json({
      status: "success",
      message: "Task updated successfully",
      task: task
    });

  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({
      status: "error",
      message: "Failed to update task"
    });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Tasks.findByPk(id);
    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found"
      });
    }

    await task.destroy();

    res.status(200).json({
      status: "success",
      message: "Task deleted successfully"
    });

  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({
      status: "error",
      message: "Failed to delete task"
    });
  }
});

module.exports = router;