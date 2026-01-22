import { IAchievementItem } from "./achievement";
import { IPhotoItem } from "./photo";
import { IRaceItem } from "./race";
import { IProfileProps } from "./user";

export interface IRaceProfileProps {
  profile: IProfileProps;
  photos: IPhotoItem;
  race: IRaceItem;
  barges: IAchievementItem;
  trophies: IAchievementItem;
}
