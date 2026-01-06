// AUTO-GENERATED FILE - DO NOT EDIT
// Generated from OpenAPI spec - this is the source of truth for API coverage

/**
 * All operation IDs from the OpenAPI spec.
 * This is automatically generated and represents what endpoints exist in the API.
 */
export const specOperationIds = [
  "cancelSync",
  "getCurrentConnection",
  "getDriver",
  "getEventCameraMedia",
  "getIFTASummary",
  "getSafetyEvent",
  "getSyncJobStatus",
  "getVehicle",
  "getVehicleUtilization",
  "listConnections",
  "listDevices",
  "listDrivers",
  "listFaultCodeEvents",
  "listGroups",
  "listHOSAvailableTime",
  "listHOSDailyLogs",
  "listHOSLogs",
  "listHistoricalVehicleLocations",
  "listHistoricalVehicleStats",
  "listIssues",
  "listLatestTrailerLocations",
  "listLatestVehicleLocations",
  "listProviders",
  "listSafetyEvents",
  "listSyncHistory",
  "listTrailers",
  "listTrips",
  "listVehicles",
  "passthrough",
  "publicTokenExchange",
  "requestSync",
  "resolveIssue",
  "retrySync",
  "updateCurrentConnection",
] as const;

/** Type union of all operation IDs from the spec */
export type SpecOperationId = (typeof specOperationIds)[number];

/**
 * Expected command names derived from the OpenAPI spec.
 * Each operationId maps to a kebab-case command name.
 *
 * This is the source of truth for what CLI commands should exist.
 */
export const expectedCommandNames = [
  "cancel-sync",
  "get-current-connection",
  "get-driver",
  "get-event-camera-media",
  "get-iftasummary",
  "get-safety-event",
  "get-sync-job-status",
  "get-vehicle",
  "get-vehicle-utilization",
  "list-connections",
  "list-devices",
  "list-drivers",
  "list-fault-code-events",
  "list-groups",
  "list-historical-vehicle-locations",
  "list-historical-vehicle-stats",
  "list-hosavailable-time",
  "list-hosdaily-logs",
  "list-hoslogs",
  "list-issues",
  "list-latest-trailer-locations",
  "list-latest-vehicle-locations",
  "list-providers",
  "list-safety-events",
  "list-sync-history",
  "list-trailers",
  "list-trips",
  "list-vehicles",
  "passthrough",
  "public-token-exchange",
  "request-sync",
  "resolve-issue",
  "retry-sync",
  "update-current-connection",
] as const;

/** Type union of all expected command names */
export type ExpectedCommandName = (typeof expectedCommandNames)[number];
