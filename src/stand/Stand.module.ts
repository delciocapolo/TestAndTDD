import { PrismaClient } from "@prisma/client";

interface IProvider {
  id?: number;
  name: string;
  email: string;
  adressBank: string;
}

interface ICar {
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

interface IBuyer {
  id?: number;
  name: string;
  email: string;
  countCar?: number;
  saled?: boolean;
  carId: string;
}

interface ISoldCar {
  providerId: number;
  carId: string;
  buyerId: number;
}

class Stand {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async createProvider({ name, email, adressBank }: IProvider) {
    const data: IProvider = {
      name,
      email,
      adressBank,
    };
    const provider = await this.prisma["provider"].create({
      data,
    });

    console.log(provider);
  }

  async createCar({
    name,
    model,
    releaseAt = new Date().getFullYear().toString(),
    price,
    description,
    providerId,
  }: ICar) {
    const provider = await this.prisma["provider"].findUnique({
      where: {
        id: providerId,
      },
    });

    if (provider === null) {
      throw new Error("The Provider don't exists!");
    }

    const { id } = provider!;

    const car = await this.prisma["car"].create({
      data: {
        name,
        model,
        releaseAt,
        price,
        description,
        providers: {
          connect: {
            id,
          },
        },
      },
    });

    console.log(car);
  }

  async createBuyer({
    name,
    email,
    saled = false,
    countCar = 1,
    carId,
  }: IBuyer) {
    // by renaming sale to saleCar
    const car = await this.prisma["car"].findUnique({
      where: {
        numberPlate: carId,
      },
    });

    if (car === null) {
      throw new Error("Car don't exists!");
    }

    const { sold, sale: saleCar, numberPlate } = car!;

    if (sold) {
      throw new Error("The car was sold!");
    }

    if (saled === true && saleCar === false) {
      throw new Error(
        "The is not on sale, so the buyer should not be discounted!"
      );
    }

    const buyer = await this.prisma["buyer"].create({
      data: {
        name,
        email,
        countCar,
        saled,
        cars: {
          connect: {
            numberPlate,
          },
        },
      },
    });

    console.log(buyer);
  }

  async promoteCar({
    sale = true,
    discountAmount,
    numberPlate,
  }: Pick<ICar, "sale" | "discountAmount" | "numberPlate">) {
    // check if car exists
    const availableCar = await this.prisma["car"].findUnique({
      where: {
        numberPlate,
      },
    });

    if (availableCar === null) {
      throw new Error("The Car don't exists!");
    }

    const updatedCar = await this.prisma["car"].update({
      data: {
        sale,
        discountAmount,
      },
      where: {
        numberPlate,
      },
    });

    console.log(updatedCar);
  }

  async sellCar({ carId, buyerId }: ISoldCar) {
    const car = await this.prisma["car"].findUnique({
      where: {
        numberPlate: carId,
      },
    });
    const buyer = await this.prisma["buyer"].findUnique({
      where: {
        id: buyerId,
      },
    });

    if (car === null || buyer === null) {
      const tbl_verified = car === null ? car : buyer;

      throw new Error(`This ${tbl_verified} don't exists!`);
    }

    const sellCar = await this.prisma["soldCar"].create({
      data: {
        buyerId,
        carId,
      },
    });

    const soldCar = await this.prisma["car"].update({
      data: {
        sold: true,
      },
      where: {
        numberPlate: carId,
      },
    });

    console.log({ soldCar, sellCar });
  }
}

export default new Stand();
