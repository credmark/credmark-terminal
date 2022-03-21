export interface ICarouselItem {
  title: string;
  description: string;
  lists: {
    text: string;
    icon: JSX.Element;
  }[];
  isAccess: boolean;
  isBackground: boolean;
}
