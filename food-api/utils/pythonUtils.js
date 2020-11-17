const path = require("path");
const util = require("util");
const { execFile } = require("child_process");
const execFilePromise = util.promisify(execFile);

module.exports.getRestaurants = async () => {
  const { error, stdout, stderr } = await execFilePromise(
    "python3",
    ["./utils/get_restaurants.py"],
    { maxBuffer: 1024 * 1024 * 20 }
  );
  if (error) console.error(`exec error: ${error}`);
  if (stderr) console.error(`exec error: ${error}`);
  return stdout;
};
