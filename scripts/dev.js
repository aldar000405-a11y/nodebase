const { execFile, spawn } = require("node:child_process");
const { promisify } = require("node:util");

const execFileAsync = promisify(execFile);

const nextBin = require.resolve("next/dist/bin/next");
const extraArgs = process.argv.slice(2);

const toWindowsPathForLike = (value) => value.replaceAll("'", "''");

const stopStaleNextDevOnWindows = async () => {
  if (process.platform !== "win32") return;

  const cwdLike = toWindowsPathForLike(process.cwd());
  const psScript = `
$ErrorActionPreference = 'SilentlyContinue'
$procs = Get-CimInstance Win32_Process | Where-Object {
  ($_.Name -match '^node(\\.exe)?$') -and
  $_.CommandLine -and
  $_.CommandLine -like '*${cwdLike}*' -and
  (
    $_.CommandLine -like '*next\\dist\\bin\\next*' -or
    $_.CommandLine -like '*next\\dist\\server\\lib\\start-server.js*'
  )
}
$procs | Select-Object -ExpandProperty ProcessId
`;

  const { stdout } = await execFileAsync(
    "powershell.exe",
    ["-NoProfile", "-Command", psScript],
    { windowsHide: true },
  );

  const pids = stdout
    .split(/\r?\n/)
    .map((line) => Number.parseInt(line.trim(), 10))
    .filter((pid) => Number.isInteger(pid) && pid > 0);

  if (!pids.length) return;

  for (const pid of pids) {
    try {
      await execFileAsync("taskkill", ["/PID", String(pid), "/F"], {
        windowsHide: true,
      });
    } catch {
      // Ignore race conditions where process exits before kill.
    }
  }
};

const main = async () => {
  await stopStaleNextDevOnWindows();

  const child = spawn(process.execPath, [nextBin, "dev", ...extraArgs], {
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "development",
    },
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});