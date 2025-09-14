# 📝 Task Manager API

A Task Manager REST API built with **NestJS** and **MongoDB**.

---

## ⚙️ Setup Instructions

### 🐳 Docker Setup


1. **Pull Images and start containers**
   ```bash
   docker compose -f docker-compose-prod.yaml up -d
   ```

    #### OR

2. **Environment Variables**
   ```bash
   NODE_ENV=development
   PORT=8000
   JWT_SECRET=thisismystrongkey
   MONGO_URL=mongodb://localhost:27017/task-manager
   ```
   add above lines in ```.env``` file.

3. **Build and start containers**

   ```bash
   docker compose up -d --build
   ```


### 🔧 Local Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ankit792r/nest-task-manager.git
   cd nest-task-manager
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Environment Variables**
   ```bash
   NODE_ENV=development
   PORT=8000
   JWT_SECRET=thisismystrongkey
   MONGO_URL=mongodb://localhost:27017/task-manager
   ```
4. **Run the App**
   ```bash
   npm run start:dev
   ```

## ✨ Features

- 👤 Role-Based Authorization – Admin/User roles with permission restrictions.
- 🚦 Rate Limiting – Prevent abuse using IP-based rate limit.
- 📦 Dockerized – Containerized setup for easy deployment.
- Github action - Lint, Test, Build on push

#### 👤 User Features

- 🔐 JWT Authentication: Register/Login and secure access to personal data.
- ✅ Manage Own Tasks: Create, view, update, and delete personal tasks.
- 📄 Task Status Filtering: Filter tasks by status (e.g., Todo, In Progress, Done).
- 📊 Pagination: Get tasks in paginated format for performance.
- 🔁 Rate Limiting: Prevent abuse by limiting repeated requests.

#### 🛡️ Admin Features

- 👥 User Management: View all users, update roles (e.g., promote to Admin).
- 📋 Manage All Tasks: Full access to view, update, and delete any task in the system.

  ##### 📈 Analytics Dashboard:
  - 🧾 Task Per Status Count: Number of tasks grouped by status.
  - 👤 Tasks Per User Count: Number of tasks created by each user.
  - ⏱️ Average Task Completion Time: Mean time taken to complete tasks.
  - 📊 User Stats: Total number of users and number of admins.

## 📚 API Documentation

Once the server is running, access the Swagger docs at: `http://localhost:8000/docs`

#### Authentication Routes

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| POST   | `/auth/register` | Register a new user   |
| POST   | `/auth/login`    | Login and receive JWT |

#### Task Routes

| Method | Endpoint     | Description                        |
| ------ | ------------ | ---------------------------------- |
| GET    | `/tasks`     | Get all personal tasks (paginated) |
| POST   | `/tasks`     | Create a new task (user only)      |
| PUT    | `/tasks/:id` | Update own task                    |
| DELETE | `/tasks/:id` | Delete own task                    |

#### Admin Routes

| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| GET    | `/tasks`           | Get all tasks (paginated)  |
| PUT    | `/tasks/:id`       | Update task                |
| DELETE | `/tasks/:id`       | Delete task                |
| GET    | `/analytics/tasks` | Get task related analytics |
| GET    | `/analytics/user`  | Get user related analytics |

## 🛠 Technologies Used

- NestJS – Node.js framework for scalable applications
- MongoDB – NoSQL database
- JWT – Secure authentication
- Swagger – API documentation
- Docker – Containerization
- Rate Limit – Throttling requests

## 📂 Project Structure

```bash
src/
├── analytics/          # analytics logic
├── auth/               # Authentication logic
├── lib/                # Shared uitilty
├── types/              # Type definations
├── tasks/              # Task CRUD and service
├── users/              # User management
├── root.module.ts      # Root module
├── main.ts             # App entry point
```

## 🧑‍💻 Author

**Ankit Prajapati** [LinkedIn](https://www.linkedin.com/in/ankit742) [Github](https://github.com/ankit792r)
