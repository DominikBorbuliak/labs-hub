FROM mcr.microsoft.com/devcontainers/javascript-node:latest

RUN corepack enable

USER node

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ENV PATH="/home/node/.local/bin:${PATH}"

RUN curl -fsSL https://gh.io/copilot-install | PREFIX="/home/node/.local" bash

RUN curl -fsSL https://claude.ai/install.sh | bash
