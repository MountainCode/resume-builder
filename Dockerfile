FROM node:25.1

# Install Pandoc and LaTeX Distribution
# We update the package list first.
# texlive-full is comprehensive but large (~4GB).
# texlive-xetex and texlive-luatex are sufficient for most Pandoc/Unicode needs.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        pandoc \
        texlive-luatex \
        texlive-xetex \
        texlive-fonts-extra \
        texlive-latex-extra \
        fonts-noto-color-emoji \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
# WORKDIR /usr/src/app