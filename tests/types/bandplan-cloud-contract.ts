/**
 * Compile-time contract tests for the browser-facing cloud API.
 * WHY: catch accidental API/type drift without executing or bundling this file.
 */
export function verifyBandPlanCloudContract(cloud: BandPlanCloudRuntime): void {
  if (cloud.subscribe) {
    cloud.subscribe(
      (state, updatedAt) => {
        const stateSnapshot: Record<string, unknown> = state;
        const timestamp: string | undefined = updatedAt;
        void stateSnapshot;
        void timestamp;
      },
      (change) => {
        const eventId: string = change.event_id;
        const userId: string = change.user_id;
        const status: string = change.status;
        const updatedAt: string = change.updated_at;
        void eventId;
        void userId;
        void status;
        void updatedAt;
      }
    );
  }

  if (cloud.setEventParticipation) {
    const saved = cloud.setEventParticipation('event-id', 'yes');
    void saved;
  }

  if (cloud.queueEventParticipation) {
    const queued = cloud.queueEventParticipation('event-id', 'maybe');
    void queued;
  }
}
