# Building and Publishing Docker Images with Pack CLI Locally and Remotely without writing Dockerfiles.

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Workflow](#workflow)
- [Workflow Breakdown](#workflow-breakdown)
- [Full Workflow](#full-workflow)
- [Conclusion](#conclusion)

## Introduction

This project has a workflow that shows you how to build and publish docker images with [Pack CLI](https://buildpacks.io/docs/tools/pack/) locally and remotely without writing Dockerfiles.

In this workflow, we will build a docker image for my personal portfolio application using [Cloud Native Buildpacks](https://buildpacks.io/) and publish it to [Docker Hub](https://hub.docker.com/).

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/) : Optional but required for local builds
- [Pack CLI](https://buildpacks.io/docs/tools/pack/) : Optional but required for local builds
- [Docker Hub Account](https://hub.docker.com/) : Required to publish images to your authenticated Docker Hub account
- [GitHub Account](https://github.com/) : Used to Trigger the workflow

## Workflow

> Note: The documentation/article is to show you how to use the pack cli on your next or current project. Do not use this workflow as it is. You can use it as a reference to build your own workflow.

## Workflow Breakdown

```yaml
on:
  push:
    branches:
      - main
  pull_request_target:
    branches:
      - main
```

- This specifies the triggers for the workflow. In this case, it runs whenever there is a push to the main branch or a pull request to the main branch.

```yaml
env:
  BUILDER: "heroku/builder:22"
  IMG_NAME: 'personal-portfolio'
  USERNAME: "caesarsage"
```

- This defines the environment variables that will be used in the workflow. The BUILDER variable specifies the Docker image that will be used to build the app. The IMG_NAME variable specifies the name of the Docker image that will be built and published. The USERNAME variable specifies the Docker Hub username to use when publishing the image.

```yaml
jobs:
  version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
```

- This defines a job called "version" that runs on an Ubuntu environment. The only step is to check out the code from the repository.

```yaml
dockerhub_remote_build:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v2
        
    - name: Set App Name
      run: 'echo "IMG_NAME=$(echo ${USERNAME})/$(echo ${IMG_NAME})" >> $GITHUB_ENV'

```
- This defines a job called `dockerhub_remote_build` that also runs on an Ubuntu environment. It checks out the code from the repository and sets the IMG_NAME environment variable to include the Docker Hub username and image name.


```yaml
- name: login
  uses: docker/login-action@v1
  with:
    username: ${{ env.USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

```
- This step logs in to Docker Hub using the username and password stored in the repository secrets. The username is the same as the one used in the IMG_NAME environment variable. The password is stored in the repository secrets.

```yaml
- name: Pack Remote Build
  uses: dfreilich/pack-action@v2.1.1
  with:
    args: 'build ${{ env.IMG_NAME }} --builder ${{ env.BUILDER }} --publish'
```

- This is the step that uses pack-cli tool to build a Docker image with the specified name and publish it to Docker Hub. The --builder flag specifies the Docker image to use to build the app. The --publish flag tells pack-cli to publish the image to Docker Hub. 
- This uses the `dfreilich/pack-action` to run the pack-cli commands. The `dfreilich/pack-action` is a GitHub Action that allows you to run pack-cli commands in your GitHub workflows.

```yaml
- name: Test App
  run: |
    docker run -d -p 8080:8080 --name personal-portfolio ${{ env.IMG_NAME }}
    sleep 30s
    curl --request GET --url http://localhost:8080
```
- This step runs the Docker image that was built and published in the previous step. It runs the image in detached mode and exposes port 8080. It then waits for 30 seconds before making a request to the app.
- This allows us to test the app to make sure it is working as expected.

```yaml
- name: Pack Rebase
  uses: dfreilich/pack-action@v2.1.1
  with:
    args: 'rebase ${{ env.IMG_NAME }}'
```

- This step uses pack-cli to rebase the Docker image. This is done to make sure that the image is reproducible and can be rebuilt in the future.

```yaml
- name: Inspect Image
  uses: dfreilich/pack-action@v2.1.1
  with:
    args: 'inspect-image ${{ env.IMG_NAME }}'
```

- This step uses the pack-cli tool to inspect the Docker image and display information about its layers and metadata.



```yaml

- name: Clean Up
  run: |
    docker container stop 'personal-portfolio'

```
- This step stops the Docker container that was started in the previous step.


## Full Workflow
> To see the full workflow, check the [main-pack-cli.yaml.yml](.github/workflows/main-pack-cli.yaml.yml) file in the .github/workflows directory.

## Conclusion

This workflow shows you how to build and publish Docker images with pack-cli locally and remotely without writing Dockerfiles. It also shows you how to use the pack-cli tool to inspect Docker images and rebase them to make sure they are reproducible.
