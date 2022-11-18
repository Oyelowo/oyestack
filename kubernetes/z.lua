function printf(...) print(string.format(...)) end

local function array_contains_value (tab, val)
    for index, value in ipairs(tab) do
        if value == val then
            return true
        end
    end
    return false
end

function string.starts(String,Start)
    return string.sub(String,1,string.len(Start))==Start
end

local function any_starts_with (tab, val)
    if tab == nil then
        return nil
    end

    for index, value in ipairs(tab) do
        if string.starts(value, val) then
            return true
        end
    end
    return false
end

local actions = { "opened" , "edited", "reopened", "synchronize" }
is_master_branch = event.body.ref == "refs/heads/master"
is_main_branch = event.body.ref == "refs/heads/main"

local is_default_branch = ( (event.body["X-GitHub-Event"] == "push") and (is_master_branch or is_main_branch) )

local is_pull_request = (
        (array_contains_value(actions, event.body.action)) and 
        (event.body["X-GitHub-Event"] == "pull_request") and 
        (event.body.pull_request.state == "open") and
        ((event.body.pull_request.base.ref == "master") or (event.body.pull_request.base.ref == "master"))
        )

event.body_custom = {}
event.body_custom.html_url = event.body.repository.html_url
event.body_custom.ssh_url = event.body.repository.ssh_url
event.body_custom.clone_url = event.body.repository.clone_url
event.body_custom.repository_name = event.body.repository.name
event.body_custom.repository_full_name = event.body.repository.full_name
event.body_custom.commit_sha = event.body.after

event.body_custom.is_default_branch = is_default_branch
event.body_custom.is_pull_request = is_pull_request

local directory = "typescript/"
directory_is_modified =  (
                        any_starts_with(event.body.head_commit.modified, directory) or
                        any_starts_with(event.body.head_commit.added, directory) or
                        any_starts_with(event.body.head_commit.removed, directory)
                        )

event.body_custom.should_trigger_workflow = (is_default_branch and directory_is_modified) or is_pull_request
event.body_custom.ref = event.body.ref

if event.body.ref then
    -- Extract branch name out of ref field value e.g refs/heads/master -> master
    event.body_custom.branch = string.match(event.body.ref, "([^/]+)$")
elseif is_pull_request then
    event.body_custom.branch = event.body.pull_request.head.ref
end

printf("Mapped info start=======")

printf("directory_is_modified: %s", directory_is_modified)
printf("event.body_custom.html_url: %s", event.body_custom.html_url)
printf("event.body_custom.ssh_url: %s", event.body_custom.ssh_url)
printf("event.body_custom.clone_url: %s", event.body_custom.clone_url)
printf("event.body_custom.repository_name: %s", event.body_custom.repository_name)
printf("event.body_custom.repository_full_name: %s", event.body_custom.repository_full_name)
printf("event.body_custom.is_default_branch: %s", event.body_custom.is_default_branch)
printf("event.body_custom.is_pull_request: %s", event.body_custom.is_pull_request)
printf("event.body_custom.commit_sha: %s", event.body_custom.commit_sha)
printf("event.body_custom.should_trigger_workflow: %s", event.body_custom.should_trigger_workflow)
printf("event.body_custom.branch: %s", event.body_custom.branch)
printf("event.body_custom.ref: %s", event.body_custom.ref)

printf("Mapped info Ending=======")

return event