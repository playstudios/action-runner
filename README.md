# Private GitHub Action Runner

Run a private github action.

Currently only Javascript action is supported.

```yaml
- name: Run private action
  uses: playstudios/action-runner@v1
  with:
    action: playstudios/action-name@v1
    repo-token: ${{ secrets.REPO_TOKEN }}
    # ...action inputs...
```
