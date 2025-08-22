import { Meta, Title } from "@angular/platform-browser";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator/jest";
import { environment } from "@env/environment";
import { MetaTagsService, PageMetaData } from "./meta-tags.service";

describe("MetaTagsService", () => {
  let spectator: SpectatorService<MetaTagsService>;
  let metaPlatform: Meta;
  let titlePlatform: Title;

  const createService = createServiceFactory({
    service: MetaTagsService,
    providers: [
      {
        provide: Title,
        useValue: {
          setTitle: jest.fn(),
        },
      },
      {
        provide: Meta,
        useValue: {
          updateTag: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    metaPlatform = spectator.inject(Meta);
    titlePlatform = spectator.inject(Title);
    jest.clearAllMocks();
  });

  it("should be created", () => {
    expect(spectator.service).toBeTruthy();
  });

  it("should update all meta tags with complete metadata", () => {
    const testMetadata: PageMetaData = {
      title: "Test Title",
      description: "Test Description",
      image: "Test Image",
      url: "Test URL",
    };

    spectator.service.updateMetaTags(testMetadata);

    expect(titlePlatform.setTitle).toHaveBeenCalledWith(testMetadata.title);
    expect(metaPlatform.updateTag).toHaveBeenCalledTimes(6);
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: "title",
      content: testMetadata.title,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: "description",
      content: testMetadata.description,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: "og:title",
      content: testMetadata.title,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: "og:description",
      content: testMetadata.description,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: "og:image",
      content: testMetadata.image,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: "og:url",
      content: testMetadata.url,
    });
  });

  it("should use default values when updating with partial metadata", () => {
    const partialMetadata = {
      title: "Partial Title",
      description: "Partial Description",
    };

    spectator.service.updateMetaTags(partialMetadata);

    expect(titlePlatform.setTitle).toHaveBeenCalledWith(partialMetadata.title);
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: "og:image",
      content: "",
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: "og:url",
      content: environment.domain,
    });
  });

  it("should handle empty metadata by using all defaults", () => {
    spectator.service.updateMetaTags({});

    expect(titlePlatform.setTitle).toHaveBeenCalledWith("Ng Store");
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: "description",
      content: "Ng Store is a store for Ng products",
    });
  });

  it("should handle metadata with empty strings", () => {
    const emptyMetadata: PageMetaData = {
      title: "",
      description: "",
      image: "",
      url: "",
    };

    spectator.service.updateMetaTags(emptyMetadata);

    expect(titlePlatform.setTitle).toHaveBeenCalledWith("");
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: "title",
      content: "",
    });
  });

  it("should handle undefined values in metadata", () => {
    const metadata = {
      title: undefined,
      description: undefined,
      image: undefined,
      url: undefined,
    };

    spectator.service.updateMetaTags(metadata);

    expect(titlePlatform.setTitle).toHaveBeenCalledWith("Ng Store");
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: "description",
      content: "Ng Store is a store for Ng products",
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: "og:image",
      content: "",
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: "og:url",
      content: environment.domain,
    });
  });

  it("should override only specified fields keeping others as default", () => {
    const partialUpdate = {
      title: "New Title",
      image: "new-image.jpg",
    };

    spectator.service.updateMetaTags(partialUpdate);

    expect(titlePlatform.setTitle).toHaveBeenCalledWith("New Title");
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: "og:image",
      content: "new-image.jpg",
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: "description",
      content: "Ng Store is a store for Ng products",
    });
  });
});
