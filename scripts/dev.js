const { spawn } = require("node:child_process");

const nextBin = require.resolve("next/dist/bin/next");
const extraArgs = process.argv.slice(2);

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
