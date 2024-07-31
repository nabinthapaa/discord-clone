export function getDate(yearsFromNow: number) {
  const currentDate = new Date();
  const pastYear = currentDate.getFullYear() - yearsFromNow;

  return new Date(
    `${pastYear}/${currentDate.getMonth()}/${currentDate.getDay()}`,
  );
}
