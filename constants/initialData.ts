// Initial task data
export const initialTasks = [
  {
    id: 1,
    title: 'Design mobile app UI',
    description: 'Create wireframes and mockups for the todo app',
    priority: 'high',
    completed: false,
    dueDate: '2025-08-09',
    tags: ['design', 'urgent'],
    subtasks: [
      { id: 1, title: 'Create wireframes', completed: true },
      { id: 2, title: 'Design mockups', completed: false },
      { id: 3, title: 'Review with team', completed: false }
    ]
  },
  {
    id: 2,
    title: 'Review project requirements',
    description: 'Go through all the project specifications',
    priority: 'medium',
    completed: false,
    dueDate: '2025-08-08',
    tags: ['review'],
    subtasks: []
  },
  {
    id: 3,
    title: 'Setup development environment',
    description: 'Install dependencies and configure project',
    priority: 'low',
    completed: true,
    dueDate: '2025-08-07',
    tags: ['setup'],
    subtasks: []
  }
];