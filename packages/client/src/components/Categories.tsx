import React from "react";
import { WebSocketMessage } from "@ai-jrnl/server/types";

export const FinancialCategory: React.FC<{ message: WebSocketMessage }> = ({
  message,
}) => (
  <>
    {message.entities?.amount !== undefined && (
      <span>
        {" "}
        | Amount: $
        {typeof message.entities?.amount === "number"
          ? message.entities?.amount.toFixed(2)
          : Number(message.entities?.amount).toFixed(2)}
      </span>
    )}
    {message.type && <span> | Type: {message.type}</span>}
    {message.entities?.payment_method && (
      <span> | Payment Method: {message.entities?.payment_method}</span>
    )}
  </>
);

export const HealthCategory: React.FC<{ message: WebSocketMessage }> = ({
  message,
}) => (
  <>
    {message.entities?.activity_type && (
      <span> | Activity: {message.entities?.activity_type}</span>
    )}
    {message.entities?.duration && (
      <span> | Duration: {message.entities?.duration}</span>
    )}
    {message.entities?.intensity && (
      <span> | Intensity: {message.entities?.intensity}</span>
    )}
  </>
);
