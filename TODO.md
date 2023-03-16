# TO-DO

## Main

- [x] Connect to database
- [x] Use JSON middleware for parsing request body
- [x] Allow CORS and with credentials
- [ ] Define all routes

## Models

- [ ] Add "validated" field to all user models
  - Boolean
  - default: false
- [ ] Add createdAt and updatedAt field to all models
  - Date
  - default: () => Date.now()
  - immutable (only for createdAt field)
  - pre-save for updatedAt field
    - updatedAt = Date.now();

### Admin

- [ ] Define schema
  - [ ] firstName
    - String
    - Required
  - [ ] lastName
    - String
    - default: ""
  - [ ] emailAddress
    - String
    - Required
    - Custom validation for email
  - [ ] password
    - String
    - Required
  - [ ] contactNumber
    - String
    - default: ""
  - [ ] permissions
    - [String]
    - Required
    - enum
      - super (can do everything)
      - admin (can change validation status of users)
      - logistics (can only access scheduling and handling deliveries)

### Member

- [ ] Define schema
  - [ ] firstName
    - String
    - Required
  - [ ] lastName
    - String
  - [ ] birthdate
    - Date
    - Required
  - [ ] emailAddress
    - String
    - Required
    - Custom validation for email
  - [ ] address
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
  - [ ] contactNumber
    - String
    - default: ""
  - [ ] dietaryRestrictions
    - [String]
    - default: []
  - [ ] foodAllergies
    - [String]
    - default: []
  - [ ] password
    - String
    - Required

### Caregiver

- [ ] Define schema
  - [ ] firstName
    - String
    - Required
  - [ ] lastName
    - String
  - [ ] emailAddress
    - String
    - Required
    - Custom validation for email
  - [ ] address
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
  - [ ] contactNumber
    - String
    - default: ""
  - [ ] dependentMember
    - ObjectId
    - Required
    - ref: "Member"
  - [ ] relationshipToMember
    - String
    - Required
  - [ ] password
    - String
    - Required

### Volunteer

- [ ] Define schema
  - [ ] firstName
    - String
    - Required
  - [ ] lastName
    - String
  - [ ] emailAddress
    - String
    - Required
    - Custom validation for email
  - [ ] address
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
  - [ ] contactNumber
    - String
    - default: ""
  - [ ] daysAvailable
    - [String]
    - Required
    - enum
      - all days of the week (monday, tuesday, ..., sunday)
  - [ ] serviceProvided
    - [String]
    - Required
    - enum
      - delivery
      - logistics
  - [ ] password
    - String
    - Required

### Partner

- [ ] Define schema
  - [ ] businessName
    - String
    - Required
  - [ ] emailAddress
    - String
    - Required
    - Custom validation for email
  - [ ] address
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
  - [ ] contactNumber
    - String
    - default: ""
  - [ ] daysAvailable
    - [String]
    - Required
    - enum
      - all days of the week (monday, tuesday, ..., sunday)
  - [ ] serviceType
    - [String]
    - Required
    - enum
      - restaurant (hot meals)
      - grocery (frozen goods)
  - [ ] password
    - String
    - Required

### Schedule

- [ ] Define schema
  - [ ] weekNumber
    - Number
    - Required
  - [ ] days
    - [String]
    - Required
    - enum
      - all days of the week (monday, tuesday, ..., sunday)
  - [ ] dietaryRestrictions
    - [String]
    - default: []
  - [ ] partner
    - ObjectId
    - Required
    - ref: "Partner"
  - [ ] createdBy
    - ObjectId
    - Required
    - ref: "Admin"

### Delivery

- [ ] Define schema
  - [ ] deliveryDate
    - Data
    - Required
  - [ ] status
    - String
    - Required
    - enum
      - preparing
      - cancelled
      - rescheduled
      - completed
  - [ ] dietaryRestrictions
    - [String]
    - default: []
  - [ ] deliveredFor
    - ObjectId
    - Required
    - ref: "Member"
  - [ ] representative
    - ObjectId
    - default: null
    - ref: "Caregiver"
  - [ ] deliveredBy
    - ObjectId
    - Required
    - ref: "Volunteer"
  - [ ] partner
    - ObjectId
    - Required
    - ref: "Partner"
  - [ ] comment
    - String
    - default: ""

### Donation

- [ ] Define schema
  - [ ] donorName
    - String
    - default: "anonymous"
  - [ ] donationType
    - String
    - Required
    - enum
      - oneTime
      - weekly
      - monthly
      - quarterly
      - annual
  - [ ] amount
    - Number
    - Required
  - [ ] contactNumber
    - String
    - default: ""
  - [ ] emailAddress
    - String
    - Required
    - Custom validation for email
  - [ ] paymentMethod
    - String
    - Required
    - enum
      - cash
      - check
      - debit
      - credit
      - paypal
  - [ ] comment
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
