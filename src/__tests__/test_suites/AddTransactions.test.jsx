import React from "react";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AccountContainer from "../../components/AccountContainer";

describe("Add Transactions", () => {
  const newTx = {
    id: "999",
    date: "2025-07-19",
    description: "Test Deposit",
    category: "Test",
    amount: 42,
  };

  let fetchMock;
  beforeEach(() => {
    fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        json: () => Promise.resolve([]),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(newTx),
      });
    global.fetch = fetchMock;
  });

  it("posts a new transaction and updates the list", async () => {
    render(<AccountContainer />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const dateInput = document.querySelector('input[type="date"]');
    fireEvent.change(dateInput, { target: { value: newTx.date } });

    fireEvent.change(
      screen.getByPlaceholderText("Description"),
      { target: { value: newTx.description } }
    );
    fireEvent.change(
      screen.getByPlaceholderText("Category"),
      { target: { value: newTx.category } }
    );
    fireEvent.change(
      screen.getByPlaceholderText("Amount"),
      { target: { value: newTx.amount.toString() } }
    );

    fireEvent.click(screen.getByText("Add Transaction"));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchMock).toHaveBeenLastCalledWith(
      "http://localhost:6001/transactions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: newTx.date,
          description: newTx.description,
          category: newTx.category,
          amount: newTx.amount.toString(),
        }),
      }
    );

    expect(await screen.findByText(newTx.description)).toBeInTheDocument();
  });
});
