export type CostTag = "free" | "paid" | "freemium";
export type ExpTag = "no-login";

export interface Site {
  id: string;
  name: string;
  description: string;
  url: string;
  logo: string;
  category: string;
  tags: {
    cost?: CostTag;
    exp?: any[];
    speed?: any[];
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
}

export interface TagOption {
  id: string;
  label: string;
  group: string;
  color: string;
}
