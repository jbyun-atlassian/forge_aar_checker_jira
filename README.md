(make sure run `npm i`)

App installaion
- `forge register`
- `forge deploy`
- `forge install`

Playing with Webtrigger to simulate Forge request to the Product (Jira)
- `forge webtrigger`
- ping the url returned (there is no auth)
- pass issue list as body ({
    "issue_list": ["AARALLOWED-1", "AARBLOCKED-1"]
})

Note;
- Forge request to the product on this Webtrigger sample is using the `issue` level api, Not project level api.
- This is because App access rule in Jira project REST is only applied under sub-container (i.e issue under project), NOT under main-container (i.e project).
- This is same as Pure Connect too
