import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InvitationsPage from "../../src/pages/InvitationsPage";
import * as apis from "../../src/services/apis";

jest.mock("../../src/services/apis");

describe("InvitationsPage", () => {
  const mockInvitations = [
    {
      id: 1,
      event: {
        title: "Event 1",
        description: "Desc 1",
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
        location: "Room 1",
        priority: "high",
        tags: ["work"],
        owner: { name: "Owner" }
      },
      createdAt: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    apis.invitationService.getInvitations.mockResolvedValue({
      data: mockInvitations
    });
    apis.invitationService.acceptInvitation.mockResolvedValue({});
    apis.invitationService.declineInvitation.mockResolvedValue({});
  });

  it("shows loading spinner initially", () => {
    apis.invitationService.getInvitations.mockReturnValue(
      new Promise(() => {})
    );
    render(<InvitationsPage />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders invitations after loading", async () => {
    render(<InvitationsPage />);
    expect(await screen.findByText(/event 1/i)).toBeInTheDocument();
    expect(screen.getByText(/desc 1/i)).toBeInTheDocument();
    expect(screen.getByText(/owner/i)).toBeInTheDocument();
  });

  it("renders empty state if no invitations", async () => {
    apis.invitationService.getInvitations.mockResolvedValueOnce({ data: [] });
    render(<InvitationsPage />);
    expect(
      await screen.findByText(/no pending invitations/i)
    ).toBeInTheDocument();
  });

  it("handles error state if fetch fails", async () => {
    apis.invitationService.getInvitations.mockRejectedValueOnce({});
    render(<InvitationsPage />);
    expect(
      await screen.findByText(/failed to load invitations/i)
    ).toBeInTheDocument();
  });

  it("accepts an invitation", async () => {
    render(<InvitationsPage />);
    await screen.findByText(/event 1/i);
    fireEvent.click(screen.getByRole("button", { name: /accept/i }));
    await waitFor(() =>
      expect(apis.invitationService.acceptInvitation).toHaveBeenCalled()
    );
  });

  it("declines an invitation", async () => {
    render(<InvitationsPage />);
    await screen.findByText(/event 1/i);
    fireEvent.click(screen.getByRole("button", { name: /decline/i }));
    await waitFor(() =>
      expect(apis.invitationService.declineInvitation).toHaveBeenCalled()
    );
  });

  it("handles error on accept/decline", async () => {
    apis.invitationService.acceptInvitation.mockRejectedValueOnce({});
    render(<InvitationsPage />);
    await screen.findByText(/event 1/i);
    fireEvent.click(screen.getByRole("button", { name: /accept/i }));
    expect(
      await screen.findByText(/failed to accept invitation/i)
    ).toBeInTheDocument();
  });
});
