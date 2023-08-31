import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ListProductUseCase from "./list.product.usecase";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";

describe("Test list product use case", () => {
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

    it("should list products", async () => {
        const productRepository = new ProductRepository();

        const creteProductUseCase = new CreateProductUseCase(productRepository);

        const input1 = {
            name: "Product 1",
            price: 10
        };

        const input2 = {
            name: "Product 2",
            price: 20
        };
    
        await creteProductUseCase.execute(input1);
        await creteProductUseCase.execute(input2);

        const listUseCase = new ListProductUseCase(productRepository);

        let result = await listUseCase.execute({});

        const output = [
            {
                id: expect.any(String),
                name: "Product 1",
                price: 10 
            },
            {
                id: expect.any(String),
                name: "Product 2",
                price: 20 
            }
        ];

        expect(result.products).toEqual(output);
    });
});
