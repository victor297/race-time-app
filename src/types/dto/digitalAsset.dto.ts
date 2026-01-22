export interface DigitalAssetMetadata {
  [key: string]: any;
}

export interface DigitalAssetAssetDto {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUri: string | null;
  type: string;
  metadata: DigitalAssetMetadata;
  createdAt: string;
}

export interface DigitalAssetUserDto {
  id: string;
  firstName: string;
  lastName: string;
}

export interface DigitalAssetEventDto {
  id: string;
  eventTitle: string;
}

export interface DigitalAssetDto {
  id: string;
  asset: DigitalAssetAssetDto;
  user: DigitalAssetUserDto;
  registration: string;
  event: DigitalAssetEventDto;
  status: "allocated" | "claimed" | "pending" | string;
  notes: string | null;
  allocatedAt: string;
}
