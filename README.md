# GitHub Notifications Teams Action
Send issue and pull request notifications into Teams Channel using this GitHub Action!

## How to Send Notifications to Teams

### Teams
- Add the __Incoming Webhook__ app to a Team.
- Configure __Conectors__ in the channel where you want to receive GitHub notifications.
- Copy the __URL__ generated during the configuration process.

### Github
- Go to repository settings -> Secrets -> Actions
- Create new repository secret and paste __URL__ provided by Teams

## Configuration

| Key | Value | Required | Default |
|-------------|-------------|-------------|-------------|
| `Title` | Custom card title| **No** | - |
| `Body` | Custom card body| **No** | - |
| `show_git_footer` | True / False | **No** | True |
| `show_git_status` | True / False | **No** | True |
## Usage
Add this Action as a step to your project's GitHub Action Workflow file:

```yaml
   - name: Send notification
     uses: pablovelascoedisa/github-notifications-teams-action@V1.1.4
     with:
       teamsSecret: ${{ secrets.TEAMS }}
       title: "Custom title"
       body: "Custom body"
       show_git_footer: "false"
```

Now, in your channel, you will receive a message with the following information about your issue or pull request:

|                       | **PR**                         | **Issue**                                |
|-----------------------|------------------------------------------|------------------------------------------|
| **Title**            | ✅                        | ✅                       |
| **Comment**        | ✅                                      | ✅                                      |
| **Author**             | ✅                                      | ✅                                      |
| **Repo**       | ✅                                      | ✅                                      |
| **Reviewers** | ✅                             | ❌                                      |
| **Status** |   ✅   |  ✅   |
| **Show button** |   ✅   |  ✅   |
| **Commit button** |   ✅   |   ❌  |
| **Diff button** |   ✅   |  ❌   |

## Sample

![image](https://github.com/pablovelascoedisa/github-notifications-teams-action/assets/125445128/af3ebf1f-abd9-43b8-839f-2a627c0d7ec2)
--
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-%23FFDD00.svg?&style=for-the-badge&logo=ko-fi&logoColor=black)](https://www.buymeacoffee.com/pablovelasco)
