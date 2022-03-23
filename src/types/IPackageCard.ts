export interface IPackageCard {
  name: string;
  benefits: {
    icon: string;
    text: string;
    access: boolean;
  }[];
  price: number;
}
