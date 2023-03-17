# TO-DO

## Main

- [x] Connect to database
- [x] Use JSON middleware for parsing request body
- [x] Allow CORS and with credentials
- [ ] Define all routes

## Models

- [x] Add "validated" field to all user models
  - Boolean
  - default: false
- [ ] Add createdAt and updatedAt field to all models
  - Date
  - default: () => Date.now()
  - immutable (only for createdAt field)
  - pre-save for updatedAt field
    - updatedAt = Date.now();

### Admin

- [x] Define schema
  - [x] firstName
    - String
    - Required
  - [x] lastName
    - String
    - default: ""
  - [x] emailAddress
    - String
    - Required
    - Custom validation for email
  - [x] password
    - String
    - Required
  - [x] contactNumber
    - String
    - default: ""
  - [x] permissions
    - [String]
    - Required
    - enum
      - super (can do everything)
      - admin (can change validation status of users)
      - logistics (can only access scheduling and handling deliveries)

### Member

- [x] Define schema
  - [x] firstName
    - String
    - Required
  - [x] lastName
    - String
  - [x] birthdate
    - Date
    - Required
  - [x] emailAddress
    - String
    - Required
    - Custom validation for email
  - [x] address
    - Required
    - Object {}
      - fullAddress
        - String
        - Required
      - lat
        - Number
        - default: null
      - long
        - Number
        - default: null
  - [x] contactNumber
    - String
    - default: ""
  - [x] dietaryRestrictions
    - [String]
    - default: []
  - [x] foodAllergies
    - [String]
    - default: []
  - [x] password
    - String
    - Required

### Caregiver

- [x] Define schema
  - [x] firstName
    - String
    - Required
  - [x] lastName
    - String
  - [x] emailAddress
    - String
    - Required
    - Custom validation for email
  - [x] address
    - Required
    - Object {}
      - fullAddress
        - String
        - Required
      - lat
        - Number
        - default: null
      - long
        - Number
        - default: null
  - [x] contactNumber
    - String
    - default: ""
  - [x] dependentMember
    - ObjectId
    - Required
    - ref: "Member"
  - [x] relationshipToMember
    - String
    - Required
  - [x] password
    - String
    - Required

### Volunteer

- [x] Define schema
  - [x] firstName
    - String
    - Required
  - [x] lastName
    - String
  - [x] emailAddress
    - String
    - Required
    - Custom validation for email
  - [x] address
    - Required
    - Object {}
      - fullAddress
        - String
        - Required
      - lat
        - Number
        - default: null
      - long
        - Number
        - default: null
  - [x] contactNumber
    - String
    - default: ""
  - [x] daysAvailable
    - [String]
    - Required
    - enum
      - all days of the week (monday, tuesday, ..., sunday)
  - [x] serviceProvided
    - [String]
    - Required
    - enum
      - delivery
      - logistics
  - [x] password
    - String
    - Required

### Partner

- [x] Define schema
  - [x] businessName
    - String
    - Required
  - [x] emailAddress
    - String
    - Required
    - Custom validation for email
  - [x] address
    - Required
    - Object {}
      - fullAddress
        - String
        - Required
      - lat
        - Number
        - default: null
      - long
        - Number
        - default: null
  - [x] contactNumber
    - String
    - default: ""
  - [x] daysAvailable
    - [String]
    - Required
    - enum
      - all days of the week (monday, tuesday, ..., sunday)
  - [x] serviceType
    - [String]
    - Required
    - enum
      - restaurant (hot meals)
      - grocery (frozen goods)
  - [x] password
    - String
    - Required

### Schedule

- [x] Define schema
  - [x] weekNumber
    - Number
    - Required
    - min: 1
    - max: 52
  - [x] days
    - [String]
    - Required
    - enum
      - all days of the week (monday, tuesday, ..., sunday)
  - [x] dietaryRestrictions
    - [String]
    - default: []
  - [x] partner
    - ObjectId
    - Required
    - ref: "Partner"
  - [x] createdBy
    - ObjectId
    - Required
    - ref: "Admin"

### Delivery

- [x] Define schema
  - [x] deliveryDate
    - Date
    - Required
  - [x] status
    - String
    - Required
    - enum
      - preparing
      - cancelled
      - rescheduled
      - completed
  - [x] dietaryRestrictions
    - [String]
    - default: []
  - [x] deliveredFor
    - ObjectId
    - Required
    - ref: "Member"
  - [x] caregiver
    - ObjectId
    - default: null
    - ref: "Caregiver"
  - [x] deliveredBy
    - ObjectId
    - Required
    - ref: "Volunteer"
  - [x] partner
    - ObjectId
    - Required
    - ref: "Partner"
  - [x] comment
    - String
    - default: ""

### Donation

- [x] Define schema
  - [x] donorName
    - String
    - default: "anonymous"
  - [x] donationType
    - String
    - Required
    - enum
      - one-time
      - weekly
      - monthly
      - quarterly
      - annual
  - [x] amount
    - Number
    - Required
  - [x] emailAddress
    - String
    - Required
    - Custom validation for email
  - [x] paymentMethod
    - String
    - Required
    - enum
      - cash
      - check
      - debit
      - credit
      - paypal
  - [x] comment
    - String
    - default: ""

### RefreshToken

- [x] Define schema
  - [x] refreshToken
    - String
    - Required
  - [x] createdBy
    - ObjectId
    - Required
  - [x] createdAt
    - Date
    - immutable:
    - default: () => Date.now()

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
  - [ ] Save dependent member details to Member collection
    - make emailAddress, password, the same as Caregiver's
      - [ ] Make sure in login to take this into account
        - check if email exist -> if user type member check if dependent -> if dependent use caregiver as user type -> proceed to login as normal
  - [ ] Save caregiver details to Caregiver collection
  - [ ] Reference memberId in caregiver "dependentMember" field
- [ ] Update details

### Volunteer controller

- [ ] Volunteer sign up
- [ ] Update details

### Partner controller

- [ ] Partner sign up
- [ ] Update details

### Admin controller

- [ ] Manage roles
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

### Report controller

- [ ] Get reports
  - [ ] Donations
    - Total amount within a period of time
    - Separate by category
    - Top donations
    - Top donors
  - [ ] Volunteers
    - Total number of volunteers
    - Volunteer retention
  - [ ] Member & Caregivers
    - Number of meals received (Hot and Frozen)
    - Validation rate
    - Member / Caregiver ratio
    - Age ranges

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
