export interface Site {
  id: string;
  name: string;
  description: string;
  url: string;
  logo: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
}
