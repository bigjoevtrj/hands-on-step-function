(() => {
  const output: string[] = [];
  const dotenv = require("dotenv");
  const { States } = require("../state-machine.json");
  const functions = require("../functions.json");
  const { writeFileSync } = require("fs");
  const input = process.argv[2];

  dotenv.config();

  output.push("docker-compose up -d");
  output.push("npm run package");

  Object.keys(States).forEach((key) => {
    if (States[key].Type === "Task") {
      output.push(
        `aws lambda --endpoint http://localhost:${
          process.env.LOCALSTACK_PORT || 4566
        } create-function --function-name ${key} --runtime nodejs16.x --handler ${functions[key].handler} --role arn:aws:iam::012345678901:role/DummyRole --zip-file fileb://.serverless/${process.env.STATE_MACHINE_NAME}.zip`
      );
    }
  });

  output.push(
    `aws stepfunctions --endpoint http://localhost:${
      process.env.DOCKER_PORT || 8083
    } create-state-machine --definition file://state-machine.json --name "ExampleTemplate" --role-arn "arn:aws:iam::012345678901:role/DummyRole"`
  );

  output.push(
    `aws stepfunctions --endpoint http://localhost:${
      process.env.DOCKER_PORT || 8083
    } start-execution --state-machine arn:aws:states:us-east-1:123456789012:stateMachine:ExampleTemplate --name test ${
      input ? `--input "${input.replace(/"/g, '\\"')}"` : ""
    }`
  );
  output.push(`
function shutdown() {
  echo $1
  echo $2
  docker-compose down -v
  rm -rf dist
  rm -rf .serverless
  exit $3
}

while true; do
  output=$(aws stepfunctions --endpoint http://localhost:${
    process.env.DOCKER_PORT || 8083
  } describe-execution --execution-arn arn:aws:states:us-east-1:123456789012:execution:ExampleTemplate:test 2>&1)
  case $output in
  *'SUCCEEDED'*)
    shutdown "\${GREEN}***EXECUTION SUCCESSFUL!***\${NC}" "$output" "0"
    ;;

  *'FAILED'*)
    shutdown "\${RED}***EXECUTION FAILED!***\${NC}" "$output" "1"
    ;;
  esac
done
`);
  writeFileSync("./steps.sh", output.join("\n"));
})();
