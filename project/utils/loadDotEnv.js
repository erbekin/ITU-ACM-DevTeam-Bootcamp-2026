import { configDotenv } from "dotenv";

export default function loadDotEnv() {
  const result = configDotenv({
    quiet : true
  })
  if ("error" in result) {
    console.error(`error while configuring .env: ${result.error}`)
    return
  }
  const keys = Object.entries(result.parsed);
  console.log(`.env: parsed (${keys.length}): [${keys.map((k) => k[0])}]`)
}
