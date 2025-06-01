
---

# Property Listing API 🏠

This API allows users to manage properties, favorites, recommendations, and authentication. Below is the documentation for the available routes.

## Table of Contents

* [Authentication Routes](#authentication-routes)
* [Property Routes](#property-routes)
* [Favorites Routes](#favorites-routes)
* [Recommendation Routes](#recommendation-routes)

---

## Authentication Routes 🔐

### POST `/auth/signup`

**Description**: Register a new user.
**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response**:

* `201 Created` ✅ User successfully registered.
* `400 Bad Request` ❌ Validation errors.

---

### POST `/auth/login`

**Description**: Log in an existing user.
**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:

* `200 OK` ✅ Returns a JWT token.
* `401 Unauthorized` ❌ Invalid credentials.

---

## Property Routes 🏡

### POST `/properties/createProperty`

**Description**: Create a new property.
**Request Body**:

```json
{
  "id": "PROP1001",
  "title": "Luxury Villa",
  "type": "Villa",
  "price": 500000,
  "state": "California",
  "city": "Los Angeles",
  "areaSqFt": 3000,
  "bedrooms": 4,
  "bathrooms": 3,
  "amenities": ["pool", "gym", "parking"],
  "furnished": "Furnished",
  "availableFrom": "2025-01-01",
  "listedBy": "Owner",
  "tags": ["luxury", "sea-view"],
  "colorTheme": "#123456",
  "rating": 4.5,
  "isVerified": true,
  "listingType": "sale"
}
```

**Response**:

* `201 Created` ✅ Property successfully created.
* `400 Bad Request` ❌ Validation errors.

---

### GET `/properties/getAllProperties`

**Description**: Retrieve all properties.
**Response**:

* `200 OK` ✅ Returns a list of properties.
* `500 Internal Server Error` ❌ Server error.

---

### GET `/properties/getPropertyByQuery`

**Description**: Retrieve properties based on query parameters.
**Query Parameters**:

```json
{
  "type": "Villa",
  "city": "Los Angeles"
}
```

**Response**:

* `200 OK` ✅ Returns matching properties.
* `404 Not Found` ❌ No properties found.

---

### PUT `/properties/updateProperty/:id`

**Description**: Update an existing property.
**Request Body**:

```json
{
  "title": "Updated Villa Title",
  "price": 550000
}
```

**Response**:

* `200 OK` ✅ Property successfully updated.
* `404 Not Found` ❌ Property not found.

---

### DELETE `/properties/deleteProperty/:id`

**Description**: Delete a property.
**Response**:

* `200 OK` ✅ Property successfully deleted.
* `404 Not Found` ❌ Property not found.

---

## Favorites Routes ⭐

### POST `/favorites/addFavorite`

**Description**: Add a property to favorites.
**Request Body**:

```json
{
  "propertyId": "PROP1001"
}
```

**Response**:

* `200 OK` ✅ Property added to favorites.
* `404 Not Found` ❌ Property not found.

---

### DELETE `/favorites/removeFavorite/:propertyId`

**Description**: Remove a property from favorites.
**Response**:

* `200 OK` ✅ Property removed from favorites.
* `404 Not Found` ❌ Property not found.

---

### GET `/favorites/getFavorites`

**Description**: Retrieve all favorite properties for the user.
**Response**:

* `200 OK` ✅ Returns a list of favorite properties.
* `404 Not Found` ❌ User not found.

---

## Recommendation Routes 🎯

### GET `/recommendations/searchRecipient`

**Description**: Search for a recipient for recommendations.
**Response**:

* `200 OK` ✅ Returns recipient details.
* `404 Not Found` ❌ Recipient not found.

---

### POST `/recommendations/recommendProperty`

**Description**: Recommend a property to a recipient.
**Request Body**:

```json
{
  "recipientId": "USER123",
  "propertyId": "PROP1001"
}
```

**Response**:

* `200 OK` ✅ Property successfully recommended.
* `404 Not Found` ❌ Recipient or property not found.

---

### GET `/recommendations/getRecommendations`

**Description**: Retrieve all recommendations for the user.
**Response**:

* `200 OK` ✅ Returns a list of recommendations.
* `404 Not Found` ❌ No recommendations found.

---

## Environment Variables ⚙️

Ensure the following environment variables are set:

* `DB_URL`: MongoDB connection string.
* `RESEND_API_KEY`: API key for email services.
* `EMAIL_FROM`: Sender email address.
* `JWT_SECRET`: Secret key for JWT token generation.
* `APP_URL`: Application base URL.
* `PORT`: Port number for the server.
* `REDIS_URL`: Redis connection string.

---

## Setup Instructions 🚀

### Run using Docker

1. Pull the latest Docker image from the registry:

   ```bash
   docker pull madniverse/property-listing-api:latest
   ```
2. Run the container (make sure you have your `.env` file ready with required variables):

   ```bash
   docker run --env-file .env -p 3000:3000 madniverse/property-listing-api:latest
   ```
3. The API will now be accessible at `http://localhost:3000`.

---

If you want to build and run locally (development mode):

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Install dependencies:

   ```bash
   pnpm install
   ```
3. Setup `.env` file based on `.env.example`.
4. Start the development server:

   ```bash
   pnpm dev
   ```

