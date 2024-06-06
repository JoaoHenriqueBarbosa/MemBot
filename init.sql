-- Create the database
CREATE DATABASE ai_jrnl;

-- Connect to the database
\c ai_jrnl;

-- General Entries Table
CREATE TABLE general_entries (
    id SERIAL PRIMARY KEY,
    entry_date DATE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL
);

-- Financial Table
CREATE TABLE financial (
    id SERIAL PRIMARY KEY,
    entry_date DATE NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(50) NOT NULL, -- "income" or "expense"
    payment_method VARCHAR(50),
    CONSTRAINT chk_financial_type CHECK (type IN ('income', 'expense'))
);

-- Health and Well-being Table
CREATE TABLE health_wellbeing (
    id SERIAL PRIMARY KEY,
    entry_date DATE NOT NULL,
    activity_type VARCHAR(50),
    duration INTERVAL,
    intensity VARCHAR(50),
    meal_description TEXT,
    calories INT,
    emotion_description TEXT,
    emotion_intensity INT,
    trigger TEXT,
    medical_appointment_date DATE,
    specialty VARCHAR(50),
    consultation_reason TEXT,
    recommendations TEXT,
    CONSTRAINT chk_health_activity_type CHECK (activity_type IN ('exercise', 'meditation', 'other')),
CONSTRAINT chk_health_intensity CHECK (intensity IN ('low', 'medium', 'high')),
CONSTRAINT chk_health_emotion_intensity CHECK (emotion_intensity BETWEEN 1 AND 10)
);

-- Work/Projects Table
CREATE TABLE work_projects (
    id SERIAL PRIMARY KEY,
    entry_date DATE NOT NULL,
    task_description TEXT,
    task_status VARCHAR(50), -- "pending", "in_progress", "completed"
    priority VARCHAR(50),
    meeting_date DATE,
    participants TEXT,
    topics_discussed TEXT,
    decisions_made TEXT,
    progress_report TEXT,
    obstacles_faced TEXT,
    CONSTRAINT chk_task_status CHECK (task_status IN ('pending', 'in_progress', 'completed')),
CONSTRAINT chk_priority CHECK (priority IN ('low', 'medium', 'high'))
);

-- Relationships Table
CREATE TABLE relationships (
    id SERIAL PRIMARY KEY,
    entry_date DATE NOT NULL,
    person TEXT,
    interaction_type VARCHAR(50),
    interaction_description TEXT,
    feelings TEXT,
    event_date DATE,
    event_description TEXT,
    emotional_impact TEXT,
    conflict_description TEXT,
    resolution TEXT,
    CONSTRAINT chk_interaction_type CHECK (interaction_type IN ('conversation', 'activity', 'other'))
);

-- Goals and Progress Table
CREATE TABLE goals_progress (
    id SERIAL PRIMARY KEY,
    goal_start_date DATE,
    goal_end_date DATE,
    goal_description TEXT,
    status VARCHAR(50),
    milestones TEXT,
    progress TEXT,
    CONSTRAINT chk_goal_status CHECK (status IN ('not_started', 'in_progress', 'completed', 'abandoned'))
);

-- Indexes for faster queries
CREATE INDEX idx_general_entries_date ON general_entries(entry_date);
CREATE INDEX idx_financial_date ON financial(entry_date);
CREATE INDEX idx_health_wellbeing_date ON health_wellbeing(entry_date);
CREATE INDEX idx_work_projects_date ON work_projects(entry_date);
CREATE INDEX idx_relationships_date ON relationships(entry_date);
CREATE INDEX idx_goals_progress_start_date ON goals_progress(goal_start_date);