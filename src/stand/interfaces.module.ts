import { provider, car, buyer, soldCar } from "@prisma/client";

export type IProvider = Omit<provider, "id" | "updatedAt">;
export type ICar = Omit<car, "updatedAt">;
export type IBuyer = Omit<buyer, "updatedAt">;
export type ISoldCar = Omit<soldCar, "updatedAt" | "id" | "createdAt">;
export type IPromoteCar = Pick<ICar, "sale" | "discountAmount" | "numberPlate">;

// export interface IProvider {
//   id?: number;
//   name: string;
//   email: string;
// }

// export interface ICar {
//   numberPlate?: string;
//   name: string;
//   model: string;
//   releaseAt?: string;
//   price: number;
//   description?: string;
//   // notes for update function
//   sold?: boolean;
//   sale?: boolean;
//   discountAmount?: number;
//   // relation tables
//   providerId: number;
// }

// export interface IBuyer {
//   id?: number;
//   name: string;
//   email: string;
//   countCar?: number;
//   saled?: boolean;
//   carId: string;
// }

// export interface ISoldCar {
//   carId: string;
//   buyerId: number;
// }
