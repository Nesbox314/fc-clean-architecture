import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import UpdateProductUseCase from "./update.product.usecase";

describe("Test update product use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should update product", async () => {
        const productRepository = new ProductRepository();
        const creteProductUseCase = new CreateProductUseCase(productRepository);

        const input = {
            name: "Product 1",
            price: 10
        };
    
        let product = await creteProductUseCase.execute(input);
        product.name = "Product Updated";

        const usecase = new UpdateProductUseCase(productRepository);

        let result = await usecase.execute({
            id: product.id,
            name: product.name,
            price: product.price
        });

        const output = {
            id: expect.any(String),
            name: "Product Updated",
            price: 10 
        }

        expect(result).toEqual(output);
    });
});
