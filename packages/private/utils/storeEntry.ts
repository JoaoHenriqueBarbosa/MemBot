import { db } from "../db/connection.js";
import { Category, User } from "./types.js";

const pool = db.getPool();

export async function storeEntry(category: Category, entities: Record<string, any>, user: Partial<User>) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Store in general_entries table
    const generalEntryQuery = `
      INSERT INTO public.general_entries (entry_date, description, category, user_id)
      VALUES ($1, $2, $3, $4)
    `;
    await client.query(generalEntryQuery, [new Date(), entities.description || '', category, user.id]);

    // Store in category-specific table
    let categoryQuery = '';
    let categoryValues: any[] = [];

    switch (category) {
      case 'financial':
        categoryQuery = `
          INSERT INTO public.financial (entry_date, description, amount, direction, payment_method, user_id)
          VALUES ($1, $2, $3, $4, $5, $6)
        `;
        categoryValues = [
          new Date(),
          entities.description || '',
          entities.amount || 0,
          entities.direction || '',
          entities.payment_method || '',
          user.id,
        ];
        break;
      case 'health and well-being':
        categoryQuery = `
          INSERT INTO public.health_wellbeing (entry_date, activity_type, duration, intensity, emotion_description, emotion_intensity, user_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        categoryValues = [
          new Date(),
          entities.activity_type || '',
          entities.duration || null,
          entities.intensity || '',
          entities.emotion_description || '',
          entities.emotion_intensity || null,
          user.id,
        ];
        break;
      case 'work/projects':
        categoryQuery = `
          INSERT INTO public.work_projects (entry_date, task_description, task_status, priority, meeting_date, participants, topics_discussed, decisions_made, progress_report, obstacles_faced, user_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
          user.id,
        ];
        break;
      case 'relationships':
        categoryQuery = `
          INSERT INTO public.relationships (entry_date, person, interaction_type, feelings, user_id)
          VALUES ($1, $2, $3, $4, $5)
        `;
        categoryValues = [
          new Date(),
          entities.person || '',
          entities.interaction_type || '',
          entities.feelings || '',
          user.id,
        ];
        break;
      case 'goals/progress':
        categoryQuery = `
          INSERT INTO public.goals_progress (goal_start_date, goal_end_date, goal_description, status, milestones, progress, user_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        categoryValues = [
          entities.goal_start_date || null,
          entities.goal_end_date || null,
          entities.goal_description || '',
          entities.status || '',
          entities.milestones || '',
          entities.progress || '',
          user.id,
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
