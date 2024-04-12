import api, { route, asApp, asUser } from "@forge/api";

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
    for (var i=0; i < issue_list.length; i++) {
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
