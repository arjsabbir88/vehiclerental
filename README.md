# 🌐 Vehicle Rental System – API Reference


This document provides a **complete, professional API reference** for the Vehicle Rental System, including authentication, vehicles, users, and bookings. All endpoints follow REST conventions and return standardized responses.

---


###Admin Credential
```json
{
    "email": "sabbir@example.com",
    "password": "securePassword123"
}
```

## 🔐 Authentication

### 1. Register User

**Access:** Public
**Method:** `POST`
**Endpoint:** `/api/v1/auth/signup`

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phone": "01712345678",
  "role": "customer"
}
```

#### Success Response (201)

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "01712345678",
    "role": "customer"
  }
}
```

---

### 2. Login User

**Access:** Public
**Method:** `POST`
**Endpoint:** `/api/v1/auth/signin`

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt_token>",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "01712345678",
      "role": "customer"
    }
  }
}
```

---

## 🚗 Vehicle Management

### 3. Create Vehicle

**Access:** Admin
**Method:** `POST`
**Endpoint:** `/api/v1/vehicles`

**Headers:**
`Authorization: Bearer <jwt_token>`

#### Request Body

```json
{
  "vehicle_name": "Toyota Camry 2024",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50,
  "availability_status": "available"
}
```

---

### 4. Get All Vehicles

**Access:** Public
**Method:** `GET`
**Endpoint:** `/api/v1/vehicles`

---

### 5. Get Vehicle By ID

**Access:** Public
**Method:** `GET`
**Endpoint:** `/api/v1/vehicles/:vehicleId`

---

### 6. Update Vehicle

**Access:** Admin
**Method:** `PUT`
**Endpoint:** `/api/v1/vehicles/:vehicleId`

---

### 7. Delete Vehicle

**Access:** Admin
**Method:** `DELETE`
**Endpoint:** `/api/v1/vehicles/:vehicleId`

> Vehicle cannot be deleted if it has active bookings.

---

## 👥 User Management

### 8. Get All Users

**Access:** Admin
**Method:** `GET`
**Endpoint:** `/api/v1/users`

---

### 9. Update User

**Access:** Admin or Own Profile
**Method:** `PUT`
**Endpoint:** `/api/v1/users/:userId`

---

### 10. Delete User

**Access:** Admin
**Method:** `DELETE`
**Endpoint:** `/api/v1/users/:userId`

> User cannot be deleted if they have active bookings.

---

## 📅 Booking Management

### 11. Create Booking

**Access:** Customer / Admin
**Method:** `POST`
**Endpoint:** `/api/v1/bookings`

#### Business Logic

* Calculates total price automatically
* Marks vehicle as `booked`

---

### 12. Get All Bookings

**Access:** Role-based
**Method:** `GET`
**Endpoint:** `/api/v1/bookings`

* **Admin:** sees all bookings
* **Customer:** sees own bookings only

---

### 13. Update Booking

**Access:** Role-based
**Method:** `PUT`
**Endpoint:** `/api/v1/bookings/:bookingId`

#### Customer Action

```json
{ "status": "cancelled" }
```

#### Admin Action

```json
{ "status": "returned" }
```

#### Rules

* Customer → can only cancel own booking
* Admin → can mark booking as returned
* Returned / Cancelled → vehicle becomes `available`

---

## 🧾 Standard Response Format

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## 📌 HTTP Status Codes

| Code | Meaning      |
| ---- | ------------ |
| 200  | OK           |
| 201  | Created      |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 403  | Forbidden    |
| 404  | Not Found    |
| 500  | Server Error |

---

## 🔒 Authentication Header

```
Authorization: Bearer <jwt_token>
```

---

## 💡 Notes

* Price calculation: `daily_rent_price × total_days`
* Auto-return handled by system cron or scheduler
* All protected routes require JWT authentication

---

© Vehicle Rental System API – Professional Documentation-tariqul-islam-khan(dev.tariqulislamkhan88@gmail.com)
