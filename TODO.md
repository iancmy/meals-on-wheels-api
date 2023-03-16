# TO-DO

## Main

- [x] Connect to database
- [x] Use JSON middleware for parsing request body
- [x] Allow CORS and with credentials
- [ ] Define all routes

## Models

### Admin

- [ ] Define schema

### Member

- [ ] Define schema

### Caregiver

- [ ] Define schema

### Volunteer

- [ ] Define schema

### Partner

- [ ] Define schema

### Schedule

- [ ] Define schema

### Delivery

- [ ] Define schema

### Donation

- [ ] Define schema

### RefreshToken

- [ ] Define schema

## Controllers

### Location API controller

- [x] Address to coordinates
- [x] Coordinates to address

### User controller

- [x] Log in
- [x] Refresh token
- [x] Get user details
- [x] Log out

### Member controller

- [ ] Member sign up
- [ ] Update details

### Caregiver controller

- [ ] Caregiver sign up
- [ ] Update details

### Volunteer controller

- [ ] Volunteer sign up
- [ ] Update details

### Partner controller

- [ ] Partner sign up
- [ ] Update details

### Admin controller

- [ ] Get users
- [ ] Validate user
- [ ] Create new users
  - [ ] Admin
  - [ ] Member
  - [ ] Caregiver
  - [ ] Volunteer
  - [ ] Partner
- [ ] Schedules CRUD
- [ ] Delivery CRUD

### Donation controller

- [ ] New donation

## Service

### Authentication service

- [x] Create access token
- [x] Create refresh token
- [x] Authenticate user middleware

### Location service

- [x] Get distance
- [x] Address to coordinates
- [x] Coordinates to address

### Encryption service

- [x] Encrypt password middleware

### User service

- [x] Get user type middleware
- [x] Check password middleware
- [x] Get user details middleware

## Testing

- [ ] Test authentication
- [ ] Test location API
