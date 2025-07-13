// Move jest.mock to the top and use a factory to always provide interceptors
jest.mock("axios", () => {
  const actualAxios = jest.requireActual("axios");
  return {
    ...actualAxios,
    create: jest.fn(() => ({
      interceptors: { request: { use: jest.fn((fn) => fn) } },
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    }))
  };
});

describe("apis.js", () => {
  it("does not add token if not present", () => {
    jest.resetModules();
    const axios = require("axios");
    axios.create = jest.fn();
    axios.create.mockReturnValue({
      interceptors: { request: { use: jest.fn((fn) => fn) } }
    });
    global.localStorage = {
      getItem: jest.fn(() => null),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
    const apis = require("../../src/services/apis");
    let config = { headers: {} };
    const api = apis.default;
    api.interceptors = { request: { use: (fn) => fn } };
    const result = api.interceptors.request.use((c) => c)(config);
    expect(result.headers.Authorization).toBeUndefined();
  });

  describe("authService", () => {
    it("registers a user", async () => {
      jest.resetModules();
      const axios = require("axios");
      axios.create = jest.fn();
      const mockPost = jest.fn(() => Promise.resolve({ data: "ok" }));
      axios.create.mockReturnValue({
        post: mockPost,
        interceptors: { request: { use: jest.fn((fn) => fn) } }
      });
      global.localStorage = {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      const apis = require("../../src/services/apis");
      await expect(apis.authService.register({})).resolves.toEqual({
        data: "ok"
      });
      expect(mockPost).toHaveBeenCalledWith("/auth/register", {});
    });
    it("logs in", async () => {
      jest.resetModules();
      const axios = require("axios");
      axios.create = jest.fn();
      const mockPost = jest.fn(() => Promise.resolve({ data: "ok" }));
      axios.create.mockReturnValue({
        post: mockPost,
        interceptors: { request: { use: jest.fn((fn) => fn) } }
      });
      global.localStorage = {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      const apis = require("../../src/services/apis");
      await expect(apis.authService.login({})).resolves.toEqual({
        data: "ok"
      });
      expect(mockPost).toHaveBeenCalledWith("/auth/login", {});
    });
    it("gets current user", async () => {
      jest.resetModules();
      const axios = require("axios");
      axios.create = jest.fn();
      const mockGet = jest.fn(() => Promise.resolve({ data: "me" }));
      axios.create.mockReturnValue({
        get: mockGet,
        interceptors: { request: { use: jest.fn((fn) => fn) } }
      });
      global.localStorage = {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      const apis = require("../../src/services/apis");
      await expect(apis.authService.getCurrentUser()).resolves.toEqual({
        data: "me"
      });
      expect(mockGet).toHaveBeenCalledWith("/auth/me");
    });
    it("changes password", async () => {
      jest.resetModules();
      const axios = require("axios");
      axios.create = jest.fn();
      const mockPut = jest.fn(() => Promise.resolve({ data: "ok" }));
      axios.create.mockReturnValue({
        put: mockPut,
        interceptors: { request: { use: jest.fn((fn) => fn) } }
      });
      global.localStorage = {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      const apis = require("../../src/services/apis");
      await expect(apis.authService.changePassword({})).resolves.toEqual({
        data: "ok"
      });
      expect(mockPut).toHaveBeenCalledWith("/auth/password", {});
    });
    it("updates timezone", async () => {
      jest.resetModules();
      const axios = require("axios");
      axios.create = jest.fn();
      const mockPut = jest.fn(() => Promise.resolve({ data: "ok" }));
      axios.create.mockReturnValue({
        put: mockPut,
        interceptors: { request: { use: jest.fn((fn) => fn) } }
      });
      global.localStorage = {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      const apis = require("../../src/services/apis");
      await expect(apis.authService.updateTimezone({})).resolves.toEqual({
        data: "ok"
      });
      expect(mockPut).toHaveBeenCalledWith("/auth/timezone", {});
    });
  });

  describe("eventService", () => {
    it("gets all events", async () => {
      jest.resetModules();
      const axios = require("axios");
      axios.create = jest.fn();
      const mockGet = jest.fn(() => Promise.resolve({ data: [] }));
      axios.create.mockReturnValue({
        get: mockGet,
        interceptors: { request: { use: jest.fn((fn) => fn) } }
      });
      global.localStorage = {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      const apis = require("../../src/services/apis");
      await expect(apis.eventService.getAllEvents()).resolves.toEqual({
        data: []
      });
      expect(mockGet).toHaveBeenCalledWith("/events");
    });
    it("gets event by id", async () => {
      jest.resetModules();
      const axios = require("axios");
      axios.create = jest.fn();
      const mockGet = jest.fn(() => Promise.resolve({ data: {} }));
      axios.create.mockReturnValue({
        get: mockGet,
        interceptors: { request: { use: jest.fn((fn) => fn) } }
      });
      global.localStorage = {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      const apis = require("../../src/services/apis");
      await expect(apis.eventService.getEvent(1)).resolves.toEqual({
        data: {}
      });
      expect(mockGet).toHaveBeenCalledWith("/events/1");
    });
    it("creates event", async () => {
      jest.resetModules();
      const axios = require("axios");
      axios.create = jest.fn();
      const mockPost = jest.fn(() => Promise.resolve({ data: {} }));
      axios.create.mockReturnValue({
        post: mockPost,
        interceptors: { request: { use: jest.fn((fn) => fn) } }
      });
      global.localStorage = {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      const apis = require("../../src/services/apis");
      await expect(apis.eventService.createEvent({})).resolves.toEqual({
        data: {}
      });
      expect(mockPost).toHaveBeenCalledWith("/events", {});
    });
    it("updates event", async () => {
      jest.resetModules();
      const axios = require("axios");
      axios.create = jest.fn();
      const mockPut = jest.fn(() => Promise.resolve({ data: {} }));
      axios.create.mockReturnValue({
        put: mockPut,
        interceptors: { request: { use: jest.fn((fn) => fn) } }
      });
      global.localStorage = {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      const apis = require("../../src/services/apis");
      await expect(apis.eventService.updateEvent(1, {})).resolves.toEqual({
        data: {}
      });
      expect(mockPut).toHaveBeenCalledWith("/events/1", {});
    });
    it("deletes event", async () => {
      jest.resetModules();
      const axios = require("axios");
      axios.create = jest.fn();
      const mockDelete = jest.fn(() => Promise.resolve({ data: {} }));
      axios.create.mockReturnValue({
        delete: mockDelete,
        interceptors: { request: { use: jest.fn((fn) => fn) } }
      });
      global.localStorage = {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      const apis = require("../../src/services/apis");
      await expect(apis.eventService.deleteEvent(1)).resolves.toEqual({
        data: {}
      });
      expect(mockDelete).toHaveBeenCalledWith("/events/1");
    });
    it("joins event", async () => {
      jest.resetModules();
      const axios = require("axios");
      axios.create = jest.fn();
      const mockPost = jest.fn(() => Promise.resolve({ data: {} }));
      axios.create.mockReturnValue({
        post: mockPost,
        interceptors: { request: { use: jest.fn((fn) => fn) } }
      });
      global.localStorage = {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      const apis = require("../../src/services/apis");
      await expect(apis.eventService.joinEvent(1)).resolves.toEqual({
        data: {}
      });
      expect(mockPost).toHaveBeenCalledWith("/events/1/join");
    });
    it("leaves event", async () => {
      jest.resetModules();
      const axios = require("axios");
      axios.create = jest.fn();
      const mockPost = jest.fn(() => Promise.resolve({ data: {} }));
      axios.create.mockReturnValue({
        post: mockPost,
        interceptors: { request: { use: jest.fn((fn) => fn) } }
      });
      global.localStorage = {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      const apis = require("../../src/services/apis");
      await expect(apis.eventService.leaveEvent(1)).resolves.toEqual({
        data: {}
      });
      expect(mockPost).toHaveBeenCalledWith("/events/1/leave");
    });
  });

  describe("invitationService", () => {
    it("gets invitations", async () => {
      jest.resetModules();
      const axios = require("axios");
      axios.create = jest.fn();
      const mockGet = jest.fn(() => Promise.resolve({ data: [] }));
      axios.create.mockReturnValue({
        get: mockGet,
        interceptors: { request: { use: jest.fn((fn) => fn) } }
      });
      global.localStorage = {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      const apis = require("../../src/services/apis");
      await expect(apis.invitationService.getInvitations()).resolves.toEqual({
        data: []
      });
      expect(mockGet).toHaveBeenCalledWith("/invitations");
    });
    it("accepts invitation", async () => {
      jest.resetModules();
      const axios = require("axios");
      axios.create = jest.fn();
      const mockPost = jest.fn(() => Promise.resolve({ data: {} }));
      axios.create.mockReturnValue({
        post: mockPost,
        interceptors: { request: { use: jest.fn((fn) => fn) } }
      });
      global.localStorage = {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      const apis = require("../../src/services/apis");
      await expect(apis.invitationService.acceptInvitation(1)).resolves.toEqual(
        { data: {} }
      );
      expect(mockPost).toHaveBeenCalledWith("/invitations/1/accept");
    });
    it("declines invitation", async () => {
      jest.resetModules();
      const axios = require("axios");
      axios.create = jest.fn();
      const mockPost = jest.fn(() => Promise.resolve({ data: {} }));
      axios.create.mockReturnValue({
        post: mockPost,
        interceptors: { request: { use: jest.fn((fn) => fn) } }
      });
      global.localStorage = {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      const apis = require("../../src/services/apis");
      await expect(
        apis.invitationService.declineInvitation(1)
      ).resolves.toEqual({ data: {} });
      expect(mockPost).toHaveBeenCalledWith("/invitations/1/decline");
    });
  });

  describe("userService", () => {
    it("gets all users", async () => {
      jest.resetModules();
      const axios = require("axios");
      axios.create = jest.fn();
      const mockGet = jest.fn(() => Promise.resolve({ data: [] }));
      axios.create.mockReturnValue({
        get: mockGet,
        interceptors: { request: { use: jest.fn((fn) => fn) } }
      });
      global.localStorage = {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      const apis = require("../../src/services/apis");
      await expect(apis.userService.getAllUsers()).resolves.toEqual({
        data: []
      });
      expect(mockGet).toHaveBeenCalledWith("/users");
    });
  });
});
