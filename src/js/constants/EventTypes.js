var EventTypes = {};
[
  "CONFIG_LOADED",
  "CONFIG_ERROR",
  "DCOS_METADATA_CHANGE",
  "INTERCOM_CHANGE",
  "MARATHON_APPS_CHANGE",
  "MARATHON_APPS_ERROR",
  "MESOS_SUMMARY_CHANGE",
  "MESOS_SUMMARY_REQUEST_ERROR",
  "MESOS_STATE_CHANGE",
  "MESOS_STATE_REQUEST_ERROR",
  "METADATA_CHANGE",
  "PLUGINS_CONFIGURED",
  "SHOW_CLI_INSTRUCTIONS",
  "SHOW_TOUR",
  "SHOW_VERSIONS_SUCCESS",
  "SHOW_VERSIONS_ERROR",
  "SIDEBAR_CHANGE",
  "TASK_DIRECTORY_CHANGE",
  "TASK_DIRECTORY_ERROR",
  "USER_DETAILS_FETCHED_SUCCESS",
  "USER_DETAILS_FETCHED_ERROR",
  "USER_DETAILS_USER_CHANGE",
  "USER_DETAILS_USER_ERROR",
  "USER_DETAILS_GROUPS_CHANGE",
  "USER_DETAILS_GROUPS_ERROR",
  "USER_DETAILS_PERMISSIONS_CHANGE",
  "USER_DETAILS_PERMISSIONS_ERROR"
].forEach(function (eventType) {
  EventTypes[eventType] = eventType;
});

module.exports = EventTypes;
