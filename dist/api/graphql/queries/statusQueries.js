export function statusByServices(mu) {
    return `
  query ${mu}Status {
    ${mu}Hello
    ${mu}Version
    ${mu}RequestCounter
    ${mu}Heartbeat {
    heartbeat
    interval
    lastPing
    maxTimeOut
    timeOut
    timeOutCount
  }
  }
`;
}
