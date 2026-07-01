# CareGo API Documentation

This comprehensive documentation covers the centralized authentication portal and cross-table registration workflows for both **Nurses** and **Patients**, as well as public service catalogs and global error standards.

## Base URL

```
https://carego.onrender.com/api
```

# 1. Nurse Endpoints

## 1.1 Nurse Registration

Registers a new nurse profile, uploads files to Cloudinary, and automatically logs the user in by returning a JWT token. Cross-checks against both collections to guarantee uniqueness.

- URL: `/nurses/register`
- Method: `POST`
- Content-Type: `multipart/form-data`

### Request Body (Form-Data)

| Key              | Type                | Required | Description                                          |
| ---------------- | ------------------- | -------- | ---------------------------------------------------- |
| `firstname`      | String              | Yes      | First name                                           |
| `lastname`       | String              | Yes      | Last name                                            |
| `email`          | String              | Yes      | Unique email address                                 |
| `password`       | String              | Yes      | Account password                                     |
| `repeatPassword` | String              | Yes      | Must match `password` exactly                        |
| `birthDate`      | String (Date)       | Yes      | ISO date string (e.g., `1990-01-01`)                 |
| `mobile`         | String              | Yes      | Unique mobile phone number                           |
| `address`        | String              | Yes      | Home address                                         |
| `governmentId`   | String              | Yes      | Unique national ID number                            |
| `photo`          | File (Binary)       | Yes      | Profile picture (`JPEG`/`PNG`)                       |
| `diplomas`       | File Array (Binary) | No       | One or more verification documents (`PDF`/Images)    |
| `workExperience` | Stringified JSON    | No       | Array of work history objects (see format below)     |
| `specialization` | Stringified JSON    | No       | Array of strings (e.g., `["Head nurse"]`)            |
| `manipulations`  | Stringified JSON    | No       | Array of strings (e.g., `["injection", "infusion"]`) |

**Note on JSON arrays in** `multipart/form-data`: Advanced fields must be passed as stringified JSON. For example, `workExperience` should look like this in the text field:
`[{"employer":"City Hospital","position":"General Nurse","startDate":"2018-01-01","endDate":"2020-12-31"}]`

### Success Response (201 Created)

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "6a3964ae033157dbfaee8cce",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "role": "nurse",
    "age": 36,
    "photoUrl": "https://res.cloudinary.com/...",
    "workExperience": [...],
    "specialization": [...],
    "manipulations": [...],
    "diplomasAndCertificatesFiles": [...],
    "hasVerifiedEmail": false,
    "hasVerifiedMobile": false,
    "hasVerifiedGovernmentId": false,
    "hasVerifiedQualificationDocs": false,
    "patientsServed": 0,
    "isAvailable": false,
    "ratings": [],
    "createdAt": "2026-06-22T16:37:02.519Z",
    "updatedAt": "2026-06-22T16:37:02.519Z"
  }
}
```

## 1.2 Get Popular Nurses

Retrieves the top 4 popular nurses from the database. This is a public presentation endpoint that optimizes data transfer by projecting only the necessary fields required for the front-end display cards.

- **URL:** `/nurses/popular`
- **Method:** `GET`
- **Content-Type:** `None`

### Request Headers

No authorization or custom headers are required for this public route.

### Request Body

None (Empty query)

### Success Response (200 OK)

```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "_id": "6a3964ae033157dbfaee8cce",
      "firstname": "John",
      "lastname": "Doe",
      "photoUrl": "[https://res.cloudinary.com/](https://res.cloudinary.com/)...",
      "specialization": ["Head nurse"],
      "workExperience": [
        {
          "employer": "City Hospital",
          "position": "General Nurse",
          "startDate": "2018-01-01",
          "endDate": "2020-12-31"
        }
      ]
    },
    {
      "_id": "6a3964ae033157dbfaee8ccf",
      "firstname": "Sarah",
      "lastname": "Connor",
      "photoUrl": "[https://res.cloudinary.com/](https://res.cloudinary.com/)...",
      "specialization": ["ICU Specialist", "Pediatric Care"],
      "workExperience": [
        {
          "employer": "St. Jude Hospital",
          "position": "Senior Nurse",
          "startDate": "2021-03-15",
          "endDate": "2025-05-10"
        }
      ]
    }
  ]
}
```

## 1.3 Get All Nurses (Card View)

Retrieves a complete list of all registered nurses in the database. Like the popular nurses endpoint, this is a public presentation route designed specifically for rendering light front-end directory cards by limiting the payload to only the essential visual details.

- **URL:** `/nurses`
- **Method:** `GET`
- **Content-Type:** `None`

### Request Headers

No authorization or custom headers are required for this public route.

### Request Body

None (Empty query)

### Success Response (200 OK)

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "6a3964ae033157dbfaee8cce",
      "firstname": "John",
      "lastname": "Doe",
      "photoUrl": "[https://res.cloudinary.com/](https://res.cloudinary.com/)...",
      "specialization": ["Head nurse"],
      "workExperience": [
        {
          "employer": "City Hospital",
          "position": "General Nurse",
          "startDate": "2018-01-01",
          "endDate": "2020-12-31"
        }
      ]
    },
    {
      "_id": "6a3964ae033157dbfaee8ccf",
      "firstname": "Sarah",
      "lastname": "Connor",
      "photoUrl": "[https://res.cloudinary.com/](https://res.cloudinary.com/)...",
      "specialization": ["ICU Specialist", "Pediatric Care"],
      "workExperience": [
        {
          "employer": "St. Jude Hospital",
          "position": "Senior Nurse",
          "startDate": "2021-03-15",
          "endDate": "2025-05-10"
        }
      ]
    }
  ]
}
```

# 2. Patient Endpoints

## 2.1 Patient Registration

Registers a new patient profile, initializes medical tracking limits, and automatically returns an authenticated session token. Cross-checks against both collections to guarantee uniqueness.

- URL: `/patients/register`
- Method: `POST`
- Content-Type: `application/json`

### Request Body (JSON)

```json
{
  "firstname": "Jane",
  "lastname": "Smith",
  "birthDate": "1996-01-01",
  "email": "jane.smith@example.com",
  "password": "securepassword123",
  "repeatPassword": "securepassword123",
  "mobile": "123-456-7890",
  "address": "123 Main St, Anytown, USA",
  "governmentId": "123456789"
}
```

### Success Response (201 Created)

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "6a3964ae033157dbfaee8ccf",
    "firstname": "Jane",
    "lastname": "Smith",
    "email": "jane.smith@example.com",
    "role": "patient",
    "age": 30,
    "mobile": "123-456-7890",
    "address": "123 Main St, Anytown, USA",
    "governmentId": "123456789",
    "hasVerifiedEmail": false,
    "hasVerifiedMobile": false,
    "hasVerifiedGovernmentId": false,
    "servicesReceived": [
      { "serviceName": "injection", "serviceCount": 0, "nurseName": "" },
      { "serviceName": "infusion", "serviceCount": 0, "nurseName": "" }
    ],
    "createdAt": "2026-06-24T01:40:00.000Z",
    "updatedAt": "2026-06-24T01:40:00.000Z"
  }
}
```

# 3. Unified Login Endpoints

## 3.1 Portal Login

A single entry route for both Nurses and Patients. The backend dynamically matches the correct record across databases and handles the login session context transparently.

- URL: `/auth/login`
- Method: `POST`
- Content-Type: `application/json`

### Request Body (JSON)

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### Success Response (200 OK)

The response dynamically yields the correct user mapping based on their system type (containing their specific database variables and structural properties alongside their dedicated `role` metadata).

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "6a3964ae033157dbfaee8cce",
    "firstname": "John",
    "lastname": "Doe",
    "email": "user@example.com",
    "role": "nurse",
    "age": 36,
    "photoUrl": "[https://res.cloudinary.com/](https://res.cloudinary.com/)..."
    // ... remaining user profile properties
  }
}
```

# 4. Services Endpoints

## 4.1 Get All Services (Full Payload)

Retrieves a complete list of medical and care services from the database, including metadata required for rendering full-service catalog interfaces.

- **URL:** `/services`
- **Method:** `GET`
- **Content-Type:** `None`

### Request Headers

No authorization headers are required for this public route.

### Request Body

None (Empty query)

### Success Response (200 OK)

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "6a3ed3cce66dee40e3418f8f",
      "name": "ინექცია",
      "img": "https://i.ibb.co/yL7GPrT/Injection.webp",
      "service_id": "injection",
      "createdAt": "2026-06-26T19:32:28.000Z",
      "updatedAt": "2026-06-26T19:32:28.000Z"
    },
    {
      "_id": "6a3ed58be66dee40e3418f90",
      "name": "ინფუზია",
      "img": "https://i.ibb.co/gLrrkntH/infusion.webp",
      "service_id": "infusion",
      "createdAt": "2026-06-26T19:39:55.000Z",
      "updatedAt": "2026-06-26T19:39:55.000Z"
    }
  ]
}
```

## 4.2 Get Service Names Only

Retrieves a lightweight, flattened list containing only the literal names of available services. This is optimal for populating select dropdowns, form checkboxes, or validation filters on the front-end.

- **URL:** `/services/names`
- **Method:** `GET`
- **Content-Type:** `None`

### Request Headers

No authorization headers are required for this public route.

### Request Body

None (Empty query)

### Success Response (200 OK)

```json
{
  "success": true,
  "count": 2,
  "data": ["injection", "infusion"]
}
```

# Error Responses (Global)

When an interface assertion fails, the API returns a corresponding HTTP status code along with a structured message instead of breaking down silently.

### Missing or Invalid Credentials (400 Bad Request)

```json
{
  "success": false,
  "message": "Password and repeat password are required."
}
```

### Unauthorized Access (401 Unauthorized)

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```
