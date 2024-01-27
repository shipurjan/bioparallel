import os from "os";
import path from "path";
import { ChildProcessByStdio, spawn, spawnSync } from "child_process";
import { Builder, By, Capabilities, WebDriver } from "selenium-webdriver";
import { Writable } from "stream";

// create the path to the expected application binary
const application = path.resolve(
    __dirname,
    "..",
    "..",
    "src-tauri",
    "target",
    "release",
    "bioparallel.exe"
);

// cargo install tauri-driver
const tauriDriverPath = path.resolve(
    os.homedir(),
    ".cargo",
    "bin",
    "tauri-driver.exe"
);

// keep track of the webdriver instance we create
let driver: WebDriver | undefined;

// keep track of the tauri-driver process we start
let tauriDriver: ChildProcessByStdio<Writable, null, null> | undefined;

beforeAll(async () => {
    // set timeout to 2 minutes to allow the program to build if it needs to

    // ensure the program has been built
    spawnSync("cargo", ["build", "--release"]);

    // start tauri-driver
    tauriDriver = spawn(tauriDriverPath, [], {
        stdio: [null, process.stdout, process.stderr],
    });

    // msedgedriver https://developer.microsoft.com/en-gb/microsoft-edge/tools/webdriver?form=M401KO
    const capabilities = new Capabilities();
    capabilities.set("tauri:options", { application });
    capabilities.setBrowserName("wry");

    // start the webdriver client
    driver = await new Builder()
        .withCapabilities(capabilities)
        .usingServer("http://127.0.0.1:4444/")
        .build();
}, 120000);

afterAll(async () => {
    // kill the tauri-driver process
    if (tauriDriver !== undefined) tauriDriver.kill();

    // stop the webdriver session
    if (driver !== undefined) await driver.quit();
});

describe("Hello Tauri", () => {
    it("should be cordial", async () => {
        const dashboard = await driver
            ?.findElement(By.css("[data-testid='dashboard-container']"))
            .isDisplayed();
        expect(dashboard).toBe(true);
    });
});
