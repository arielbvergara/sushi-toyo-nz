import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Navbar } from "../Navbar";
import { PHONE_HREF } from "@/constants/restaurant";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Navbar", () => {
  it("render_ShouldDisplaySushiToyoBranding_WhenRendered", () => {
    render(<Navbar />);
    expect(screen.getByText("Sushi Toyo")).toBeInTheDocument();
  });

  it("render_ShouldRenderNavLinks_WhenRendered", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Menu" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Hours" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Location" })).toBeInTheDocument();
  });

  it("render_ShouldLinkMenuToMenuPage_WhenRendered", () => {
    render(<Navbar />);
    const menuLink = screen.getByRole("link", { name: "Menu" });
    expect(menuLink).toHaveAttribute("href", "/menu");
  });

  it("render_ShouldLinkAboutToAnchor_WhenRendered", () => {
    render(<Navbar />);
    const aboutLink = screen.getByRole("link", { name: "About" });
    expect(aboutLink).toHaveAttribute("href", "/#about");
  });

  it("render_ShouldDisplayOrderNowButton_WhenRendered", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "Order Now" })).toBeInTheDocument();
  });

  it("render_ShouldLinkOrderNowToPhoneHref_WhenRendered", () => {
    render(<Navbar />);
    const orderNow = screen.getByRole("link", { name: "Order Now" });
    expect(orderNow).toHaveAttribute("href", PHONE_HREF);
  });

  it("render_ShouldLinkLogoToHomepage_WhenRendered", () => {
    render(<Navbar />);
    const logoLink = screen.getByRole("link", { name: "Sushi Toyo — go to home" });
    expect(logoLink).toHaveAttribute("href", "/");
  });
});
