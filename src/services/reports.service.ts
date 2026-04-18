export const generateCaseSummaryReport = async (params: any) => {
  console.log("Mocking POST /api/reports/case-summary", params);
  alert("Simulating PDF Generation via pdfkit... Report successfully triggered.");
};

export const generateRiskDistributionReport = async (params: any) => {
  console.log("Mocking POST /api/reports/risk-distribution", params);
  alert("Simulating CSV Generation via csv-stringify... Report successfully triggered.");
};

export const generateAnalystPerformanceReport = async (params: any) => {
  console.log("Mocking POST /api/reports/analyst-performance", params);
  alert("Simulating Performance Generation... Report successfully triggered.");
};

export const generateAuditPreparationReport = async (params: any) => {
  console.log("Mocking POST /api/reports/audit-preparation", params);
  alert("Simulating Audit Export... Report successfully triggered.");
};

export const generateAlertVolumeReport = async (params: any) => {
  console.log("Mocking POST /api/reports/alert-volume", params);
  alert("Simulating Alert Trace Export... Report successfully triggered.");
};
