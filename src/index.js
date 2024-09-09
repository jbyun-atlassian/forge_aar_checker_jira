import api, { route, asApp, asUser } from "@forge/api";

export { handler } from './resolvers';


exports.runWebTrigger = async (request) => {
  try {
    const reqBody = JSON.parse(request.body);
    const issue_list = reqBody.issue_list;
    if (!issue_list) {
      throw new Error("issue_list property is missing in the request body.");
    }

    if (!Array.isArray(issue_list)) {
      throw new Error("issue_list property must be array in the request body.");
    }

    let results = [];
    for (var i = 0; i < issue_list.length; i++) {
      const issue = issue_list[i];
      try {
        const res = await asApp().requestJira(
          route`/rest/api/3/issue/${issue}`
        );

        const data = await res.json();
        results.push({
          message: `result of ${issue}`,
          result: data,
        });
      } catch (err) {
        results.push({
          message: `result of ${issue}`,
          result: `(error) ${err.message}`,
        });
      }
    }

    return {
      body: JSON.stringify(results),
      headers: {
        "Content-Type": ["application/json"],
        // 'X-Request-Id': [`rnd-${rnd}`]
      },
      statusCode: 200,
      statusText: "Triggered",
    };
  } catch (e) {
    console.error(e);
    return {
      body: JSON.stringify({
        message: `make sure you gotta pass "issue_list" (i.e { "issue_list": ["issueA", "issueB"] }) in a request body. ${e}`,
      }),
      headers: {
        "Content-Type": ["application/json"],
        // 'X-Request-Id': [`rnd-${rnd}`]
      },
      statusCode: 409,
      statusText: "Triggered",
    };
  }
};

exports.runWebTriggerForUser = async (request) => {
  try {
    const reqBody = JSON.parse(request.body);
    const accountid_list = reqBody.accountid_list;

    let results = [];
    for (var i = 0; i < accountid_list.length; i++) {
      const accountid = accountid_list[i];
      try {
        const res = await asApp().requestJira(
          route`/rest/api/3/user?accountId=${accountid}`
        );

        const data = await res.text();
        results.push({
          message: `result of ${accountid} user`,
          result: data,
        });

        const res2 = await asUser().requestJira(
          route`/rest/api/3/user?accountId=${accountid}`
        );

        const data2 = await res2.text();
        results.push({
          message: `result of ${accountid} user (asUser)`,
          result: data2,
        });
      } catch (err) {
        results.push({
          message: `result of ${accountid}`,
          result: `(error) ${err.message}`,
        });
      }
    }

    return {
      body: JSON.stringify(results),
      headers: {
        "Content-Type": ["application/json"],
        // 'X-Request-Id': [`rnd-${rnd}`]
      },
      statusCode: 200,
      statusText: "Triggered",
    };
  } catch (e) {
    console.error(e);
    return {
      body: JSON.stringify({
        message: `something wrong. ${e}`,
      }),
      headers: {
        "Content-Type": ["application/json"],
        // 'X-Request-Id': [`rnd-${rnd}`]
      },
      statusCode: 409,
      statusText: "Triggered",
    };
  }
};

exports.runWebTriggerForEmail = async (request) => {
  try {
    const reqBody = JSON.parse(request.body);
    const accountid_list = reqBody.accountid_list;

    let results = [];
    for (var i = 0; i < accountid_list.length; i++) {
      const accountid = accountid_list[i];
      try {
        const res = await asApp().requestJira(
          route`/rest/api/3/user/email?accountId=${accountid}`
        );

        const data = await res.text();
        results.push({
          message: `result of ${accountid} email`,
          result: data,
        });

        const res2 = await asUser().requestJira(
          route`/rest/api/3/user/email?accountId=${accountid}`
        );

        const data2 = await res2.text();
        results.push({
          message: `result of ${accountid} email (asUser)`,
          result: data2,
        });
      } catch (err) {
        results.push({
          message: `result of ${accountid}`,
          result: `(error) ${err.message}`,
        });
      }
    }

    return {
      body: JSON.stringify(results),
      headers: {
        "Content-Type": ["application/json"],
        // 'X-Request-Id': [`rnd-${rnd}`]
      },
      statusCode: 200,
      statusText: "Triggered",
    };
  } catch (e) {
    console.error(e);
    return {
      body: JSON.stringify({
        message: `something wrong. ${e}`,
      }),
      headers: {
        "Content-Type": ["application/json"],
        // 'X-Request-Id': [`rnd-${rnd}`]
      },
      statusCode: 409,
      statusText: "Triggered",
    };
  }
};
