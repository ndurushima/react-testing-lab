import React from "react";
import { describe, it, beforeEach, expect, vi } from "vitest";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import AccountContainer from "../../components/AccountContainer";

describe("Search Transactions", () => {
  beforeEach(() => {
    global.setFetchResponse(global.transactions);
  });

  it("filters the list as you type", async () => {
    render(<AccountContainer />);
    await screen.findByText("Chipotle");

    const input = screen.getByPlaceholderText(
      /Search your Recent Transactions/i
    );
    fireEvent.change(input, { target: { value: "Chip" } });

    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(2);
      expect(screen.getByText("Chipotle")).toBeInTheDocument();
      expect(screen.queryByText("Lyft Ride")).toBeNull();
    });
  });
});

describe("Sort Transactions", () => {
  const two = [
    {
      id: "a",
      date: "2025-01-01",
      description: "Banana",
      category: "Food",
      amount: 1,
    },
    {
      id: "b",
      date: "2025-01-02",
      description: "Apple",
      category: "Produce",
      amount: 2,
    },
  ];

  beforeEach(() => {
    global.setFetchResponse(two);
  });

  it("sorts ascending by description", async () => {
    render(<AccountContainer />);
    await screen.findByText("Banana");

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "description" },
    });

    const rows = screen.getAllByRole("row").slice(1);
    const descs = rows.map((r) =>
      within(r).getAllByRole("cell")[1].textContent
    );
    expect(descs).toEqual(["Apple", "Banana"]);
  });

  it("sorts ascending by category", async () => {
    render(<AccountContainer />);
    await screen.findByText("Banana");

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "category" },
    });

    const rows = screen.getAllByRole("row").slice(1);
    const cats = rows.map((r) =>
      within(r).getAllByRole("cell")[2].textContent
    );
    expect(cats).toEqual(["Food", "Produce"]);
  });
});
