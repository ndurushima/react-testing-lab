import React from "react";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AccountContainer from "../../components/AccountContainer";

describe("Display Transactions on Startup", () => {
  beforeEach(() => {
    global.setFetchResponse(global.transactions);
    vi.spyOn(global, "fetch");
  });

  it("fetches and displays all transactions", async () => {
    render(<AccountContainer />);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:6001/transactions"
      )
    );

    expect(
      await screen.findByText("Lyft Ride")
    ).toBeInTheDocument();

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(global.transactions.length + 1);
  });
});
