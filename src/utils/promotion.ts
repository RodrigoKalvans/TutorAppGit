/**
 * Frontend check for user's last donation
 * @param {Array<any>} donations User's donation
 * @param {number} days Range used for the check. By default it is 30 days
 * @return {bool}
 */
export const isPromoted = (donations: Array<any>, days = 30) => {
  if (!donations || donations.length == 0) return false;

  const latestDonation = donations!.at(0); // TODO change this to go off of donations
  const timeOfLastDonation = latestDonation.date;

  const now = new Date();
  const d = new Date(timeOfLastDonation);

  const differenceInMs = now.getTime() - d.getTime(); // milliseconds
  const differenceInDays = differenceInMs / (1000 * 3600 * 24); // days

  if (differenceInDays <= days) return true;

  return false;
};
