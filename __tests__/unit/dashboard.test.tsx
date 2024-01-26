import { Hello } from "@/lib/utils";

describe("Hello world", () => {
    it("greets 'bioparallel'", () => {
        expect(Hello("bioparallel")).toBe("Hello bioparallel!");
    });
});
