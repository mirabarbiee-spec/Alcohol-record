# Security Specification - HandRub Tracker

## 1. Data Invariants
- A `Station` must have a `name`, `areaType`, `expirationDate`, and `currentVolume`.
- `currentVolume` cannot exceed `initialVolume` (max 1000ml, standard 500ml).
- `usageLogs` must be created whenever `currentVolume` of a `Station` changes.
- `usageAmount` in `usageLogs` must equal `previousVolume - currentVolume`.
- Users must be authenticated to perform any write operation (as per "optional admin" but for security we enforce auth for writes).
- Reads are allowed for everyone (public links) to see the dashboard, but we can restrict to signed-in users if needed. The request said "No login required (access via direct link)", so I will allow public `read` but restricted `write`.

## 2. The "Dirty Dozen" Payloads (Denial Expected)
1. **Station Spoofing**: Creating a station with an ID like `../../poison`.
2. **Volume Overflow**: Setting `currentVolume` to 1,000,000.
3. **Negative Volume**: Setting `currentVolume` to -50.
4. **Identity Theft**: Creating a station with a hardcoded `id` that someone else might own.
5. **Shadow Field**: Adding `isVerified: true` to a station.
6. **Time Warp**: Setting `createdAt` to a date in 2030.
7. **Relational Orphan**: Creating a log for a non-existent `stationId`.
8. **Usage Lie**: Creating a log where `usageAmount` is 100 but `prev - curr` is 50.
9. **Expiration Poisoning**: Setting `expirationDate` to non-date string like "never".
10. **Admin Escalation**: Trying to write to `wardSettings` as a regular user.
11. **Bulk Delete**: Attempting to delete a station log from the root.
12. **Malicious ID**: Creating a station with a 2MB string as its name.

## 3. Test Runner Configuration
(Note: Test execution requires firebase-tools in the environment, drafting the rules based on these invariants).
