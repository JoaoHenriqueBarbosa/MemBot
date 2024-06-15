import React from 'react';
import { WebSocketMessage } from "@ai-jrnl/server/types";

export const FinancialCategory: React.FC<{ message: WebSocketMessage }> = ({ message }) => (
  <>
    {message.amount !== undefined && <span> | Amount: ${Number(message.amount).toFixed(2)}</span>}
    {message.type && <span> | Type: {message.type}</span>}
    {message.payment_method && <span> | Payment Method: {message.payment_method}</span>}
  </>
);

export const HealthCategory: React.FC<{ message: WebSocketMessage }> = ({ message }) => (
  <>
    {message.activity_type && <span> | Activity: {message.activity_type}</span>}
    {message.duration && <span> | Duration: {message.duration}</span>}
    {message.intensity && <span> | Intensity: {message.intensity}</span>}
  </>
);
