/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { JwtPayload, jwtDecode as decode } from "jwt-decode";
import { test as setup } from "@playwright/test";
import { STORAGE_STATE } from "../playwright.config";

const mockTokenAllPermissions =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJuZGxhX3N5c3RlbSIsImV4cCI6MzI1MTg3MDY0MzAsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImh0dHBzOi8vbmRsYS5uby9uZGxhX2lkIjoieHh4eXl5IiwiaWF0IjoxNjg3NTY0ODkwLCJpc3MiOiJodHRwczovL25kbGEuZXUuYXV0aDAuY29tLyIsInBlcm1pc3Npb25zIjpbImFydGljbGVzOnB1Ymxpc2giLCJhcnRpY2xlczp3cml0ZSIsImF1ZGlvOndyaXRlIiwiY29uY2VwdDphZG1pbiIsImNvbmNlcHQ6d3JpdGUiLCJkcmFmdHM6YWRtaW4iLCJkcmFmdHM6cHVibGlzaCIsImRyYWZ0czp3cml0ZSIsImRyYWZ0czpodG1sIiwiZnJvbnRwYWdlOndyaXRlIiwiaW1hZ2VzOndyaXRlIiwibGVhcm5pbmdwYXRoOmFkbWluIiwibGVhcm5pbmdwYXRoOnB1Ymxpc2giLCJsZWFybmluZ3BhdGg6d3JpdGUiLCJ0YXhvbm9teTphZG1pbiIsInRheG9ub215OndyaXRlIl0sInN1YiI6Inh4eHl5eUBjbGllbnRzIn0.1SVkHhIe_A47fSTyVNnsSfOGvqaulddKEJho2iG--l4";

setup("authenticate", async ({ page, request }) => {
  let token = mockTokenAllPermissions;
  let expAt = "";
  if (process.env.RECORD_FIXTURES) {
    const res = await request.post("https://login.test.ndla.no/oauth/token", {
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({
        client_id: process.env.CYPRESS_NDLA_END_TO_END_TESTING_CLIENT_ID,
        client_secret: process.env.CYPRESS_NDLA_END_TO_END_TESTING_CLIENT_SECRET,
        audience: process.env.CYPRESS_NDLA_END_TO_END_TESTING_AUDIENCE,
        grant_type: process.env.CYPRESS_NDLA_END_TO_END_TESTING_GRANT_TYPE,
      }),
    });
    const data = await res.json();
    const decoded = decode<JwtPayload>(data.access_token);
    token = data.access_token;
    const exp = (decoded.exp! - decoded.iat! - 60) * 1000 + new Date().getTime();
    expAt = exp.toString();
  }
  await page.addInitScript(
    async ({ recordFixtures, token, expAt }) => {
      if (recordFixtures) {
        localStorage.setItem("access_token", token);
        localStorage.setItem("access_token_expires_at", expAt);
        localStorage.setItem("access_token_personal", "true");
      } else {
        // This number must match exp in the mockTokenAllPermissions above
        const expAt = (32518706430 - 1687564890 - 60) * 1000 + new Date().getTime();
        localStorage.setItem("access_token", token);
        localStorage.setItem("access_token_expires_at", expAt.toString());
        localStorage.setItem("access_token_personal", "true");
      }
    },
    { token, expAt, recordFixtures: process.env.RECORD_FIXTURES === "true" },
  );
  await page.goto("/");
  await page.context().storageState({ path: STORAGE_STATE });
});
