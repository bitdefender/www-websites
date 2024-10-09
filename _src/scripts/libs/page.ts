export const COUNTRIES = {
  au: "au",
  be: "be",
  br: "br",
  de: "de",
  es: "es",
  fr: "fr",
  gb: "gb",
  it: "it",
  nl: "nl",
  pt: "pt",
  ro: "ro",
  se: "se",
  us: "us",
} as const;

export type DomainsType = keyof typeof COUNTRIES;

/**
 * This class should hold all the page related information
 */
export class Page {
  static country: DomainsType;

  static langauge: string;

  /**
   * BCP 47 language tag
   * ex: es-MX, en-US
   */
  static locale: string;

  static {
    this.country = (document
      .querySelector<HTMLInputElement>("input#country")
      ?.value.toLowerCase() || "us") as DomainsType;

    this.langauge =
      document
        .querySelector<HTMLInputElement>("input#language")
        ?.value.toLowerCase()
        .split("-")[0] || "en";

    this.locale =  `${this.langauge}-${this.country.toUpperCase()}`;
  }
}
