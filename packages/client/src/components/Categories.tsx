import React from "react";
import { WebSocketMessage } from "@ai-jrnl/server/types";

export const FinancialCategory: React.FC<{ message: WebSocketMessage }> = ({
  message,
}) => (
  <>
    {message.entities?.description && (
      <span> | Description: {message.entities.description}</span>
    )}
    {message.entities?.amount !== undefined && (
      <span>
        {" "}
        | Amount: $
        {typeof message.entities?.amount === "number"
          ? message.entities?.amount.toFixed(2)
          : Number(message.entities?.amount).toFixed(2)}
      </span>
    )}
    {message.entities?.type && <span> | Type: {message.entities.type}</span>}
    {message.entities?.payment_method && (
      <span> | Payment Method: {message.entities.payment_method}</span>
    )}
  </>
);

export const HealthCategory: React.FC<{ message: WebSocketMessage }> = ({
  message,
}) => (
  <>
    {message.entities?.activity_type && (
      <span> | Activity: {message.entities.activity_type}</span>
    )}
    {message.entities?.duration && (
      <span> | Duration: {message.entities.duration}</span>
    )}
    {message.entities?.intensity && (
      <span> | Intensity: {message.entities.intensity}</span>
    )}
    {message.entities?.meal_description && (
      <span> | Meal: {message.entities.meal_description}</span>
    )}
    {message.entities?.calories && (
      <span> | Calories: {message.entities.calories}</span>
    )}
    {message.entities?.emotion_description && (
      <span> | Emotion: {message.entities.emotion_description}</span>
    )}
    {message.entities?.emotion_intensity && (
      <span> | Emotion Intensity: {message.entities.emotion_intensity}</span>
    )}
  </>
);

export const WorkProjectsCategory: React.FC<{ message: WebSocketMessage }> = ({
  message,
}) => (
  <>
    {message.entities?.task_description && (
      <span> | Task: {message.entities.task_description}</span>
    )}
    {message.entities?.task_status && (
      <span> | Status: {message.entities.task_status}</span>
    )}
    {message.entities?.priority && (
      <span> | Priority: {message.entities.priority}</span>
    )}
    {message.entities?.meeting_date && (
      <span> | Meeting Date: {message.entities.meeting_date}</span>
    )}
    {message.entities?.participants && (
      <span> | Participants: {message.entities.participants}</span>
    )}
  </>
);

export const RelationshipsCategory: React.FC<{ message: WebSocketMessage }> = ({
  message,
}) => (
  <>
    {message.entities?.person && (
      <span> | Person: {message.entities.person}</span>
    )}
    {message.entities?.interaction_type && (
      <span> | Interaction: {message.entities.interaction_type}</span>
    )}
    {message.entities?.interaction_description && (
      <span> | Description: {message.entities.interaction_description}</span>
    )}
    {message.entities?.feelings && (
      <span> | Feelings: {message.entities.feelings}</span>
    )}
    {message.entities?.event_date && (
      <span> | Date: {message.entities.event_date}</span>
    )}
  </>
);

export const GoalsProgressCategory: React.FC<{ message: WebSocketMessage }> = ({
  message,
}) => (
  <>
    {message.entities?.goal_description && (
      <span> | Goal: {message.entities.goal_description}</span>
    )}
    {message.entities?.status && (
      <span> | Status: {message.entities.status}</span>
    )}
    {message.entities?.goal_start_date && (
      <span> | Start Date: {message.entities.goal_start_date}</span>
    )}
    {message.entities?.goal_end_date && (
      <span> | End Date: {message.entities.goal_end_date}</span>
    )}
    {message.entities?.progress && (
      <span> | Progress: {message.entities.progress}</span>
    )}
  </>
);
