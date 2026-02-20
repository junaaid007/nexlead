# NexLead CRM

A lightweight, modern SaaS CRM focused on sales productivity and revenue visibility. Built with React, Tailwind CSS, Node.js, Express, and PostgreSQL.

**Created by Junaid Mansoor**

## Features

### Lead Management
- Add, edit, and delete leads
- Comprehensive lead details: name, email, phone, company, role, lead source
- Deal value and MRR tracking
- Trial period management with start/end dates
- Quick notes and interaction history

### Sales Pipeline
- Visual Kanban board with 7 stages: New → Contacted → Trial Started → Trial Expiring → Interested → Converted → Lost
- Quick stage updates via dropdown or click-to-advance
- Stage filtering and statistics
- Color-coded lead cards by priority

### Lead Scoring & Priority
- Automatic High/Medium/Low priority assignment
- Color-coded badges for quick identification
- Priority-based filtering

### Follow-ups & Next Actions
- Track next actions (call, email, demo, etc.)
- Due date tracking with overdue highlighting
- Overdue follow-ups dashboard alert

### Revenue & MRR Tracking
- Automatic MRR calculation for converted leads
- Total MRR, Potential MRR, and ARR forecast
- Top 10 high-MRR customers list
- Revenue breakdown and conversion stats

### Conversion Analytics
- Sales funnel visualization
- Conversion rates per stage
- Lead source ROI analysis
- Pipeline value tracking

### Elegant UX/UI
- Clean, minimalist design with professional color palette
- Fully responsive and mobile-friendly
- Smooth micro-interactions and animations
- Quick-add and quick-update forms

## Tech Stack

- **Frontend:** React 18, Tailwind CSS, Recharts, React Router, Axios, Lucide React
- **Backend:** Node.js, Express, PostgreSQL (pg)
- **Database:** PostgreSQL 14+

## Project Structure

```
saas-crm/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── leadsController.js
│   │   ├── models/
│   │   │   └── leadModel.js
│   │   ├── routes/
│   │   │   ├── leads.js
│   │   │   └── analytics.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Analytics.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LeadCard.jsx
│   │   │   ├── LeadDetail.jsx
│   │   │   ├── LeadForm.jsx
│   │   │   ├── LeadsTable.jsx
│   │   │   ├── MRRDashboard.jsx
│   │   │   ├── Navigation.jsx
│   │   │   └── Pipeline.jsx
│   │   ├── hooks/
│   │   │   └── useLeads.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── calculations.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── database/
    └── schema.sql
```

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### 1. Database Setup

```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE saas_crm;
\q

# Run schema script
psql -U postgres -d saas_crm -f database/schema.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your database credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saas_crm
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
FRONTEND_URL=http://localhost:5173

# Start development server
npm run dev
```

The backend will run on http://localhost:5000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The frontend will run on http://localhost:5173

## Usage

### Dashboard
- View key metrics: Total MRR, Potential MRR, ARR, Total Leads
- See overdue follow-ups at a glance
- Quick access to top MRR customers

### Leads
- View all leads in a sortable, filterable table
- Search by name, email, or company
- Filter by stage, priority, or lead source
- Quick stage updates via dropdown
- Add, edit, or delete leads

### Pipeline
- Visual Kanban board of all leads
- Click stage badges to advance leads
- Filter by specific stages
- View stage statistics

### Analytics
- Sales funnel visualization
- Lead source ROI analysis
- Conversion rate tracking
- Pipeline value breakdown

### Revenue
- MRR and ARR tracking
- Top 10 customers by MRR
- Revenue breakdown charts
- Conversion statistics

## API Endpoints

### Leads
- `GET /api/leads` - Get all leads (with optional filters)
- `GET /api/leads/:id` - Get single lead
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `PATCH /api/leads/:id/stage` - Update lead stage
- `GET /api/leads/sources` - Get all lead sources
- `GET /api/leads/overdue-followups` - Get overdue follow-ups
- `GET /api/leads/top-mrr` - Get top MRR leads
- `POST /api/leads/:id/interactions` - Add interaction

### Analytics
- `GET /api/analytics/mrr` - Get MRR metrics
- `GET /api/analytics/funnel` - Get funnel data
- `GET /api/analytics/sources` - Get lead source ROI

## Database Schema

### Leads Table
```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  role VARCHAR(100),
  lead_source VARCHAR(100),
  deal_value DECIMAL(12,2) DEFAULT 0,
  mrr DECIMAL(12,2) DEFAULT 0,
  stage VARCHAR(50) DEFAULT 'New',
  priority VARCHAR(20) DEFAULT 'Medium',
  trial_start_date DATE,
  trial_end_date DATE,
  next_action VARCHAR(50),
  next_action_date DATE,
  notes TEXT,
  interaction_history JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Build for Production

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saas_crm
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
