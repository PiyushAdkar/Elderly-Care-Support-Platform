# Elder Companion AI Platform — MongoDB Schema

## Collection Relationships

```
User (1)
  │
  ├──< Medicine          (userId → User._id)
  ├──< Contact           (userId → User._id)
  ├──< Appointment       (userId → User._id, doctorId → Contact._id)
  ├──< Activity          (userId → User._id)  [unique per day]
  ├──< Document          (userId → User._id, uploadedBy → User._id,
  │                        relatedAppointmentId → Appointment._id)
  └──< SosLog            (userId → User._id, resolvedBy → User._id)
```

All relationships are **references** (not embedded), keeping documents lean
and enabling independent querying of each collection.

---

## Indexes Summary

| Collection  | Index                              | Purpose                                  |
|-------------|------------------------------------|------------------------------------------|
| User        | email (unique), phone (unique)     | Login / dedup lookup                     |
| User        | role                               | Filter elders vs caretakers              |
| Medicine    | userId + status                    | Active meds list per user                |
| Medicine    | userId + name                      | Med name search                          |
| Contact     | userId + type                      | Filter doctors / family                  |
| Appointment | userId + date                      | Upcoming appointments                    |
| Appointment | date                               | Global reminder scheduler                |
| Activity    | userId + date (unique)             | One record per user per day              |
| Document    | userId + type                      | Filter by document category              |
| Document    | userId + uploadedAt (desc)         | Recent documents                         |
| SosLog      | location (2dsphere)                | Geospatial queries                       |
| SosLog      | userId + timestamp (desc)          | SOS history per user                     |
| SosLog      | status + timestamp (desc)          | Monitor active / unresolved SOS events   |

---

## Usage in Express

```js
const mongoose = require("mongoose");
const { User, Medicine, SosLog } = require("./models");

// Connect
await mongoose.connect(process.env.MONGO_URI);

// Example: get active medicines for a user
const meds = await Medicine.find({ userId, status: "active" })
                           .sort({ name: 1 });

// Example: get latest SOS log with location
const sos = await SosLog.findOne({ userId })
                         .sort({ timestamp: -1 })
                         .populate("resolvedBy", "name phone");
```
