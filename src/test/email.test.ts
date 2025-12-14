import { describe, expect, it } from "bun:test";

export type ValidationLevel = "rfc5321" | "rfc5322";

interface ValidationOptions {
  level: ValidationLevel;
}

const EMAIL_PATTERNS: Record<ValidationLevel, RegExp> = {
  rfc5321:
    /^(?=.{1,256}$)(?=(?:[^@]{1,64})@)(?!.*\.\.)(?<local>(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[^"\\]|\\[\s\S]){0,62}"))@(?<domain>[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+|\[(?:(?:[0-9]{1,3}\.){3}[0-9]{1,3}|IPv6:[0-9a-fA-F:]+)\])$/,
  rfc5322:
    /^(?=.{1,998}$)(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*(?<local>"(?:[^"\\]|\\[\s\S]){0,62}"(?:\."(?:[^"\\]|\\[\s\S]){0,62}")*|"(?:[^"\\]|\\[\s\S]){0,62}"(?:\.[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64}(?:\.[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64})*)+|[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64}(?:\.[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64})*(?:\."(?:[^"\\]|\\[\s\S]){0,62}")+|[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64}(?:(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*\.(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64})*)(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*@(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*(?<domain>[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*\.(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+|\[(?:(?:[0-9]{1,3}\.){3}[0-9]{1,3}|IPv6:[0-9a-fA-F:]+)\])(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*$/,
} as const;

export const validateEmail = (email: string, options: ValidationOptions) => {
  const { level } = options;
  const pattern = EMAIL_PATTERNS[level];
  const match = pattern.exec(email);

  return {
    valid: match !== null,
    parts: match?.groups
      ? {
          local: match.groups.local,
          domain: match.groups.domain,
        }
      : undefined,
  };
};

describe("email validation", () => {
  describe("rfc5321 level", () => {
    it("validates with different RFC compliance levels", () => {
      expect(
        validateEmail("test@example.com", { level: "rfc5321" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5321 allows RFC 5322 special characters in local-part but not in domain", () => {
      expect(
        validateEmail("user@example.com", { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user+tag@example.com", { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user.name@example.com", { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user!test@example.com", { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user#test@example.com", { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@exam!ple.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@exam#ple.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@localhost", { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("validates domain name rules more strictly (RFC 1035/5321)", () => {
      expect(
        validateEmail("user@-example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@example-.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@example.com-", { level: "rfc5321" }).valid,
      ).toBeFalsy();

      const longLabel = "a".repeat(64);
      expect(
        validateEmail(`user@${longLabel}.com`, { level: "rfc5321" }).valid,
      ).toBeFalsy();

      const longDomain = `user@example.${"a".repeat(250)}.com`;
      expect(validateEmail(longDomain, { level: "rfc5321" }).valid).toBeFalsy();

      const exactLabel = "a".repeat(63);
      expect(
        validateEmail(`user@${exactLabel}.com`, { level: "rfc5321" }).valid,
      ).toBeTruthy();

      expect(
        validateEmail("user@123.example.com", { level: "rfc5321" }).valid,
      ).toBeTruthy();
    });

    it("handles domain literals (IP addresses) correctly based on RFC 5321/5322 level", () => {
      expect(
        validateEmail("user@[192.168.0.1]", { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@[IPv6:2001:db8::1]", { level: "rfc5321" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5321: path length (max 256 octets)", () => {
      const d63 = "a".repeat(63);
      const domain249 = `${d63}.${d63}.${d63}.${"a".repeat(57)}`;
      expect(domain249.length).toBe(249);

      const local5 = "a".repeat(5);
      expect(
        validateEmail(`${local5}@${domain249}`, { level: "rfc5321" }).valid,
      ).toBeTruthy();

      const local6 = "a".repeat(6);
      expect(
        validateEmail(`${local6}@${domain249}`, { level: "rfc5321" }).valid,
      ).toBeTruthy();

      const local7 = "a".repeat(7);
      expect(
        validateEmail(`${local7}@${domain249}`, { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("RFC 5321: local-part length (max 64 octets)", () => {
      const local64 = "a".repeat(64);
      expect(
        validateEmail(`${local64}@example.com`, { level: "rfc5321" }).valid,
      ).toBeTruthy();

      const local65 = "a".repeat(65);
      expect(
        validateEmail(`${local65}@example.com`, { level: "rfc5321" }).valid,
      ).toBeFalsy();

      const local32dot31 = `${"a".repeat(32)}.${"a".repeat(31)}`;
      expect(local32dot31.length).toBe(64);
      expect(
        validateEmail(`${local32dot31}@example.com`, { level: "rfc5321" })
          .valid,
      ).toBeTruthy();

      const local33dot31 = `${"a".repeat(33)}.${"a".repeat(31)}`;
      expect(local33dot31.length).toBe(65);
      expect(
        validateEmail(`${local33dot31}@example.com`, { level: "rfc5321" })
          .valid,
      ).toBeFalsy();
    });

    it("all levels reject consecutive dots", () => {
      expect(
        validateEmail("user..name@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("levels with length checks enforce 998 char total limit", () => {
      const veryLongEmail = `${"a".repeat(990)}@example.com`;
      expect(
        validateEmail(veryLongEmail, { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("RFC 5321/5322: handles domain literals correctly", () => {
      expect(
        validateEmail("user@[192.168.1.1]", { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@[IPv6:2001:db8::1]", { level: "rfc5321" }).valid,
      ).toBeTruthy();
    });

    it("RFC 1035: should reject domain labels starting or ending with a hyphen", () => {
      expect(
        validateEmail("user@-example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@example-.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("rejects strings with invalid control characters on stricter levels", () => {
      expect(
        validateEmail("user\n@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@example.com\n", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("\nuser@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@exam\nple.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user\r@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@example.com\r", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("\ruser@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@exam\rple.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("rejects malformed domain structures across all levels", () => {
      expect(validateEmail("user@", { level: "rfc5321" }).valid).toBeFalsy();
      expect(validateEmail("user@.", { level: "rfc5321" }).valid).toBeFalsy();
      expect(validateEmail("user@..", { level: "rfc5321" }).valid).toBeFalsy();
      expect(validateEmail("user@...", { level: "rfc5321" }).valid).toBeFalsy();
      expect(
        validateEmail("user@.domain.example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@domain..example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("rejects completely invalid strings across all levels", () => {
      expect(
        validateEmail("not-an-email-at-all", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(validateEmail("12345", { level: "rfc5321" }).valid).toBeFalsy();
      expect(
        validateEmail("!@#$%^&*()", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("random string with spaces", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("just-text", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("<script>alert('xss')</script>", { level: "rfc5321" })
          .valid,
      ).toBeFalsy();
      expect(
        validateEmail("../../../etc/passwd", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("SELECT * FROM users", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(validateEmail("null", { level: "rfc5321" }).valid).toBeFalsy();
      expect(
        validateEmail("undefined", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(validateEmail("true", { level: "rfc5321" }).valid).toBeFalsy();
      expect(validateEmail("false", { level: "rfc5321" }).valid).toBeFalsy();
      expect(validateEmail("{}", { level: "rfc5321" }).valid).toBeFalsy();
      expect(validateEmail("[]", { level: "rfc5321" }).valid).toBeFalsy();
      expect(validateEmail("0", { level: "rfc5321" }).valid).toBeFalsy();
      expect(validateEmail("NaN", { level: "rfc5321" }).valid).toBeFalsy();
    });

    it("rejects email-like but invalid strings across all levels", () => {
      expect(
        validateEmail("no-at-sign.example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("multiple@@at@signs.example.com", { level: "rfc5321" })
          .valid,
      ).toBeFalsy();
      expect(
        validateEmail("@no-local-part.example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("no-domain@", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("..consecutive@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("trailing..dots@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("local@.leading-domain.example.com", {
          level: "rfc5321",
        }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("local@trailing-dot.example.com.", { level: "rfc5321" })
          .valid,
      ).toBeFalsy();
      expect(
        validateEmail("local@domain..consecutive.example.com", {
          level: "rfc5321",
        }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("@@@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(validateEmail("user@@@", { level: "rfc5321" }).valid).toBeFalsy();
      expect(
        validateEmail("@domain.example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("handles Punycode (IDN) addresses", () => {
      const punycodeEmail = "user@xn--bcher-kva.com";
      expect(
        validateEmail(punycodeEmail, { level: "rfc5321" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5321: supports quoted-string in local-part", () => {
      expect(
        validateEmail('"user"@example.com', { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('"user.name"@example.com', { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('"user@domain"@example.com', { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('"user with space"@example.com', { level: "rfc5321" })
          .valid,
      ).toBeTruthy();
    });

    it("RFC 5321: rejects leading/trailing dots in dot-atom local-part", () => {
      expect(
        validateEmail(".user@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user.@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("RFC 5321: rejects comments", () => {
      expect(
        validateEmail("(comment)user@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user(comment)@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@(comment)example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@example.com(comment)", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@(comment)[127.0.0.1]", { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });
  });

  describe("rfc5322 level", () => {
    it("validates with different RFC compliance levels", () => {
      expect(
        validateEmail("test@example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5322 accepts all special characters from RFC", () => {
      const rfc5322ValidChars = "!#$%&'*+/=?^_`{|}~-";
      expect(
        validateEmail(`user${rfc5322ValidChars[0]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[1]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[2]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[3]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[4]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[5]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[6]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[7]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[8]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[9]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[10]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[11]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[12]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[13]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[14]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[15]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[16]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
    });

    it("all levels reject consecutive dots", () => {
      expect(
        validateEmail("user..name@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
    });

    it("all levels reject leading/trailing dots in local part", () => {
      expect(
        validateEmail(".user@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user.@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
    });

    it("all levels respect local part length limit of 64 chars", () => {
      const longLocal = `${"a".repeat(65)}@example.com`;
      expect(validateEmail(longLocal, { level: "rfc5322" }).valid).toBeFalsy();
    });

    it("levels with length checks enforce 998 char total limit", () => {
      const veryLongEmail = `${"a".repeat(990)}@example.com`;
      expect(
        validateEmail(veryLongEmail, { level: "rfc5322" }).valid,
      ).toBeFalsy();
    });

    it("handles quoted strings correctly based on RFC 5322 level", () => {
      expect(
        validateEmail('"user with space"@example.com', { level: "rfc5322" })
          .valid,
      ).toBeTruthy();
      expect(
        validateEmail('"user..dots"@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('".leadingdot"@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('"trailingdot."@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('"user\\"quote"@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('"user\\\\backslashes"@example.com', { level: "rfc5322" })
          .valid,
      ).toBeTruthy();
    });

    it("handles domain literals (IP addresses) correctly based on RFC 5321/5322 level", () => {
      expect(
        validateEmail("user@[192.168.0.1]", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@[IPv6:2001:db8::1]", { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("handles comments correctly based on RFC 5322 level", () => {
      expect(
        validateEmail("user(comment)@example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@(comment)example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("(comment)user@example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();

      const parts = validateEmail("user(comment)@example.com", {
        level: "rfc5322",
      });
      expect(parts.valid).toBeTruthy();

      const parts2 = validateEmail("user@(comment)example.com", {
        level: "rfc5322",
      });
      expect(parts2.valid).toBeTruthy();
      expect(parts2.parts?.domain).toBe("example.com");
    });

    it("RFC 5322: handles quoted strings with special characters", () => {
      expect(
        validateEmail('"@+;,"@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('"test@test"@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('"a\\ b"@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5322: empty quoted string in local-part is valid", () => {
      expect(
        validateEmail('""@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5322: handles various comment placements", () => {
      expect(
        validateEmail("(comment)user@example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user(comment)@example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@(comment)example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@example.com(comment)", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@(comment)[127.0.0.1]", { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5322: handles nested comments and comments around dots", () => {
      expect(
        validateEmail("user(comment(nested))@example.com", {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("first.(comment)last@example.com", { level: "rfc5322" })
          .valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@example.(comment)com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5322: handles comments with quoted characters", () => {
      expect(
        validateEmail("user(a\\(b\\)c)@example.com", { level: "rfc5322" })
          .valid,
      ).toBeTruthy();
    });

    it("RFC 5321/5322: handles domain literals correctly", () => {
      expect(
        validateEmail("user@[192.168.1.1]", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@[IPv6:2001:db8::1]", { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5322 obsolete: handles mixed quoted and unquoted local-parts", () => {
      expect(
        validateEmail('"first".last@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('first."last"@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5322: handles extra whitespace around @", () => {
      expect(
        validateEmail("user  @  example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5322: should handle comments within the domain part", () => {
      expect(
        validateEmail("user@example.(comment)com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5322: should handle whitespace around the '@' symbol", () => {
      expect(
        validateEmail("user @example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@ example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user @ example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("rejects strings with invalid control characters on stricter levels", () => {
      expect(
        validateEmail("user\n@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@example.com\n", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("\nuser@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@exam\nple.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user\r@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@example.com\r", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("\ruser@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@exam\rple.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
    });

    it("rejects emails with excessive length violations on levels with length checks", () => {
      const tooLongLocal = `${"a".repeat(65)}@example.com`;
      expect(
        validateEmail(tooLongLocal, { level: "rfc5322" }).valid,
      ).toBeFalsy();

      const tooLongTotal = `${"a".repeat(990)}@example.com`;
      expect(
        validateEmail(tooLongTotal, { level: "rfc5322" }).valid,
      ).toBeFalsy();
    });

    it("rejects malformed domain structures across all levels", () => {
      expect(validateEmail("user@", { level: "rfc5322" }).valid).toBeFalsy();
      expect(validateEmail("user@.", { level: "rfc5322" }).valid).toBeFalsy();
      expect(validateEmail("user@..", { level: "rfc5322" }).valid).toBeFalsy();
      expect(validateEmail("user@...", { level: "rfc5322" }).valid).toBeFalsy();
      expect(
        validateEmail("user@.domain.example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@domain..example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
    });

    it("rejects completely invalid strings across all levels", () => {
      expect(
        validateEmail("not-an-email-at-all", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(validateEmail("12345", { level: "rfc5322" }).valid).toBeFalsy();
      expect(
        validateEmail("!@#$%^&*()", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("random string with spaces", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("just-text", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("<script>alert('xss')</script>", { level: "rfc5322" })
          .valid,
      ).toBeFalsy();
      expect(
        validateEmail("../../../etc/passwd", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("SELECT * FROM users", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(validateEmail("null", { level: "rfc5322" }).valid).toBeFalsy();
      expect(
        validateEmail("undefined", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(validateEmail("true", { level: "rfc5322" }).valid).toBeFalsy();
      expect(validateEmail("false", { level: "rfc5322" }).valid).toBeFalsy();
      expect(validateEmail("{}", { level: "rfc5322" }).valid).toBeFalsy();
      expect(validateEmail("[]", { level: "rfc5322" }).valid).toBeFalsy();
      expect(validateEmail("0", { level: "rfc5322" }).valid).toBeFalsy();
      expect(validateEmail("NaN", { level: "rfc5322" }).valid).toBeFalsy();
    });

    it("rejects email-like but invalid strings across all levels", () => {
      expect(
        validateEmail("no-at-sign.example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("multiple@@at@signs.example.com", { level: "rfc5322" })
          .valid,
      ).toBeFalsy();
      expect(
        validateEmail("@no-local-part.example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("no-domain@", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("..consecutive@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("trailing..dots@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("local@.leading-domain.example.com", {
          level: "rfc5322",
        }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("local@trailing-dot.example.com.", { level: "rfc5322" })
          .valid,
      ).toBeFalsy();
      expect(
        validateEmail("local@domain..consecutive.example.com", {
          level: "rfc5322",
        }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("@@@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(validateEmail("user@@@", { level: "rfc5322" }).valid).toBeFalsy();
      expect(
        validateEmail("@domain.example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
    });
  });
});
