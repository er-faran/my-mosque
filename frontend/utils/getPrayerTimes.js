// utils/getPrayerTimes.js

export async function getPrayerTimes(lat, long) {
  const res = await fetch(
    `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${long}&method=2`
  );
  const data = await res.json();
  return data.data.timings;
}
