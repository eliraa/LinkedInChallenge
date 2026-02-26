import { APIRequestContext, APIResponse, expect } from "@playwright/test";
import { urls } from "../../config/test-data";

type ProductSummary = {
  id: string;
  name: string;
  in_stock: boolean;
  is_rental: boolean;
};

type ProductsResponse = {
  data: ProductSummary[];
};

export type ProductDetails = {
  id: string;
  name: string;
  price: number;
};

export class ProductsApi {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async fetchProductsList(): Promise<APIResponse> {
    return this.request.get(`${urls.apiBaseUrl}/products`, {
      params: {
        page: 1,
        between: "price,1,100",
        is_rental: false,
      },
    });
  }

  async getValidProductId(): Promise<string> {
    const listResponse = await this.fetchProductsList();
    expect(listResponse.status()).toBe(200);

    const listData = (await listResponse.json()) as ProductsResponse;
    const currentProduct = listData.data.find(
      (product) => product.in_stock && !product.is_rental
    );
    expect(currentProduct, "No suitable product returned by /products").toBeTruthy();
    return currentProduct!.id;
  }

  async fetchProductById(id: string): Promise<APIResponse> {
    return this.request.get(`${urls.apiBaseUrl}/products/${id}`);
  }

  async getProductById(id: string): Promise<ProductDetails> {
    const detailsResponse = await this.fetchProductById(id);
    expect(detailsResponse.status()).toBe(200);
    return (await detailsResponse.json()) as ProductDetails;
  }
}
