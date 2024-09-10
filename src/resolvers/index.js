import Resolver from "@forge/resolver";
import api, { route, asApp, asUser } from "@forge/api";

const resolver = new Resolver();

resolver.define("getText", async (req) => {
  console.log(req);
  console.log("loggedin user", req.context.accountId);
  const accountid = req.context.accountId;
  const installationContext = req.context.installContext;
  const isJira = installationContext.includes("jira");
  console.log("installationContext", installationContext);
  let res;
  if (isJira) {
    res = await asApp().requestJira(
      route`/rest/api/3/user/email?accountId=${accountid}`
    );
  } else {
    // res = await asApp().requestConfluence(
    //   route`/wiki/rest/api/user/email?accountId=${accountid}`
    // );

    res = await asApp().requestConfluence(
      route`/rest/api/user/email?accountId=${accountid}`
    );
  }

  const data = await res.text();
  console.log("res", data);
  return data;
});

resolver.define("getText2", async (req) => {
  console.log(req);
  console.log("loggedin user", req.context.accountId);
  const accountid = req.context.accountId;
  const installationContext = req.context.installContext;
  const isJira = installationContext.includes("jira");
  console.log("installationContext", installationContext);
  let data;
  try {
    let res;
    if (isJira) {
      res = await asUser().requestJira(
        route`/rest/api/3/user/email?accountId=${accountid}`
      );
    } else {
      res = await asUser().requestConfluence(
        route`/rest/api/user/email?accountId=${accountid}`
      );
    }
    data = await res.text();
    console.log("res-asuser", data);
  } catch (ex) {
    console.log("error-asuser", ex);
    data = ex.message;
  }

  return data;
});

export const handler = resolver.getDefinitions();
