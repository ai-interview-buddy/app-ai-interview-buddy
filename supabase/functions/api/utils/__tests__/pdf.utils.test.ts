import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert@1";
import { readPdf } from "../pdf.utils.ts";

Deno.test("readPdf extracts page count and full text from PDF", async () => {
  const filePath = "./utils/__tests__/fixtures/cv-jon-doe.pdf";
  const data = Deno.readFileSync(filePath);

  // Act
  const result = await readPdf(data.buffer);
  console.log(result);

  // Assert
  assertEquals(typeof result.pageCount, "number");
  assertEquals(typeof result.content, "string");
  assert(result.pageCount > 0, "PDF should have at least one page");
  assert(result.content.length > 0, "Extracted content should not be empty");
  assertStringIncludes(result.content, "John Doe", "Design apparel print for an innovative retail company");
});

Deno.test("readPdf extracts page count and full text from PDF", async () => {
  const filePath = "./utils/__tests__/fixtures/cv-example.pdf";
  const data = Deno.readFileSync(filePath);

  // Act
  const result = await readPdf(data.buffer);
  console.log(result);

  // Assert
  assertEquals(typeof result.pageCount, "number");
  assertEquals(typeof result.content, "string");
  assert(result.pageCount > 0, "PDF should have at least one page");
  assert(result.content.length > 0, "Extracted content should not be empty");
  assertStringIncludes(result.content, "Forename", "professional email address");
});
