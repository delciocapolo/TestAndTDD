export interface IProvider {
  id?: number;
  name: string;
  email: string;
  adressBank: string;
}

export interface ICar {
  numberPlate?: string;
  name: string;
  model: string;
  releaseAt?: string;
  price: number;
  description?: string;
  // notes for update function
  sold?: boolean;
  sale?: boolean;
  discountAmount?: number;
  // relation tables
  providerId: number;
}

export interface IBuyer {
  id?: number;
  name: string;
  email: string;
  countCar?: number;
  saled?: boolean;
  carId: string;
}

export interface ISoldCar {
  carId: string;
  buyerId: number;
}

export type IPromoteCar = Pick<ICar, "sale" | "discountAmount" | "numberPlate">;
