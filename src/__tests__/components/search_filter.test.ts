/**
 * @jest-environment jsdom
 */

import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import SearchFilter from "@/components/search_filter";

const replace = jest.fn();
let mock_search_params = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace,
  }),
  useSearchParams: () => mock_search_params,
}));

describe("SearchFilter", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    replace.mockClear();
    mock_search_params = new URLSearchParams();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("preserves the current q value from the URL", () => {
    mock_search_params = new URLSearchParams("q=lucas");

    render(React.createElement(SearchFilter));

    const input = screen.getByPlaceholderText(
      "Buscar por nome, email ou telefone...",
    ) as HTMLInputElement;

    expect(input.value).toBe("lucas");
  });

  it("updates q declaratively while preserving existing params", () => {
    mock_search_params = new URLSearchParams("sort=priority");

    render(React.createElement(SearchFilter));

    fireEvent.change(
      screen.getByPlaceholderText("Buscar por nome, email ou telefone..."),
      { target: { value: "lucas" } },
    );

    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(replace).toHaveBeenCalledWith("/leads?sort=priority&q=lucas");
  });

  it("removes q when clearing the search", () => {
    mock_search_params = new URLSearchParams("sort=score&q=lucas");

    render(React.createElement(SearchFilter));

    fireEvent.click(screen.getByTitle("Limpar busca"));

    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(replace).toHaveBeenCalledWith("/leads?sort=score");
  });
});
