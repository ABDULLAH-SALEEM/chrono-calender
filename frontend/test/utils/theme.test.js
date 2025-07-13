import { createTheme } from "@mui/material/styles";
import theme from "../../src/utils/theme";

describe("Theme Configuration", () => {
  test("should export a valid Material-UI theme", () => {
    expect(theme).toBeDefined();
    expect(typeof theme).toBe("object");
    expect(theme.palette).toBeDefined();
    expect(theme.components).toBeDefined();
  });

  test("should have correct primary palette configuration", () => {
    expect(theme.palette.primary).toBeDefined();
    expect(theme.palette.primary.main).toBe("#000000");
    expect(theme.palette.primary.contrastText).toBe("#ffffff");
  });

  test("should have MuiButton component overrides", () => {
    expect(theme.components.MuiButton).toBeDefined();
    expect(theme.components.MuiButton.styleOverrides).toBeDefined();
    expect(
      theme.components.MuiButton.styleOverrides.containedPrimary
    ).toBeDefined();
    expect(
      theme.components.MuiButton.styleOverrides.outlinedPrimary
    ).toBeDefined();
  });

  test("should have correct containedPrimary button styling", () => {
    const containedPrimary =
      theme.components.MuiButton.styleOverrides.containedPrimary;

    expect(containedPrimary.backgroundColor).toBe("#000000");
    expect(containedPrimary.color).toBe("#ffffff");
    expect(containedPrimary["&:hover"]).toBeDefined();
    expect(containedPrimary["&:hover"].backgroundColor).toBe("#222222");
  });

  test("should have correct outlinedPrimary button styling", () => {
    const outlinedPrimary =
      theme.components.MuiButton.styleOverrides.outlinedPrimary;

    expect(outlinedPrimary.borderColor).toBe("#000000");
    expect(outlinedPrimary.color).toBe("#000000");
    expect(outlinedPrimary["&:hover"]).toBeDefined();
    expect(outlinedPrimary["&:hover"].backgroundColor).toBe("rgba(0,0,0,0.04)");
    expect(outlinedPrimary["&:hover"].borderColor).toBe("#000000");
  });

  test("should be a valid Material-UI theme object", () => {
    // Test that the theme can be used with Material-UI
    expect(theme.palette).toBeDefined();
    expect(theme.components).toBeDefined();
    expect(theme.spacing).toBeDefined();
    expect(theme.breakpoints).toBeDefined();
  });

  test("should maintain theme structure integrity", () => {
    // Test that all required theme properties are present
    const requiredProperties = [
      "palette",
      "components",
      "spacing",
      "breakpoints",
      "typography",
      "shape",
      "shadows"
    ];

    requiredProperties.forEach((prop) => {
      expect(theme[prop]).toBeDefined();
    });
  });

  test("should have consistent color scheme", () => {
    // Test that the color scheme is consistent throughout the theme
    expect(theme.palette.primary.main).toBe("#000000");
    expect(
      theme.components.MuiButton.styleOverrides.containedPrimary.backgroundColor
    ).toBe("#000000");
    expect(
      theme.components.MuiButton.styleOverrides.outlinedPrimary.borderColor
    ).toBe("#000000");
    expect(
      theme.components.MuiButton.styleOverrides.outlinedPrimary.color
    ).toBe("#000000");
  });

  test("should have proper hover state configurations", () => {
    // Test that hover states are properly configured
    const containedHover =
      theme.components.MuiButton.styleOverrides.containedPrimary["&:hover"];
    const outlinedHover =
      theme.components.MuiButton.styleOverrides.outlinedPrimary["&:hover"];

    expect(containedHover).toBeDefined();
    expect(outlinedHover).toBeDefined();
    expect(typeof containedHover.backgroundColor).toBe("string");
    expect(typeof outlinedHover.backgroundColor).toBe("string");
    expect(typeof outlinedHover.borderColor).toBe("string");
  });
});
