# org-repo-auto-setting
[![Build Status](https://github.com/Kesin11/org-repo-auto-setting/workflows/CI/badge.svg)](https://github.com/Kesin11/org-repo-auto-setting/actions)


> A GitHub App built with [Probot](https://github.com/probot/probot) that sync default settings when org repository created. It inspired by [probot/settings](https://github.com/probot/settings).

This GitHub App syncs repository settings defined in [`configs/default.yml`](./configs/default.yml)  to GitHub when new repository created in your org.

This app is designed to change the default settings for each org. Therefore, you have to modify `default.yml` for your prefer settings and create new GitHub app and deploy it yourself.

## Usage
1. Fork this repository.
2. Modify `configs/default.yml` for your prefer settings.
3. Create new GitHub App according to [Probot guide](https://probot.github.io/docs/development/).
4. Create and fill `.env` to your app config.
5. Deploy forked repository to your infrastructure.
6. Install your GitHub app to your org.
7. Create new repository!
8. If you want to revert to GitHub default repository settings, see initial issue created by app and click checkbox.

## How it works
This app observes installed org webhook `repository.created` and syncs repository settings. You can change the default settings by modifying `configs/default.yml`.

```yaml
# `description` use to initial setup issue
description:
  name: Default
  label: Setup `WIP` and `In Review` labels.
  repository: Disable wiki and projects.
  branch: Protect master branch.

# `labels` use to sync issue labels.
labels:
  - name: "WIP"
    color: "ffff00"
    description: Work in progress.
  - name: "In Review"
    color: "0000ff"

# `repository` use to sync repository settings.
repository:
  has_projects: false
  has_wiki: false

# `branches` use to sync branch protection rules.
branches:
  - name: master
    # https://developer.github.com/v3/repos/branches/#update-branch-protection
    # Branch Protection settings. Set to null to disable
    protection:
      # Required. Require at least one approving review on a pull request, before merging. Set to null to disable.
      required_pull_request_reviews:
        # The number of approvals required. (1-6)
        required_approving_review_count: 1
        # Dismiss approved reviews automatically when a new commit is pushed.
        dismiss_stale_reviews: true
        # Blocks merge until code owners have reviewed.
        require_code_owner_reviews: true
        # Specify which users and teams can dismiss pull request reviews. Pass an empty dismissal_restrictions object to disable. User and team dismissal_restrictions are only available for organization-owned repositories. Omit this parameter for personal repositories.
        dismissal_restrictions:
          users: []
          teams: []
      # Required. Require status checks to pass before merging. Set to null to disable
      required_status_checks:
        # Required. Require branches to be up to date before merging.
        strict: true
        # Required. The list of status checks to require in order to merge into this branch
        contexts: []
      # Required. Enforce all configured restrictions for administrators. Set to true to enforce required status checks for repository administrators. Set to null to disable.
      enforce_admins: true
      # Required. Restrict who can push to this branch. Team and user restrictions are only available for organization-owned repositories. Set to null to disable.
      restrictions:
        users: []
        teams: []
```

## Start bot

```sh
# Install dependencies
npm install

# Run typescript
npm run build

# Run the bot
npm start
```

## Start bot with docker

```sh
# Build docker images.
docker build  -t org-repo-auto-setting:latest .

# Run the bot
docker run -p {HOST_PORT}:{CONTAINER_PORT} org-repo-auto-setting:latest
```

## License

[ISC](LICENSE) © 2019 Kenta Kase <kesin1202000@gmail.com>
