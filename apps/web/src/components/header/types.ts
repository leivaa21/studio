export interface SubLinkType {
  name: string;
  href: string;
}

export interface HeaderLinkType {
  page: string;
  href: string;
  subLinks: SubLinkType[];
}
