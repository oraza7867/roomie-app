export const CAMPUS = {
  name: "Integral University",
  short: "IUL",
  lat: 26.9586,
  lng: 80.9981,
};


export const LOCALITIES = [
  "Dasauli",
  "Kursi Road",
  "Matiyari",
  "Gudamba",
  "Jankipuram",
  "Jankipuram Extension",
  "Tedhi Pulia",
  "Aliganj",
  "Vikas Nagar",
  "Kalyanpur",
  "Bakshi Ka Talab",
  "Adil Nagar",
  "Ring Road",
] as const;

export const COURSES = [
  "B.Tech",
  "BCA",
  "MCA",
  "MBA",
  "B.Pharm",
  "M.Pharm",
  "B.Sc",
  "M.Sc",
  "BBA",
  "B.Com",
  "BA LLB",
  "B.Arch",
  "MBBS",
  "Diploma",
] as const;

export const HOSTELS = [
  "Hall 1 (Boys Hostel)",
  "Hall 2 (Boys Hostel)",
  "Hall 3 (Boys Hostel)",
  "Hall 4 (Girls Hostel)",
  "Hall 5 (Girls Hostel)",
  "Off-Campus / Day Scholar",
] as const;

export type Locality = (typeof LOCALITIES)[number];
export type Course = (typeof COURSES)[number];
export type Hostel = (typeof HOSTELS)[number];

export default CAMPUS;
