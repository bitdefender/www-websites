import{createEnvelope as r}from"./envelope.js";import{dateTimestampInSeconds as p}from"./time.js";function c(t,e,m){const o=[{type:"client_report"},{timestamp:p(),discarded_events:t}];return r(e?{dsn:e}:{},[o])}export{c as createClientReportEnvelope};
//# sourceMappingURL=clientreport.js.map
