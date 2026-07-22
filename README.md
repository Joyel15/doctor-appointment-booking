# MediBook — Doctor Appointment Booking System

A full-stack MERN web application that enables patients to book doctor appointments, doctors to manage their schedules, and admins to oversee the platform.

## 🔗 Live Demo
- **Frontend:** https://medibook-doctor-appointment.vercel.app
- **Backend API:** https://doctor-appointment-backend-4wan.onrender.com

## ✨ Features

### Patient
- Register with optional profile photo
- Browse and search doctors by name or specialization
- Browse specializations by symptom keyword
- Book appointments with visual slot picker
- View and cancel appointments
- Write, edit and delete reviews after completed appointments
- Edit profile (name, phone, password, photo)
- Apply to become a doctor

### Doctor
- Manage and update appointment status
- Edit professional profile (specialization, experience, fees, bio)
- Edit personal profile (name, phone, password, photo)
- View appointment history

### Admin
- Approve or reject doctor applications
- View all registered users
- View platform statistics

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- React Router v6
- Tailwind CSS v4
- Axios
- Sonner (toast notifications)

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT Authentication
- bcryptjs
- Multer + Cloudinary (image uploads)
- Nodemailer (email notifications)

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account
- Cloudinary account

### Installation

**Clone the repository:**
```bash
git clone https://github.com/Joyel15/doctor-appointment-booking.git
cd doctor-appointment-booking
```

**Backend setup:**
```bash
cd server
npm install
```

Create `.env` file in server folder:
```
MONGO_URI=your_mongodb_uri
PORT=5000
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password
```

```bash
npm run dev
```

**Frontend setup:**
```bash
cd client
npm install
```

Create `.env` file in client folder:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

## 📁 Project Structure

```
doctor-appointment/
├── client/          # React frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── utils/
└── server/          # Node.js backend
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── utils/
```

## 🔐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| PUT | /api/auth/profile | Update profile |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/doctors | Get all approved doctors |
| GET | /api/doctors/:id | Get doctor by ID |
| POST | /api/doctors/apply | Apply as doctor |
| PUT | /api/doctors/:id | Update doctor profile |
| GET | /api/doctors/me | Get logged in doctor profile |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/appointments/book | Book appointment |
| GET | /api/appointments/patient | Get patient appointments |
| GET | /api/appointments/doctor | Get doctor appointments |
| PUT | /api/appointments/:id | Update appointment status |
| GET | /api/appointments/slots/:doctorId | Get booked slots |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/reviews | Create review |
| GET | /api/reviews/doctor/:id | Get doctor reviews |
| GET | /api/reviews/my | Get my reviews |
| PUT | /api/reviews/:id | Update review |
| DELETE | /api/reviews/:id | Delete review |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/doctors/pending | Get pending doctors |
| PUT | /api/admin/doctors/:id | Approve doctor |
| GET | /api/admin/users | Get all users |

## 👤 Test Credentials

```
Admin:
Email: admin@gmail.com
Password: password

Sample Patient:
Email: patient@gmail.com
Password: 123456
```

## 📸 Screenshots
(Add screenshots here after deployment)

## 🔮 Future Improvements
- Email verification on registration
- Razorpay payment integration
- Real-time notifications
- Video consultation feature
- Mobile app with React Native