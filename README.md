HCM Lite — Saylani Hackathon (Beginner Track)

A modern, responsive Human Capital Management (HCM) web application built using **pure HTML5, CSS3, and modern Vanilla JavaScript**. 

There is **no framework** and **no backend**: all data persistence is managed strictly in the browser using `localStorage`.


 🔗 Project Links

- **Live Hosted Application**: [https://hcm-lite-delta.vercel.app/](https://hcm-lite-delta.vercel.app/)
- **GitHub Repository**: [https://github.com/Muhammad-Talha745/hcm-lite](https://github.com/Muhammad-Talha745/hcm-lite)


🌟 Key Features Implemented

1. Role-Based Access Control (RBAC)
Admin:
  - **First-Run Workspace Setup**: Automatically configures the company name and root admin account on first boot.
  - **Company Settings**: Configurable office start time (e.g. `09:00`), grace period (minutes), and annual leave quota.
  - **Employee Management**: Create employees (automatically generates their login credentials), edit details, delete, search, and filter by department.
  - **Leave Approvals**: Review pending leave requests and approve/reject with custom feedback notes.
  - **Company Announcements**: Post real-time announcements broadcast to all staff.
Employee (Self-Service):
  - Personal dashboard displaying real-time check-in/out status.
  - Personal attendance history log.
  - Leave application portal with automatic working day counting.
  - View personal monthly payslip.


2. Strict Business Rules (Per Hackathon Specifications)

Attendance Business Rules:
  - Late Arrival: If check-in time exceeds `Office Start Time + Grace Period` (e.g., `09:00 + 15 min = 09:15`), attendance is automatically marked as **Late**.
  - Half Day: If total worked hours (`Check-Out - Check-In`) are less than 5 hours, the day is classified as a **Half Day**.
  - Enforcement: Only one check-in per day is allowed; check-out is only permitted after checking in.
  - Days without a log during workdays are treated as **Absent**.

Leave Business Rules:
  - `From` date must be on or before `To` date.
  - **Weekends Excluded**: Saturday and Sunday are automatically skipped when calculating leave duration.
  - **Overlap Detection**: Blocks overlapping leave requests.
  - **Quota Enforcement**: Rejects applications that exceed the employee's remaining yearly quota.

Payslip Calculation Formula:
  $$\text{Daily Rate} = \frac{\text{Monthly Salary}}{\text{Working Days in Month}}$$
  $$\text{Deduction} = \text{Daily Rate} \times (\text{Absent Days} + 0.5 \times \text{Half Days})$$
  $$\text{Net Salary} = \text{Monthly Salary} - \text{Deduction}$$


3. Smart Helper (AI Touch)

Embedded chatbot on both Admin and Employee dashboards powered by real-time DOM/localStorage keyword evaluation:

Admin Inquiries:
  - *"How many employees do we have?"* $\rightarrow$ Counts active employee users.
  - *"Who is on leave today?"* $\rightarrow$ Lists approved leaves active on current date.
  - *"Who was late today?"* $\rightarrow$ Lists employees marked late today with arrival times.
Employee Inquiries:
  - *"Was I late today?"* $\rightarrow$ Checks personal check-in timestamp against company rules.
  - *"How many leaves do I have left?"* $\rightarrow$ Computes yearly quota minus approved leaves.
  - *"How many hours did I work this week?"* $\rightarrow$ Aggregates completed work hours for the current week.


4. Bonus Features (+10 Points)

- 📷 Camera Check-In: Integrated camera preview utilizing `navigator.mediaDevices.getUserMedia()`.
- 📍 Geolocation Detection: Validates physical presence via `navigator.geolocation`.
- 📊 Visual Analytics**: Interactive attendance doughnut chart rendered using **Chart.js (CDN)**.
- 📁 CSV Attendance Export: 1-click download of all employee attendance records as a spreadsheet.
- 🌓 Dark Mode / Light Mode: Theme toggle with persistent theme selection saved to `localStorage`.
- 🖨️ Printable Monthly Payslip: Clean print/PDF export styling with hidden UI elements.


📁 Project Architecture

text
hcm-lite/
├── index.html        # First-run setup & authentication gate
├── admin.html        # Admin analytics, metrics, announcements, helper
├── employees.html    # Employee directory (CRUD & department filtering)
├── leaves.html       # Leave management workflow
├── settings.html     # Policy, grace period & quota configuration
├── employee.html     # Employee portal, camera check-in, leave apply
├── payslip.html      # Monthly payslip engine & PDF print layout
├── css/
│   └── style.css     # CSS custom properties, responsive layout & themes
├── js/
│   ├── storage.js    # LocalStorage abstraction & payroll/leave formulas
│   ├── auth.js       # Session guards & access permissions
│   └── helper.js     # AI query engine
└── README.md
