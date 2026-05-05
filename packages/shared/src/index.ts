export type ServiceHealth = {
  status: "ok" | "degraded" | "down";
  service: string;
};

