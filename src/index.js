import { route, asApp, asUser } from "@forge/api";

export { handler } from "./resolvers";

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
    console.log("request (webtrigger)", request);
    const reqBody = JSON.parse(request.body);
    const accountid_list = reqBody.accountid_list;
    const accountIds_queryparams = accountid_list
      .map((a) => `accountId=${a}`)
      .join("&");
    console.log("accountIds_queryparams", accountIds_queryparams);
    const product =
      reqBody.product && reqBody.product === "confluence"
        ? "confluence"
        : "jira";
    console.log("product", product);

    let results = [];
    if (product === "jira") {
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
        } catch (err) {
          results.push({
            message: `result of ${accountid} email`,
            result: `(error) ${err.message}`,
          });
        }

        try {
          const res = await asUser().requestJira(
            route`/rest/api/3/user/email?accountId=${accountid}`
          );

          const data = await res.text();
          results.push({
            message: `result of ${accountid} email (asUser)`,
            result: data,
          });
        } catch (err) {
          results.push({
            message: `result of ${accountid} email (asUser)`,
            result: `(error) ${err.message}`,
          });
        }
      }

      // consuming bulk section;
      //accountIds_queryparams: accountId=612f81b36a4c09006aa6a260&accountId=712020:65b040b2-1dc0-44d2-a121-ffa48a83e29b
      const qp = new URLSearchParams(accountIds_queryparams);
      try {
        // this is also working;
        // const res = await asApp().requestJira(
        //   assumeTrustedRoute(
        //     `/rest/api/3/user/email/bulk?${accountIds_queryparams}`
        //   )
        // );
        
        const res = await asApp().requestJira(
          route `/rest/api/3/user/email/bulk?${qp}`
        );

        const data = await res.text();
        results.push({
          message: `result of ${accountid_list.toString()} email/bulk`,
          result: data,
        });
      } catch (err) {
        results.push({
          message: `result of ${accountid_list.toString()} email/bulk`,
          result: `(error) ${err.message}`,
        });
      }

      try {
        const res = await asUser().requestJira(
          route`/rest/api/3/user/email/bulk?${qp}`
        );

        const data = await res.text();
        results.push({
          message: `result of ${accountid_list.toString()} email/bulk (asUser)`,
          result: data,
        });
      } catch (err) {
        results.push({
          message: `result of ${accountid_list.toString()} email/bulk (asUser)`,
          result: `(error) ${err.message}`,
        });
      }
    } else {
      // Confluence request
      for (var i = 0; i < accountid_list.length; i++) {
        const accountid = accountid_list[i];
        try {
          const res = await asApp().requestConfluence(
            route`/wiki/rest/api/user/email?accountId=${accountid}`
          );

          const data = await res.text();
          results.push({
            message: `result of ${accountid} email`,
            result: data,
          });
        } catch (err) {
          results.push({
            message: `result of ${accountid} email`,
            result: `(error) ${err.message}`,
          });
        }

        try {
          const res = await asUser().requestConfluence(
            route`/wiki/rest/api/user/email?accountId=${accountid}`
          );

          const data = await res.text();
          results.push({
            message: `result of ${accountid} email (asUser)`,
            result: data,
          });
        } catch (err) {
          results.push({
            message: `result of ${accountid} email (asUser)`,
            result: `(error) ${err.message}`,
          });
        }
      }

      // consuming bulk section;
      const qp = new URLSearchParams(accountIds_queryparams);
      try {
        const res = await asApp().requestConfluence(
          route`/wiki/rest/api/user/email/bulk?${qp}`
        );

        const data = await res.text();
        results.push({
          message: `result of ${accountid_list.toString()} email/bulk`,
          result: data,
        });
      } catch (err) {
        results.push({
          message: `result of ${accountid_list.toString()} email/bulk`,
          result: `(error) ${err.message}`,
        });
      }

      try {
        const res = await asUser().requestConfluence(
          route`/wiki/rest/api/user/email/bulk?${qp}`
        );

        const data = await res.text();
        results.push({
          message: `result of ${accountid_list.toString()} email/bulk (asUser)`,
          result: data,
        });
      } catch (err) {
        results.push({
          message: `result of ${accountid_list.toString()} email/bulk (asUser)`,
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
