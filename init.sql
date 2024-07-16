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
    direction VARCHAR(50) NOT NULL, -- "in" or "out"
    payment_method VARCHAR(50),
    CONSTRAINT chk_financial_direction CHECK (direction IN ('in', 'out'))
);

-- Health and Well-being Table
CREATE TABLE health_wellbeing (
    id SERIAL PRIMARY KEY,
    entry_date DATE NOT NULL,
    activity_type VARCHAR(50),
    duration INTERVAL,
    intensity VARCHAR(50),
    emotion_description TEXT,
    CONSTRAINT chk_health_activity_type CHECK (activity_type IN ('exercise', 'meditation', 'other')),
CONSTRAINT chk_health_intensity CHECK (intensity IN ('low', 'medium', 'high')),
CONSTRAINT chk_health_emotion_intensity CHECK (emotion_intensity BETWEEN 1 AND 10)
);

-- Relationships Table
CREATE TABLE relationships (
    id SERIAL PRIMARY KEY,
    entry_date DATE NOT NULL,
    person TEXT,
    interaction_type VARCHAR(50),
    feelings TEXT,
    CONSTRAINT chk_interaction_type CHECK (interaction_type IN ('conversation', 'activity', 'other'))
);

-- Indexes for faster queries
CREATE INDEX idx_general_entries_date ON general_entries(entry_date);
CREATE INDEX idx_financial_date ON financial(entry_date);
CREATE INDEX idx_health_wellbeing_date ON health_wellbeing(entry_date);
CREATE INDEX idx_relationships_date ON relationships(entry_date);