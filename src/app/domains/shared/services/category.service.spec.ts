import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from "@ngneat/spectator/jest";

import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();

import { environment } from "@env/environment";

import { CategoryService } from "./category.service";

import { generateFakeCategory } from "../models/category.mock";
import { Category } from "../models/category.model";

describe("CategoryService", () => {
  let spectator: SpectatorHttp<CategoryService>;
  const createHttp = createHttpFactory(CategoryService);

  beforeEach(() => {
    spectator = createHttp();
    fetchMock.resetMocks();
  });

  describe("getAll", () => {
    const url = `${environment.apiUrl}/api/v1/categories`;

    it("should get all categories successfully", () => {
      const fakeCategories = [generateFakeCategory(), generateFakeCategory()];

      spectator.service.getAll().subscribe((categories) => {
        expect(categories).toEqual(fakeCategories);
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(fakeCategories);
    });

    it("should handle empty categories array", () => {
      spectator.service.getAll().subscribe((categories) => {
        expect(categories).toEqual([]);
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush([]);
    });

    it("should handle error when getting categories", () => {
      const errorMessage = "Server error";

      spectator.service.getAll().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe(errorMessage);
        },
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(null, { status: 500, statusText: errorMessage });
    });
  });

  describe("getAllPromise", () => {
    const url = `${environment.apiUrl}/api/v1/categories`;

    it("should resolve with categories", async () => {
      const fakeCategories = [generateFakeCategory(), generateFakeCategory()];

      // Mock global fetch
      fetchMock.mockResponseOnce(JSON.stringify(fakeCategories));

      const result = await spectator.service.getAllPromise();
      expect(result).toEqual(fakeCategories);
      expect(fetch).toHaveBeenCalledWith(url);
    });

    it("should resolve with empty array", async () => {
      const fakeCategories: Category[] = [];

      // Mock global fetch
      fetchMock.mockResponseOnce(JSON.stringify(fakeCategories));

      const result = await spectator.service.getAllPromise();
      expect(result).toEqual([]);
      expect(fetch).toHaveBeenCalledWith(url);
    });

    it("should reject on fetch error", async () => {
      const errorMessage = "Network Error";

      // Mock global fetch to throw error
      fetchMock.mockRejectOnce(new Error(errorMessage));

      await expect(spectator.service.getAllPromise()).rejects.toThrow(
        errorMessage,
      );

      expect(fetch).toHaveBeenCalledWith(url);
    });

    it("should reject on invalid JSON", async () => {
      // Mock global fetch with invalid JSON
      fetchMock.mockResponseOnce("Invalid JSON");

      await expect(spectator.service.getAllPromise()).rejects.toThrow(
        "Invalid JSON",
      );

      expect(fetch).toHaveBeenCalledWith(url);
    });
  });
});
