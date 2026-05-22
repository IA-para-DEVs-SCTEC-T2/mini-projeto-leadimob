import { delete_lead } from "@/services/delete_lead";
import type { LeadRepository } from "@/types/lead";

describe("delete_lead", () => {
  const mock_repository: LeadRepository = {
    create: jest.fn(),
    find_all: jest.fn(),
    find_by_id: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete lead by id", async () => {
    (mock_repository.delete as jest.Mock).mockResolvedValue(undefined);

    await delete_lead(mock_repository, "lead-123", "corretor-test-id");

    expect(mock_repository.delete).toHaveBeenCalledWith("lead-123", "corretor-test-id");
    expect(mock_repository.delete).toHaveBeenCalledTimes(1);
  });

  it("should propagate repository errors", async () => {
    const error = new Error("Database error");
    (mock_repository.delete as jest.Mock).mockRejectedValue(error);

    await expect(delete_lead(mock_repository, "lead-123", "corretor-test-id")).rejects.toThrow("Database error");
  });

  it("should handle non-existent lead gracefully", async () => {
    const error = { error: "LEAD_NOT_FOUND" };
    (mock_repository.delete as jest.Mock).mockRejectedValue(error);

    await expect(delete_lead(mock_repository, "non-existent-id", "corretor-test-id")).rejects.toEqual(error);
  });
});