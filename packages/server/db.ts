import { db } from './db/connection';
import { Category } from './types.js';

const pool = db.getPool();

export async function storeEntry(category: Category, entities: Record<string, any>) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Store in general_entries table
    const generalEntryQuery = `
      INSERT INTO public.general_entries (entry_date, description, category)
      VALUES ($1, $2, $3)
    `;
    await client.query(generalEntryQuery, [new Date(), entities.description || '', category]);

    // Store in category-specific table
    let categoryQuery = '';
    let categoryValues: any[] = [];

    switch (category) {
      case 'financial':
        categoryQuery = `
          INSERT INTO public.financial (entry_date, description, amount, direction, payment_method)
          VALUES ($1, $2, $3, $4, $5)
        `;
        categoryValues = [
          new Date(),
          entities.description || '',
          entities.amount || 0,
          entities.direction || '',
          entities.payment_method || '',
        ];
        break;
      case 'health and well-being':
        categoryQuery = `
          INSERT INTO public.health_wellbeing (entry_date, activity_type, duration, intensity, meal_description, calories, emotion_description, emotion_intensity, trigger, medical_appointment_date, specialty, consultation_reason, recommendations)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `;
        categoryValues = [
          new Date(),
          entities.activity_type || '',
          entities.duration || null,
          entities.intensity || '',
          entities.meal_description || '',
          entities.calories || null,
          entities.emotion_description || '',
          entities.emotion_intensity || null,
          entities.trigger || '',
          entities.medical_appointment_date || null,
          entities.specialty || '',
          entities.consultation_reason || '',
          entities.recommendations || '',
        ];
        break;
      case 'work/projects':
        categoryQuery = `
          INSERT INTO public.work_projects (entry_date, task_description, task_status, priority, meeting_date, participants, topics_discussed, decisions_made, progress_report, obstacles_faced)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        categoryValues = [
          new Date(),
          entities.task_description || '',
          entities.task_status || '',
          entities.priority || '',
          entities.meeting_date || null,
          entities.participants || '',
          entities.topics_discussed || '',
          entities.decisions_made || '',
          entities.progress_report || '',
          entities.obstacles_faced || '',
        ];
        break;
      case 'relationships':
        categoryQuery = `
          INSERT INTO public.relationships (entry_date, person, interaction_type, interaction_description, feelings, event_date, event_description, emotional_impact, conflict_description, resolution)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        categoryValues = [
          new Date(),
          entities.person || '',
          entities.interaction_type || '',
          entities.interaction_description || '',
          entities.feelings || '',
          entities.event_date || null,
          entities.event_description || '',
          entities.emotional_impact || '',
          entities.conflict_description || '',
          entities.resolution || '',
        ];
        break;
      case 'goals/progress':
        categoryQuery = `
          INSERT INTO public.goals_progress (goal_start_date, goal_end_date, goal_description, status, milestones, progress)
          VALUES ($1, $2, $3, $4, $5, $6)
        `;
        categoryValues = [
          entities.goal_start_date || null,
          entities.goal_end_date || null,
          entities.goal_description || '',
          entities.status || '',
          entities.milestones || '',
          entities.progress || '',
        ];
        break;
    }

    if (categoryQuery) {
      await client.query(categoryQuery, categoryValues);
    }

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
