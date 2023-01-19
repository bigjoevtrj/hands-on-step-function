(() => {
  const dotenv = require("dotenv");
  const yaml = require("js-yaml");
  const { join } = require("path");
  const { readFileSync, writeFileSync } = require("fs");
  dotenv.config();
  const { definition } = yaml.load(
    readFileSync(join(__dirname, "../serverless-state-machines.yml")).toString()
  ).stateMachines[String(process.env["STATE_MACHINE_NAME"])];
  const functions = yaml.load(
    readFileSync(join(__dirname, "../serverless-functions.yml")).toString()
  );
  writeFileSync(
    join(__dirname, "../state-machine.json"),
    JSON.stringify(definition, null, "\t").replace(/\$\{aws:accountId\}/g, String(process.env["LOCAL_AWS_ACCOUNT_ID"])).replace(/\$\{self:custom.config.region\}/g, String(process.env["LOCAL_AWS_REGION"]))
  );
  writeFileSync(
    join(__dirname, "../functions.json"),
    JSON.stringify(functions, null, "\t")
  );
})();
