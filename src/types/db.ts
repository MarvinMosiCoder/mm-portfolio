// types/db.ts
export type DBProfile = {
  id: string;
  slug: string;
  name: string;
  title: string;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  linkedin: string | null;
  profile_text: string | null;
};

export type DBExperience = {
  id: string;
  profile_id: string;
  company: string;
  role: string;
  time: string;
  location: string | null;
  sort_order: number | null;
};

export type DBExperienceBullet = {
  id: string;
  experience_id: string;
  text: string;
  sort_order: number | null;
};

export type DBEducation = {
  id: string;
  profile_id: string;
  degree: string;
  school: string;
  time: string;
  location: string | null;
  sort_order: number | null;
};

export type DBSkill = {
  id: string;
  profile_id: string;
  name: string;
  sort_order: number | null;
};

export type DBLanguage = {
  id: string;
  profile_id: string;
  name: string;
  level_dots: number;
};

export type DBAward = {
  id: string;
  profile_id: string;
  title: string;
  org: string;
  time: string;
  sort_order: number | null;
};
