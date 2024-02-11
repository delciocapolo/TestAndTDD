import { describe, it, expect } from "@jest/globals";
import { debuglog } from "util";
import StandModule from "../src/stand/Stand.module";

const log = debuglog("test");

function displayData(datas: any) {
  const dataProviderReturned = JSON.stringify(datas, null, 2);
  log(`${dataProviderReturned}\n`);
}
